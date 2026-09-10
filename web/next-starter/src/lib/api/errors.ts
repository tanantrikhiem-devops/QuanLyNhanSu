import { errorResponseSchema } from "@/schemas/api";

/**
 * Lỗi chuẩn hoá từ `ErrorResponse` của backend.
 * Mọi tầng phía trên (hook, form) chỉ cần bắt `ApiError`, không phải đoán shape.
 */
export class ApiError extends Error {
  readonly status: number;
  /** Lỗi theo từng field, chỉ có ở response 422. */
  readonly fieldErrors: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  /** Chưa đăng nhập hoặc access token đã hết hạn. */
  get isUnauthorized(): boolean {
    return this.status === 401;
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
    return new ApiError(parsed.data.status_code, parsed.data.message, parsed.data.errors ?? {});
  }
  return new ApiError(status, `Yêu cầu thất bại (HTTP ${status})`);
}
