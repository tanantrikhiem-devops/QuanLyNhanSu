import type { EmptyApiResponse } from "./common.contract";
import type { UserResponse } from "./user.contract";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  new_password: string;
};

export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
};

export type LoginResponse = UserResponse;
export type RegisterResponse = UserResponse;
export type RefreshResponse = UserResponse;
export type LogoutResponse = EmptyApiResponse;
export type ForgotPasswordResponse = EmptyApiResponse;
export type ResetPasswordResponse = EmptyApiResponse;
export type ChangePasswordResponse = EmptyApiResponse;
