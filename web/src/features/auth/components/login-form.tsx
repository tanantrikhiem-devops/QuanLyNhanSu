"use client";

import Link from "next/link";

import { AUTH_ROUTES } from "@/features/auth/routes";
import { useLogin } from "@/features/auth/use-auth";
import { loginFormSchema } from "@/features/auth/form-schemas";

import {
  AuthAlert,
  AuthCard,
  AuthField,
  AuthPasswordField,
  AuthSubmitButton,
  issuesToFieldErrors,
  useFormErrors,
} from "./auth-ui";

type Field = "email" | "password";

export function LoginForm({ redirectTo = "/" }: { redirectTo?: string }) {
  const { mutate, isPending, error } = useLogin(redirectTo);
  const { fieldError, formError, setClientErrors } = useFormErrors<Field>(error);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = loginFormSchema.safeParse({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });

    if (!parsed.success) {
      setClientErrors(issuesToFieldErrors<Field>(parsed.error.issues));
      return;
    }
    setClientErrors({});
    mutate(parsed.data);
  }

  return (
    <AuthCard
      title="Đăng nhập hệ thống"
      description="Dùng tài khoản nội bộ do phòng Hành chính – CNTT cấp"
    >
      <form className="mt-4" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="email"
          name="email"
          type="email"
          label="Tài khoản / Email"
          autoComplete="email"
          placeholder="vd: tanantrikhien@gmail.com"
          disabled={isPending}
          error={fieldError("email")}
        />
        <AuthPasswordField
          id="password"
          name="password"
          label="Mật khẩu"
          autoComplete="current-password"
          placeholder="Nhập mật khẩu"
          disabled={isPending}
          error={fieldError("password")}
        />

        <div className="mt-3 flex items-center justify-between text-[8px] text-auth-muted">
          <label className="flex items-center gap-1.5" htmlFor="remember">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="accent-brand h-3 w-3 rounded"
            />
            Ghi nhớ đăng nhập
          </label>
          <Link className="text-auth-text hover:text-brand font-semibold" href={AUTH_ROUTES.forgot}>
            Quên mật khẩu?
          </Link>
        </div>

        <AuthSubmitButton pending={isPending} pendingLabel="Đang đăng nhập...">
          Đăng nhập
        </AuthSubmitButton>
      </form>

      {formError && <AuthAlert tone="danger">{formError}</AuthAlert>}

      <p className="text-auth-muted mt-4 text-center text-[9px]">
        Chưa có tài khoản?{" "}
        <Link className="text-brand font-semibold hover:underline" href={AUTH_ROUTES.register}>
          Đăng ký ngay
        </Link>
      </p>

      <AuthAlert tone="info">
        Mọi thao tác khoá / mở khoá quy trình đều yêu cầu nhập lại mật khẩu này và được ghi vào
        nhật ký hoạt động.
      </AuthAlert>
    </AuthCard>
  );
}
