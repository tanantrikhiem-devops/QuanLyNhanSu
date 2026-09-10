import { apiFetch } from "@/lib/api/http";
import { setAccessToken } from "@/lib/api/token-store";
import {
  sessionResponseSchema,
  userResponseSchema,
  type LoginInput,
  type RegisterInput,
  type User,
} from "@/schemas/auth";

/**
 * Lớp gọi API auth. Path tính từ `/api/v1` của FastAPI; `apiFetch` tự gắn tiền
 * tố `/api/bff` để đi qua proxy cùng origin.
 */

/**
 * `POST /auth/login` — backend set cả hai cookie, proxy bóc `access_token`
 * xuống body và `apiFetch` cất nó vào RAM. `refresh_token` ở lại httpOnly.
 */
export async function login(input: LoginInput): Promise<User> {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    body: input,
    schema: sessionResponseSchema,
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
 * `POST /auth/logout` — backend xoá cả hai cookie. Token trong RAM phải xoá tay
 * vì nó chưa bao giờ là cookie của trình duyệt.
 */
export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST", skipRefresh: true });
  } finally {
    setAccessToken(null);
  }
}
