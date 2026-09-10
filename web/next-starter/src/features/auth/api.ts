import { apiFetch } from "@/lib/api/http";
import {
  userResponseSchema,
  type LoginInput,
  type RegisterInput,
  type User,
} from "@/schemas/auth";

/**
 * Lớp gọi API auth. `path` tính từ `/api/v1` của FastAPI.
 *
 * Không hàm nào ở đây đụng tới token: `access_token` và `refresh_token` là cookie
 * httpOnly do backend set và xoá, browser tự đính kèm theo mỗi request.
 */

/** `POST /auth/login` — backend set cả hai cookie xác thực. */
export async function login(input: LoginInput): Promise<User> {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    body: input,
    schema: userResponseSchema,
    skipRefresh: true,
  });
  return response.data;
}

/** `POST /auth/register` — chỉ tạo tài khoản, KHÔNG tự đăng nhập. */
export async function register(input: RegisterInput): Promise<User> {
  const response = await apiFetch("/auth/register", {
    method: "POST",
    body: input,
    schema: userResponseSchema,
    skipRefresh: true,
  });
  return response.data;
}

/** `GET /users/me` — nguồn sự thật về người dùng đang đăng nhập. */
export async function getMe(): Promise<User> {
  const response = await apiFetch("/users/me", { schema: userResponseSchema });
  return response.data;
}

/**
 * `POST /auth/logout` — backend xoá cả hai cookie.
 * Không có gì để dọn phía client: token chưa bao giờ nằm trong JavaScript.
 */
export async function logout(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST", skipRefresh: true });
}
