type AdminSessionPayload = {
  type: "admin-access";
  issuedAt: number;
  expiresAt: number;
};

const adminSessionType = "admin-access";

function bytesToBase64(bytes: Uint8Array) {
  let output = "";
  for (const byte of bytes) {
    output += String.fromCharCode(byte);
  }
  return btoa(output);
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function base64UrlEncode(value: string) {
  return bytesToBase64(new TextEncoder().encode(value))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlEncodeBytes(bytes: Uint8Array) {
  return bytesToBase64(bytes)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  return new TextDecoder().decode(base64ToBytes(padded));
}

function isAdminSessionPayload(value: unknown): value is AdminSessionPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return (
    payload.type === adminSessionType &&
    typeof payload.issuedAt === "number" &&
    typeof payload.expiresAt === "number"
  );
}

function deriveSessionSecret(sessionSecret: string, password: string) {
  return `${sessionSecret}\0${password}`;
}

async function importSigningKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function signPayload(payload: string, secret: string) {
  const key = await importSigningKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return base64UrlEncodeBytes(new Uint8Array(signature));
}

export async function createAdminSessionToken(
  payload: AdminSessionPayload,
  sessionSecret: string,
  password: string,
) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await signPayload(encodedPayload, deriveSessionSecret(sessionSecret, password));
  return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined,
  sessionSecret: string,
  password: string,
  now = Date.now(),
) {
  if (!token) {
    return false;
  }

  const [encodedPayload, signature, extra] = token.split(".");
  if (!encodedPayload || !signature || extra) {
    return false;
  }

  const expectedSignature = await signPayload(
    encodedPayload,
    deriveSessionSecret(sessionSecret, password),
  );

  if (signature !== expectedSignature) {
    return false;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (!isAdminSessionPayload(payload)) {
      return false;
    }

    return payload.issuedAt <= now && payload.expiresAt > now;
  } catch {
    return false;
  }
}
