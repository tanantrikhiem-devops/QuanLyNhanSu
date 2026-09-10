import type { z } from "zod";

import { API_URL, API_VERSION_PREFIX } from "@/lib/api/config";
import { ApiError, toApiError } from "@/lib/api/errors";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type Options<S extends z.ZodType = z.ZodType> = {
  method?: Method;
  body?: unknown;
  /** Không truyền ⇒ hàm trả `void`. */
  schema?: S;
  /** Bỏ qua tự refresh — dùng cho login/logout. */
  skipRefresh?: boolean;
  signal?: AbortSignal;
};

const TIMEOUT_MS = 15_000;

function send(path: string, o: { method: Method; body?: unknown; signal?: AbortSignal }) {
  const hasBody = o.method !== "GET" && o.body !== undefined;
  return fetch(`${API_URL}${API_VERSION_PREFIX}${path}`, {
    method: o.method,
    headers: hasBody ? { "content-type": "application/json" } : undefined,
    body: hasBody ? JSON.stringify(o.body) : undefined,
    credentials: "include",
    signal: o.signal
      ? AbortSignal.any([o.signal, AbortSignal.timeout(TIMEOUT_MS)])
      : AbortSignal.timeout(TIMEOUT_MS),
  }).catch((error: unknown) => {
    if (o.signal?.aborted) throw error; // caller huỷ — để TanStack Query nhận đúng
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    throw new ApiError(timedOut ? 408 : 0, timedOut ? "Máy chủ phản hồi quá chậm" : "Không kết nối được tới máy chủ", {
      cause: error,
    });
  });
}

/** Gom nhiều 401 cùng lúc về một lượt refresh duy nhất. */
let inflight: Promise<boolean> | null = null;

export function refreshSession(): Promise<boolean> {
  inflight ??= send("/auth/refresh", { method: "POST" })
    .then((r) => r.ok)
    .catch(() => false)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export async function apiFetch<S extends z.ZodType>(
  path: string,
  options: Options<S> & { schema: S },
): Promise<z.infer<S>>;
export async function apiFetch(path: string, options?: Omit<Options, "schema">): Promise<void>;
export async function apiFetch(path: string, options: Options = {}): Promise<unknown> {
  const { method = "GET", body, schema, skipRefresh = false, signal } = options;
  const req = { method, body, signal };

  let response = await send(path, req);

  // Access token hết hạn: refresh một lần rồi thử lại một lần.
  if (response.status === 401 && !skipRefresh) {
    if (!(await refreshSession())) throw new ApiError(401, "Phiên đăng nhập đã hết hạn");
    response = await send(path, req);
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) throw toApiError(response.status, payload);
  if (!schema) return undefined;

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`apiFetch("${path}") lệch schema:`, parsed.error.issues, payload);
    }
    throw new ApiError(response.status, "Dữ liệu API trả về không đúng định dạng mong đợi", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}