const adminCookieBaseName = "crumbs-os-admin";
const adminGuardCookieBaseName = "crumbs-os-admin-guard";

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function getAdminCookieName() {
  return isProduction() ? `__Host-${adminCookieBaseName}` : adminCookieBaseName;
}

export function getAdminGuardCookieName() {
  return isProduction() ? `__Host-${adminGuardCookieBaseName}` : adminGuardCookieBaseName;
}

export function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD must be configured before admin access can be used.");
  }

  return password;
}

export function getAdminSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET must be configured before admin access can be used.");
  }

  return secret;
}
