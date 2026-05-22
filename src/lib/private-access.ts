import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";

export const privateCookieName = "personal-os-private";

function getPassword() {
  const password = process.env.PRIVATE_SITE_PASSWORD;
  if (!password) {
    throw new Error("PRIVATE_SITE_PASSWORD must be configured before private access can be used.");
  }

  return password;
}

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function verifyPrivatePassword(password: string) {
  const expected = Buffer.from(digest(getPassword()));
  const actual = Buffer.from(digest(password));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function hasPrivateAccess() {
  const jar = await cookies();
  return jar.get(privateCookieName)?.value === digest(getPassword());
}

export async function grantPrivateAccess() {
  const jar = await cookies();
  jar.set(privateCookieName, digest(getPassword()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}
