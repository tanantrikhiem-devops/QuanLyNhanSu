export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

export type ApiResponse<T> = {
  data: T;
  meta?: PaginationMeta | null;
  message?: string | null;
};

export type EmptyApiResponse = ApiResponse<null>;

export type ErrorResponse = {
  status_code: number;
  message: string;
  errors?: Record<string, string[]> | null;
};
