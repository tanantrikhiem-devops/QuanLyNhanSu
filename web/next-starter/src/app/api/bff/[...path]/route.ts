import { NextResponse, type NextRequest } from "next/server";

import {
  ACCESS_COOKIE,
  API_VERSION_PREFIX,
  REFRESH_COOKIE,
  apiBaseUrl,
} from "@/lib/api/config";
import { splitSetCookies } from "@/lib/api/set-cookie";

/**
 * BFF proxy: cầu nối duy nhất giữa browser và FastAPI.
 *
 * Vì sao cần lớp này thay vì gọi thẳng `localhost:8000`:
 *  1. Backend chưa bật CORS — gọi cross-origin từ `localhost:3000` sẽ bị chặn.
 *  2. Backend nhận token qua **cookie**, mà cookie đó lại httpOnly nên JS không
 *     đọc được. Proxy dịch `Authorization: Bearer <token>` (token client giữ
 *     trong RAM) thành header `Cookie: access_token=<token>` khi đi lên.
 *  3. `refresh_token` không bao giờ chạm tới JS: nó ở lại dạng httpOnly cookie
 *     của chính origin Next, chỉ proxy mới đọc và chuyển tiếp.
 *
 * Địa chỉ backend chỉ tồn tại phía server nên không lộ ra bundle.
 */

/** Header của client được phép đi tiếp lên backend. */
const FORWARDED_REQUEST_HEADERS = ["content-type", "accept-language"] as const;

type RouteContext = { params: Promise<{ path: string[] }> };

async function handle(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { path } = await context.params;

  const target = new URL(`${apiBaseUrl()}${API_VERSION_PREFIX}/${path.join("/")}`);
  target.search = request.nextUrl.search;

  const headers = new Headers({ accept: "application/json" });
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  // Ghép lại đúng bộ cookie mà FastAPI mong đợi.
  const cookies: string[] = [];
  const bearer = /^Bearer\s+(.+)$/i.exec(request.headers.get("authorization") ?? "")?.[1];
  if (bearer) cookies.push(`${ACCESS_COOKIE}=${bearer}`);
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (refreshToken) cookies.push(`${REFRESH_COOKIE}=${refreshToken}`);
  if (cookies.length > 0) headers.set("cookie", cookies.join("; "));

  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.text();

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      body: body ? body : undefined,
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return NextResponse.json(
      { status_code: 502, message: "Không kết nối được tới máy chủ API" },
      { status: 502 },
    );
  }

  const { accessToken, forward } = splitSetCookies(upstream.headers.getSetCookie());
  const raw = await upstream.text();

  // Trả nguyên văn body của backend, chỉ chèn thêm `accessToken` khi có.
  let payload: unknown;
  try {
    payload = raw.length > 0 ? JSON.parse(raw) : null;
  } catch {
    payload = { status_code: upstream.status, message: raw || "Phản hồi không hợp lệ từ API" };
  }
  if (accessToken !== null && payload !== null && typeof payload === "object") {
    payload = { ...payload, accessToken };
  }

  const response = NextResponse.json(payload, { status: upstream.status });
  for (const cookie of forward) {
    response.headers.append("set-cookie", cookie);
  }
  return response;
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
