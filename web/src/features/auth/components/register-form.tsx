"use client";

import { AUTH_ROUTES } from "@/features/auth/routes";
import { useRegister } from "@/features/auth/use-auth";
import { registerFormSchema } from "@/features/auth/form-schemas";

import {
  AuthAlert,
  AuthCard,
  AuthField,
  AuthOutlineLink,
  AuthPasswordField,
  AuthSubmitButton,
  issuesToFieldErrors,
  useFormErrors,
} from "./auth-ui";

type Field = "email" | "password" | "confirmPassword";

export function RegisterForm() {
  const { mutate, isPending, error } = useRegister();
  const { fieldError, formError, setClientErrors } = useFormErrors<Field>(error);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = registerFormSchema.safeParse({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      confirmPassword: String(form.get("confirmPassword") ?? ""),
    });

    if (!parsed.success) {
      setClientErrors(issuesToFieldErrors<Field>(parsed.error.issues));
      return;
    }
    setClientErrors({});
    mutate({ email: parsed.data.email, password: parsed.data.password });
  }

  return (
    <AuthCard
      wide
      title="Tạo tài khoản"
      description="Đăng ký tài khoản nội bộ để sử dụng hệ thống."
    >
      <form className="mt-4" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="register-email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="vd: email@congty.vn"
          disabled={isPending}
          error={fieldError("email")}
        />
        <AuthPasswordField
          id="register-password"
          name="password"
          label="Mật khẩu"
          autoComplete="new-password"
          placeholder="Tối thiểu 8 ký tự"
          disabled={isPending}
          error={fieldError("password")}
        />
        <AuthPasswordField
          id="register-confirm-password"
          name="confirmPassword"
          label="Nhập lại mật khẩu"
          autoComplete="new-password"
          placeholder="Nhập lại mật khẩu"
          disabled={isPending}
          error={fieldError("confirmPassword")}
        />

        <AuthSubmitButton pending={isPending} pendingLabel="Đang đăng ký..." className="mt-4">
          Đăng ký
        </AuthSubmitButton>
      </form>

      {formError && <AuthAlert tone="danger">{formError}</AuthAlert>}

      <AuthOutlineLink href={AUTH_ROUTES.login}>Đã có tài khoản? Đăng nhập</AuthOutlineLink>
    </AuthCard>
  );
}
