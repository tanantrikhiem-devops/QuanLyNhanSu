"use client";

import { useState } from "react";

import { AUTH_ROUTES } from "@/features/auth/routes";
import { useChangePassword, useResetPassword } from "@/features/auth/use-auth";
import {
  PASSWORD_RULES,
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
      title="Đặt mật khẩu mới"
      description={
        token
          ? "Tạo mật khẩu mới cho tài khoản của bạn."
          : "Tài khoản mới cấp bắt buộc đổi mật khẩu trước khi vào hệ thống."
      }
    >
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

        <div className="bg-auth-note-bg text-auth-note mt-3 rounded-md px-2 py-2 text-[7px] leading-relaxed">
          <p className="mb-1 font-semibold">MẬT KHẨU PHẢI CÓ</p>
          {PASSWORD_RULES.map((rule) => (
            <RuleRow key={rule.label} ok={rule.test(newPassword)} label={rule.label} />
          ))}
          <RuleRow ok={matched} label="Mật khẩu phải trùng khớp" />
          <p className="flex items-center gap-1 opacity-70">
            <span aria-hidden>–</span>
            Không trùng 3 mật khẩu gần nhất (máy chủ kiểm tra)
          </p>
        </div>

        <AuthSubmitButton pending={mutation.isPending} pendingLabel="Đang cập nhật...">
          Xác nhận và vào hệ thống
        </AuthSubmitButton>
      </form>

      {formError && <AuthAlert tone="danger">{formError}</AuthAlert>}
      {mutation.isSuccess && (
        <AuthAlert tone="success">{mutation.data ?? "Đổi mật khẩu thành công."}</AuthAlert>
      )}

      {token && <AuthOutlineLink href={AUTH_ROUTES.login}>Quay lại đăng nhập</AuthOutlineLink>}
    </AuthCard>
  );
}

function RuleRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <p className="flex items-center gap-1">
      <span className={ok ? "text-auth-success" : "text-auth-danger"} aria-hidden>
        {ok ? "●" : "○"}
      </span>
      <span className="sr-only">{ok ? "Đạt: " : "Chưa đạt: "}</span>
      {label}
    </p>
  );
}
