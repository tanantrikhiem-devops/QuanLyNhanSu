import { z } from "zod";

import type { ErrorResponse, PaginationMeta } from "@/lib/api/contracts";

export const paginationMetaSchema: z.ZodType<PaginationMeta> = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total_pages: z.number().int().nonnegative(),
});

export function apiResponseSchema<T extends z.ZodType>(data: T) {
  return z.object({
    data,
    meta: paginationMetaSchema.nullish(),
    message: z.string().nullish(),
  });
}

export const emptyApiResponseSchema = apiResponseSchema(z.null());

export const errorResponseSchema: z.ZodType<ErrorResponse> = z.object({
  status_code: z.number().int(),
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())).nullish(),
});
