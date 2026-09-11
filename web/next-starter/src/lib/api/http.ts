import type { z } from "zod";

import { endpoints } from "@/lib/api/endpoints";
import { API_URL, API_VERSION_PREFIX, REQUEST_TIMEOUT_MS } from "@/lib/api/config";
import { ApiError, NETWORK_ERROR_STATUS, TIMEOUT_ERROR_STATUS, toApiError } from "@/lib/api/errors";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type Options<S extends z.ZodType = z.ZodType> = {
  method?: Method;
  body?: unknown;
  schema?: S;
  skipRefresh?: boolean;
  signal?: AbortSignal;
};

function send(path: string, o: { method: Method; body?: unknown; signal?: AbortSignal }) {
  const hasBody = o.method !== "GET" && o.body !== undefined;
  return fetch(`${API_URL}${API_VERSION_PREFIX}${path}`, {
    method: o.method,
    headers: hasBody ? { "content-type": "application/json" } : undefined,
    body: hasBody ? JSON.stringify(o.body) : undefined,
    credentials: "include",
    signal: o.signal
      ? AbortSignal.any([o.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)])
      : AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  }).catch((error: unknown) => {
    if (o.signal?.aborted) throw error;
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    throw new ApiError(
      timedOut ? TIMEOUT_ERROR_STATUS : NETWORK_ERROR_STATUS,
      timedOut ? "Máy chủ phản hồi quá chậm" : "Không kết nối được tới máy chủ",
      { cause: error },
    );
  });
}

type RefreshOutcome = "ok" | "expired" | "network";

let inflight: Promise<RefreshOutcome> | null = null;

let sessionKnownDead = false;

function refreshOnce(): Promise<RefreshOutcome> {
  inflight ??= send(endpoints.auth.refresh, { method: "POST" })
    .then((r): RefreshOutcome => (r.ok ? "ok" : "expired"))
    .catch((): RefreshOutcome => "network")
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export async function refreshSession(): Promise<boolean> {
  const outcome = await refreshOnce();
  if (outcome === "ok") sessionKnownDead = false;
  if (outcome === "expired") sessionKnownDead = true;
  return outcome === "ok";
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

  if (response.status === 401 && !skipRefresh) {
    if (sessionKnownDead) throw new ApiError(401, "Phiên đăng nhập đã hết hạn");

    const outcome = await refreshOnce();
    if (outcome === "network") {
      throw new ApiError(NETWORK_ERROR_STATUS, "Không kết nối được tới máy chủ");
    }
    if (outcome === "expired") {
      sessionKnownDead = true;
      throw new ApiError(401, "Phiên đăng nhập đã hết hạn");
    }
    response = await send(path, req);
  }

  if (response.ok) sessionKnownDead = false;

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
