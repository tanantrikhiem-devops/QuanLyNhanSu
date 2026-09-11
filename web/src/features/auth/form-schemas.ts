import { z } from "zod";

import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
} from "@/lib/api/contracts";

export const PASSWORD_RULES = [
  { label: "Tối thiểu 10 ký tự", test: (v: string) => v.length >= 10 },
  {
    label: "Có chữ hoa, chữ thường và số",
    test: (v: string) => /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v),
  },
] as const;

const email = z.email("Email không hợp lệ");
const password = z.string().min(8, "Mật khẩu tối thiểu 8 ký tự");
const strongPassword = z
  .string()
  .refine((v) => PASSWORD_RULES.every((rule) => rule.test(v)), "Mật khẩu chưa đáp ứng đủ điều kiện");

export const loginFormSchema = z.object({ email, password }) satisfies z.ZodType<LoginRequest>;

export const registerFormSchema = z
  .object({ email, password, confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Mật khẩu xác nhận không trùng khớp",
    path: ["confirmPassword"],
  });

export const forgotPasswordFormSchema = z.object({
  email,
}) satisfies z.ZodType<ForgotPasswordRequest>;

export const resetPasswordFormSchema = z.object({
  token: z.string().min(1),
  new_password: strongPassword,
}) satisfies z.ZodType<ResetPasswordRequest>;

export const changePasswordFormSchema = z.object({
  current_password: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  new_password: strongPassword,
}) satisfies z.ZodType<ChangePasswordRequest>;
