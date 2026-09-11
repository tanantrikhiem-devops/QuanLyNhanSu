import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  User,
} from "@/lib/api/contracts";
import { endpoints } from "@/lib/api/endpoints";
import { apiFetch } from "@/lib/api/http";
import {
  changePasswordResponseSchema,
  forgotPasswordResponseSchema,
  loginResponseSchema,
  registerResponseSchema,
  resetPasswordResponseSchema,
  userResponseSchema,
} from "@/lib/api/schemas";

export async function login(input: LoginRequest): Promise<User> {
  const response = await apiFetch(endpoints.auth.login, {
    method: "POST",
    body: input,
    schema: loginResponseSchema,
    skipRefresh: true,
  });
  return response.data;
}

export async function register(input: RegisterRequest): Promise<User> {
  const response = await apiFetch(endpoints.auth.register, {
    method: "POST",
    body: input,
    schema: registerResponseSchema,
    skipRefresh: true,
  });
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await apiFetch(endpoints.users.me, { schema: userResponseSchema });
  return response.data;
}

export async function logout(): Promise<void> {
  await apiFetch(endpoints.auth.logout, { method: "POST", skipRefresh: true });
}

export async function requestPasswordReset(input: ForgotPasswordRequest): Promise<string | null> {
  const response = await apiFetch(endpoints.auth.forgotPassword, {
    method: "POST",
    body: input,
    schema: forgotPasswordResponseSchema,
    skipRefresh: true,
  });
  return response.message ?? null;
}

export async function resetPassword(input: ResetPasswordRequest): Promise<string | null> {
  const response = await apiFetch(endpoints.auth.resetPassword, {
    method: "POST",
    body: input,
    schema: resetPasswordResponseSchema,
    skipRefresh: true,
  });
  return response.message ?? null;
}

export async function changePassword(input: ChangePasswordRequest): Promise<string | null> {
  const response = await apiFetch(endpoints.auth.changePassword, {
    method: "POST",
    body: input,
    schema: changePasswordResponseSchema,
  });
  return response.message ?? null;
}
