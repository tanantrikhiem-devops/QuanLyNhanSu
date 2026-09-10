/**
 * Hằng số dùng chung giữa BFF proxy (server) và http client (browser).
 *
 * Browser KHÔNG bao giờ gọi thẳng FastAPI: mọi request đi qua `BFF_PREFIX`
 * cùng origin với Next, nên không cần CORS ở backend và không lộ địa chỉ nội bộ.
 */

/** Tiền tố mà browser gọi. Cùng origin ⇒ cookie tự động kèm theo. */
export const BFF_PREFIX = "/api/bff";

/** Prefix version của FastAPI (`app.include_router(api_router, prefix=...)`). */
export const API_VERSION_PREFIX = "/api/v1";

/** Tên cookie do backend set (`app/api/v1/endpoints/auth.py`). */
export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";

/**
 * Địa chỉ FastAPI, chỉ đọc được phía server.
 * Là biến runtime (không phải `NEXT_PUBLIC_*`) nên đổi giá trị không cần build lại.
 */
export function apiBaseUrl(): string {
  return process.env.API_BASE_URL ?? "http://localhost:8000";
}
