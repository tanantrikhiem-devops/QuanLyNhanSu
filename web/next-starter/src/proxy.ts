import { NextResponse, type NextRequest } from "next/server";

import { REFRESH_COOKIE } from "@/lib/api/config";

/**
 * Chốt chặn ở tầng request (Next 16 đổi tên `middleware` → `proxy`).
 *
 * Chỉ kiểm tra SỰ TỒN TẠI của `refresh_token` — proxy không có secret nên
 * không verify được chữ ký JWT, và cũng không nên gọi API ở đây. Việc xác thực
 * thật do backend làm khi `/users/me` chạy; lớp này chỉ để người chưa đăng nhập
 * không phải tải cả app rồi mới bị đá ra.
 */

const LOGIN_PATH = "/dang-nhap";
const HOME_PATH = "/";
/** Route mở cho khách. */
const PUBLIC_PATHS = new Set<string>([LOGIN_PATH]);

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(REFRESH_COOKIE);
  const isPublic = PUBLIC_PATHS.has(pathname);

  if (!hasSession && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = "";
    url.searchParams.set("tiep-tuc", pathname);
    return NextResponse.redirect(url);
  }

  if (hasSession && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = HOME_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  /**
   * Bỏ qua `/api/*` (BFF proxy tự xử lý 401), asset tĩnh và file metadata —
   * nếu không, guard sẽ chặn luôn cả CSS/JS và chính lời gọi refresh.
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
