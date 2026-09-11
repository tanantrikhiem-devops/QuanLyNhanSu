"use client";

import { AUTH_ROUTES } from "@/features/auth/routes";
import { useForgotPassword } from "@/features/auth/use-auth";
import { forgotPasswordFormSchema } from "@/features/auth/form-schemas";

import {
  AuthAlert,
  AuthCard,
  AuthField,
  AuthOutlineLink,
  AuthSubmitButton,
  issuesToFieldErrors,
  useFormErrors,
} from "./auth-ui";

export function ForgotPasswordForm() {
  const { mutate, isPending, isSuccess, data, error } = useForgotPassword();
  const { fieldError, formError, setClientErrors } = useFormErrors<"email">(error);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = forgotPasswordFormSchema.safeParse({ email: String(form.get("email") ?? "") });

    if (!parsed.success) {
      setClientErrors(issuesToFieldErrors<"email">(parsed.error.issues));
      return;
    }
    setClientErrors({});
    mutate(parsed.data);
  }

  return (
    <AuthCard
      title="Quên mật khẩu"
      description="Nhập email nội bộ, hệ thống gửi liên kết đặt lại trong 15 phút."
    >
      <form className="mt-4" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="email"
          name="email"
          type="email"
          label="Email nội bộ"
          autoComplete="email"
          placeholder="vd: tanantrikhien@gmail.com"
          disabled={isPending}
          error={fieldError("email")}
        />
        <AuthSubmitButton pending={isPending} pendingLabel="Đang gửi...">
          Gửi liên kết đặt lại
        </AuthSubmitButton>
      </form>

      {formError && <AuthAlert tone="danger">{formError}</AuthAlert>}
      {isSuccess && (
        <AuthAlert tone="success">{data ?? "Liên kết đặt lại mật khẩu đã được gửi."}</AuthAlert>
      )}

      <AuthOutlineLink href={AUTH_ROUTES.login}>Quay lại đăng nhập</AuthOutlineLink>

      <AuthAlert tone="note">
        Không nhận được thư? Liên hệ Phòng Hành chính – CNTT (nội bộ 105) để được cấp lại thủ công.
      </AuthAlert>
    </AuthCard>
  );
}
