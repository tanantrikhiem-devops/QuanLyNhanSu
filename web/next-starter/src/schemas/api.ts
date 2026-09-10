import { z } from "zod";

/**
 * Bao bọc response chung của backend (FastAPI `app/schemas/common.py`).
 * Mọi endpoint đều trả về đúng ba dạng dưới đây — không có ngoại lệ.
 */

/** `PaginationMeta` — chỉ xuất hiện ở endpoint danh sách. */
export const paginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total_pages: z.number().int().nonnegative(),
});

/** `ApiResponse[T]` — bọc mọi response thành công. */
export function apiResponseSchema<T extends z.ZodType>(data: T) {
  return z.object({
    data,
    meta: paginationMetaSchema.nullish(),
    message: z.string().nullish(),
  });
}

/** `ApiResponse[NoneType]` — logout và delete trả về dạng này. */
export const emptyApiResponseSchema = apiResponseSchema(z.null());

/**
 * `ErrorResponse` — do `http_exception_handler` / `validation_exception_handler`
 * sinh ra, dùng chung cho cả 4xx lẫn 422. `errors` chỉ có ở lỗi validate.
 */
export const errorResponseSchema = z.object({
  status_code: z.number().int(),
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())).nullish(),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type ApiResponse<T> = {
  data: T;
  meta?: PaginationMeta | null;
  message?: string | null;
};
