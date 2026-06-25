import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isAdminLogin = request.nextUrl.pathname === "/admin/login";
  const hasAdminSession =
    request.cookies.get("orendarm-admin-session")?.value === "true";

  if (!hasAdminSession && !isAdminLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (hasAdminSession && isAdminLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
