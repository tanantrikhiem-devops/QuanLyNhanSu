"use client";

import { useState } from "react";

import { AUTH_ROUTES } from "@/features/auth/routes";
import { useChangePassword, useResetPassword } from "@/features/auth/use-auth";
import {
  changePasswordFormSchema,
  resetPasswordFormSchema,
} from "@/features/auth/form-schemas";

import {
  AuthAlert,
  AuthCard,
  AuthOutlineLink,
  AuthPasswordField,
  AuthSubmitButton,
  issuesToFieldErrors,
  useFormErrors,
} from "./auth-ui";

type Field = "current_password" | "new_password" | "confirm_password";

export function ResetPasswordForm({ token }: { token?: string }) {
  const reset = useResetPassword();
  const change = useChangePassword();
  const mutation = token ? reset : change;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { fieldError, formError, setClientErrors } = useFormErrors<Field>(mutation.error);

  const matched = confirmPassword.length > 0 && confirmPassword === newPassword;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!matched) {
      setClientErrors({ confirm_password: "Mật khẩu xác nhận không trùng khớp" });
      return;
    }

    if (token) {
      const parsed = resetPasswordFormSchema.safeParse({ token, new_password: newPassword });
      if (!parsed.success) return setClientErrors(issuesToFieldErrors<Field>(parsed.error.issues));
      setClientErrors({});
      reset.mutate(parsed.data);
      return;
    }

    const form = new FormData(event.currentTarget);
    const parsed = changePasswordFormSchema.safeParse({
      current_password: String(form.get("current_password") ?? ""),
      new_password: newPassword,
    });
    if (!parsed.success) return setClientErrors(issuesToFieldErrors<Field>(parsed.error.issues));
    setClientErrors({});
    change.mutate(parsed.data);
  }

  return (
    <AuthCard
      title={token ? "Đặt mật khẩu mới" : "Đổi mật khẩu lần đầu"}
      description={
        token
          ? "Tạo mật khẩu mới cho tài khoản của bạn."
          : "Bắt buộc đổi mật khẩu trong lần đăng nhập đầu tiên."
      }
    >
      {!token && (
        <AuthAlert tone="warning">
          Đây là lần đăng nhập đầu tiên — hãy đặt mật khẩu riêng trước khi vào hệ thống.
        </AuthAlert>
      )}
      <form className="mt-4" onSubmit={handleSubmit} noValidate>
        {!token && (
          <AuthPasswordField
            id="current_password"
            name="current_password"
            label="Mật khẩu hiện tại"
            autoComplete="current-password"
            placeholder="Mật khẩu tạm do phòng CNTT cấp"
            disabled={mutation.isPending}
            error={fieldError("current_password")}
          />
        )}
        <AuthPasswordField
          id="new_password"
          name="new_password"
          label="Mật khẩu mới"
          autoComplete="new-password"
          placeholder="Tối thiểu 10 ký tự"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={mutation.isPending}
          error={fieldError("new_password")}
        />
        <AuthPasswordField
          id="confirm_password"
          name="confirm_password"
          label="Nhập lại mật khẩu mới"
          autoComplete="new-password"
          placeholder="Nhập lại để xác nhận"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={mutation.isPending}
          error={fieldError("confirm_password")}
        />

        <div className="text-auth-muted mt-4 space-y-1 text-[9px] leading-relaxed">
          <RuleRow ok={newPassword.length >= 8} label="Từ 8 ký tự trở lên" />
          <RuleRow ok={/[A-Za-z]/.test(newPassword) && /\d/.test(newPassword)} label="Có cả chữ và số" />
          <RuleRow ok={/[!@#$%^&*(),.?\":{}|<>]/.test(newPassword)} label="Có ký tự đặc biệt (khuyến nghị)" />
        </div>

        <AuthSubmitButton pending={mutation.isPending} pendingLabel="Đang cập nhật...">
          Đặt mật khẩu và vào hệ thống
        </AuthSubmitButton>
      </form>

      {formError && <AuthAlert tone="danger">{formError}</AuthAlert>}
      {mutation.isSuccess && (
        <AuthAlert tone="success">{mutation.data ?? "Đặt mật khẩu thành công."}</AuthAlert>
      )}

      {token && <AuthOutlineLink href={AUTH_ROUTES.login}>Quay lại đăng nhập</AuthOutlineLink>}
    </AuthCard>
  );
}

function RuleRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <p className="flex items-center gap-1">
      <span className={ok ? "text-auth-success" : "text-auth-muted"} aria-hidden>
        {ok ? "✓" : "○"}
      </span>
      <span className="sr-only">{ok ? "Đạt: " : "Chưa đạt: "}</span>{label}
    </p>
  );
}
