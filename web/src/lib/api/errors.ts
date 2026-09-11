import { errorResponseSchema } from "@/lib/api/schemas";

export const NETWORK_ERROR_STATUS = 0;
export const TIMEOUT_ERROR_STATUS = 408;

export type ApiErrorOptions = {
  fieldErrors?: Record<string, string[]>;
  cause?: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string[]>;

  constructor(status: number, message: string, options: ApiErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = options.fieldErrors ?? {};
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isNetworkIssue(): boolean {
    return this.status === NETWORK_ERROR_STATUS || this.status === TIMEOUT_ERROR_STATUS;
  }

  fieldError(field: string): string | undefined {
    return this.fieldErrors[field]?.[0];
  }
}

export function toApiError(status: number, body: unknown): ApiError {
  const parsed = errorResponseSchema.safeParse(body);
  if (parsed.success) {
    return new ApiError(parsed.data.status_code, parsed.data.message, {
      fieldErrors: parsed.data.errors ?? {},
    });
  }
  return new ApiError(status, `Yêu cầu thất bại (HTTP ${status})`, { cause: body });
}
