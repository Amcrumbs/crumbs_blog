import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getAdminCookieName,
  getAdminPassword,
  getAdminSessionSecret,
  isAdminConfigured,
} from "@/lib/admin-access-config";
import { verifyAdminSessionToken } from "@/lib/admin-session-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!isAdminConfigured()) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const token = request.cookies.get(getAdminCookieName())?.value;
  const ok = await verifyAdminSessionToken(
    token,
    getAdminSessionSecret(),
    getAdminPassword(),
  );

  if (ok) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
