import { useAuthStore } from "@/store/use-auth-store";

/**
 * Cửa ngõ để tầng http đọc/ghi access token mà không phải phụ thuộc trực tiếp
 * vào zustand — và quan trọng hơn: không cần nằm trong React.
 */

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

export function setAccessToken(token: string | null): void {
  useAuthStore.getState().setAccessToken(token);
}
