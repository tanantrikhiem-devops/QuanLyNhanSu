import { z } from "zod";

import { apiResponseSchema } from "@/schemas/api";

/**
 * Schema auth — khớp 1-1 với `app/schemas/user.py` của backend.
 * Ràng buộc `min(8)` lấy đúng theo `UserCreate.password` để lỗi hiện ngay ở
 * client thay vì phải chờ 422 từ server.
 */

/** `UserRead` — payload người dùng backend trả về. */
export const userSchema = z.object({
  id: z.number().int().positive(),
  email: z.email(),
});

/** `UserLogin` — body của `POST /api/v1/auth/login`. */
export const loginInputSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
});

/** `UserCreate` — body của `POST /api/v1/auth/register`. */
export const registerInputSchema = loginInputSchema;

/** `ApiResponse[UserRead]` — login, refresh, register và `/users/me` dùng chung. */
export const userResponseSchema = apiResponseSchema(userSchema);

/**
 * Response của login/refresh sau khi đi qua BFF proxy.
 * `accessToken` KHÔNG do FastAPI trả — proxy bóc từ header `Set-Cookie`
 * rồi đưa xuống body để client giữ trong RAM. Chuỗi rỗng nghĩa là backend
 * vừa xoá cookie (đăng xuất / token bị thu hồi).
 */
export const sessionResponseSchema = userResponseSchema.extend({
  accessToken: z.string().nullish(),
});

export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
