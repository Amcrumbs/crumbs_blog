import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import {
  getAdminCookieName,
  getAdminGuardCookieName,
  getAdminPassword,
  getAdminSessionSecret,
  isAdminConfigured,
  isProduction,
} from "@/lib/admin-access-config";
import {
  createAdminSessionToken,
  verifyAdminSessionToken as verifyAdminSessionTokenValue,
} from "@/lib/admin-session-token";

type AdminGuardPayload = {
  type: "admin-guard";
  attempts: number;
  updatedAt: number;
  lockedUntil: number;
  ip: string | null;
};

type VerifiedToken<T> = {
  ok: true;
  payload: T;
} | {
  ok: false;
};

const adminSessionDurationSeconds = 60 * 60 * 8;
const adminGuardWindowMs = 10 * 60 * 1000;
const adminGuardLockMs = 10 * 60 * 1000;
const adminGuardMaxAttempts = 5;
const adminGuardDelayMs = 900;

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const expected = Buffer.from(a);
  const actual = Buffer.from(b);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload: string) {
  return createHmac("sha256", `${getAdminSessionSecret()}\0${getAdminPassword()}`)
    .update(payload)
    .digest("base64url");
}

function createSignedToken<T extends { type: string }>(payload: T) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function verifySignedToken<T extends { type: string }>(
  token: string | undefined,
  expectedType: T["type"],
): VerifiedToken<T> {
  if (!token) {
    return { ok: false };
  }

  const [encodedPayload, signature, extra] = token.split(".");
  if (!encodedPayload || !signature || extra) {
    return { ok: false };
  }

  const expectedSignature = signPayload(encodedPayload);
  if (!safeEqual(signature, expectedSignature)) {
    return { ok: false };
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as T;
    if (payload.type !== expectedType) {
      return { ok: false };
    }

    return { ok: true, payload };
  } catch {
    return { ok: false };
  }
}

async function resolveRequestIp() {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    const [first] = forwarded.split(",");
    const ip = first?.trim();
    if (ip) return ip;
  }

  return headerStore.get("x-real-ip")?.trim() || null;
}

async function readAdminGuardState() {
  const jar = await cookies();
  const verified = verifySignedToken<AdminGuardPayload>(
    jar.get(getAdminGuardCookieName())?.value,
    "admin-guard",
  );

  return verified.ok ? verified.payload : null;
}

async function writeAdminGuardState(state: AdminGuardPayload) {
  const jar = await cookies();
  jar.set(getAdminGuardCookieName(), createSignedToken(state), {
    httpOnly: true,
    sameSite: "strict",
    secure: isProduction(),
    path: "/",
    maxAge: Math.ceil(adminGuardWindowMs / 1000),
  });
}

async function clearAdminGuardState() {
  const jar = await cookies();
  jar.set(getAdminGuardCookieName(), "", {
    httpOnly: true,
    sameSite: "strict",
    secure: isProduction(),
    path: "/",
    maxAge: 0,
  });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function verifyAdminPassword(password: string) {
  if (!isAdminConfigured()) {
    return false;
  }

  return safeEqual(digest(password), digest(getAdminPassword()));
}

export async function verifyAdminSessionToken(token: string | undefined, now = Date.now()) {
  if (!isAdminConfigured()) {
    return false;
  }

  return verifyAdminSessionTokenValue(token, getAdminSessionSecret(), getAdminPassword(), now);
}

export async function verifyAdminSession() {
  if (!isAdminConfigured()) {
    return false;
  }

  const jar = await cookies();
  return verifyAdminSessionToken(jar.get(getAdminCookieName())?.value);
}

export async function createAdminSession() {
  const jar = await cookies();
  const now = Date.now();
  const payload = {
    type: "admin-access",
    issuedAt: now,
    expiresAt: now + adminSessionDurationSeconds * 1000,
  } as const;

  jar.set(
    getAdminCookieName(),
    await createAdminSessionToken(payload, getAdminSessionSecret(), getAdminPassword()),
    {
      httpOnly: true,
      sameSite: "strict",
      secure: isProduction(),
      path: "/",
      maxAge: adminSessionDurationSeconds,
    },
  );
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.set(getAdminCookieName(), "", {
    httpOnly: true,
    sameSite: "strict",
    secure: isProduction(),
    path: "/",
    maxAge: 0,
  });
}

export async function requireAdminAccess() {
  if (!(await verifyAdminSession())) {
    redirect("/admin/login");
  }
}

export async function consumeAdminLoginAttempt() {
  const ip = await resolveRequestIp();
  const now = Date.now();
  const state = await readAdminGuardState();

  if (!state || (state.ip && ip && state.ip !== ip) || now - state.updatedAt > adminGuardWindowMs) {
    return { locked: false } as const;
  }

  if (state.lockedUntil > now) {
    await delay(adminGuardDelayMs);
    return { locked: true } as const;
  }

  return { locked: false } as const;
}

export async function registerAdminLoginFailure() {
  const ip = await resolveRequestIp();
  const now = Date.now();
  const state = await readAdminGuardState();
  const attempts =
    !state || (state.ip && ip && state.ip !== ip) || now - state.updatedAt > adminGuardWindowMs
      ? 1
      : state.attempts + 1;
  const lockedUntil = attempts >= adminGuardMaxAttempts ? now + adminGuardLockMs : 0;

  await delay(adminGuardDelayMs);
  await writeAdminGuardState({
    type: "admin-guard",
    attempts: lockedUntil ? 0 : attempts,
    updatedAt: now,
    lockedUntil,
    ip,
  });
}

export async function resetAdminLoginGuard() {
  await clearAdminGuardState();
}
