import type { z } from "zod";

import { BFF_PREFIX } from "@/lib/api/config";
import { ApiError, toApiError } from "@/lib/api/errors";
import { getAccessToken, setAccessToken } from "@/lib/api/token-store";

/**
 * Http client phía browser. Ba việc nó lo, để hook và component không phải lo:
 *  - gắn access token (đang nằm trong RAM) vào header `Authorization`;
 *  - tự gọi refresh đúng MỘT lần khi gặp 401 rồi thử lại request;
 *  - validate response bằng zod, ném `ApiError` khi backend báo lỗi.
 */

export type RequestOptions<TSchema extends z.ZodType> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Body JSON; tự `JSON.stringify`. */
  body?: unknown;
  /** Schema để validate response. Bỏ trống nếu không cần dữ liệu trả về. */
  schema?: TSchema;
  /** Bỏ qua cơ chế tự refresh — dùng cho chính endpoint refresh/login. */
  skipRefresh?: boolean;
  signal?: AbortSignal;
};

async function rawRequest(
  path: string,
  options: { method: string; body?: unknown; signal?: AbortSignal },
): Promise<Response> {
  const headers = new Headers({ accept: "application/json" });

  const token = getAccessToken();
  if (token) headers.set("authorization", `Bearer ${token}`);
  if (options.body !== undefined) headers.set("content-type", "application/json");

  return fetch(`${BFF_PREFIX}${path}`, {
    method: options.method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    // Cùng origin, nhưng khai báo tường minh cho rõ ý: cookie refresh phải đi kèm.
    credentials: "same-origin",
    signal: options.signal,
  });
}

/**
 * Gọi refresh và ghi token mới vào RAM.
 * Gom về một promise duy nhất để nhiều request cùng gặp 401 không tạo ra
 * nhiều lượt refresh song song (single-flight).
 */
let inflightRefresh: Promise<string | null> | null = null;

export function refreshSession(): Promise<string | null> {
  const pending =
    inflightRefresh ??
    (async () => {
      try {
        const response = await rawRequest("/auth/refresh", { method: "POST" });
        const payload: unknown = response.ok ? await response.json() : null;
        const token =
          payload !== null && typeof payload === "object" && "accessToken" in payload
            ? payload.accessToken
            : null;

        if (typeof token !== "string" || token.length === 0) {
          setAccessToken(null);
          return null;
        }
        setAccessToken(token);
        return token;
      } catch {
        setAccessToken(null);
        return null;
      } finally {
        inflightRefresh = null;
      }
    })();

  inflightRefresh = pending;
  return pending;
}

/**
 * Gọi API qua BFF. `path` tính từ `/api/v1` của backend, ví dụ `"/users/me"`.
 */
export async function apiFetch<TSchema extends z.ZodType>(
  path: string,
  options: RequestOptions<TSchema> = {},
): Promise<z.infer<TSchema>> {
  const { method = "GET", body, schema, skipRefresh = false, signal } = options;

  // Token trong RAM mất sau mỗi lần F5 — thử khôi phục phiên bằng cookie refresh
  // trước khi bắn request thật, đỡ tốn một vòng 401.
  let refreshed = false;
  if (!skipRefresh && getAccessToken() === null) {
    refreshed = true;
    if ((await refreshSession()) === null) {
      throw new ApiError(401, "Phiên đăng nhập đã hết hạn");
    }
  }

  let response = await rawRequest(path, { method, body, signal });

  // Access token hết hạn giữa chừng: refresh một lần rồi thử lại đúng một lần.
  if (response.status === 401 && !skipRefresh && !refreshed) {
    if ((await refreshSession()) === null) {
      throw new ApiError(401, "Phiên đăng nhập đã hết hạn");
    }
    response = await rawRequest(path, { method, body, signal });
  }

  const text = await response.text();
  let payload: unknown = null;
  if (text.length > 0) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    if (response.status === 401) setAccessToken(null);
    throw toApiError(response.status, payload);
  }

  // Proxy đính token mới vào body của login/refresh — nhặt lấy trước khi validate.
  if (payload !== null && typeof payload === "object" && "accessToken" in payload) {
    const token = payload.accessToken;
    if (typeof token === "string") setAccessToken(token.length > 0 ? token : null);
  }

  if (!schema) return undefined as z.infer<TSchema>;

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(response.status, "Dữ liệu API trả về không đúng định dạng mong đợi");
  }
  return parsed.data;
}
