import { errorResponseSchema } from "@/schemas/api";

/** Status quy ước cho lỗi không đến từ backend. */
export const NETWORK_ERROR_STATUS = 0;
export const TIMEOUT_ERROR_STATUS = 408;

export type ApiErrorOptions = {
  /** Lỗi theo từng field, chỉ có ở response 422. */
  fieldErrors?: Record<string, string[]>;
  /** Lỗi gốc (zod issue, TypeError của fetch…) — giữ lại để còn debug được. */
  cause?: unknown;
};

/**
 * Lỗi chuẩn hoá từ `ErrorResponse` của backend.
 * Mọi tầng phía trên (hook, form) chỉ cần bắt `ApiError`, không phải đoán shape.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string[]>;

  constructor(status: number, message: string, options: ApiErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = options.fieldErrors ?? {};
  }

  /** Chưa đăng nhập hoặc access token đã hết hạn. */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /** Không gọi được backend (mất mạng, API chết, quá hạn). */
  get isNetworkIssue(): boolean {
    return this.status === NETWORK_ERROR_STATUS || this.status === TIMEOUT_ERROR_STATUS;
  }

  /** Lấy thông báo đầu tiên của một field để hiện dưới ô input. */
  fieldError(field: string): string | undefined {
    return this.fieldErrors[field]?.[0];
  }
}

/** Dựng `ApiError` từ body trả về; body lạ thì fallback theo status. */
export function toApiError(status: number, body: unknown): ApiError {
  const parsed = errorResponseSchema.safeParse(body);
  if (parsed.success) {
    return new ApiError(parsed.data.status_code, parsed.data.message, {
      fieldErrors: parsed.data.errors ?? {},
    });
  }
  return new ApiError(status, `Yêu cầu thất bại (HTTP ${status})`, { cause: body });
}
