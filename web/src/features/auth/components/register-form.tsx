"use client";

import { AUTH_ROUTES } from "@/features/auth/routes";
import { useRegister } from "@/features/auth/use-auth";
import { registerFormSchema } from "@/features/auth/form-schemas";

import {
  AuthAlert,
  AuthCard,
  AuthCheckbox,
  AuthField,
  AuthPasswordField,
  AuthSelect,
  AuthSubmitButton,
  issuesToFieldErrors,
  useFormErrors,
} from "./auth-ui";

type Field = "fullName" | "email" | "department" | "password" | "confirmPassword" | "terms";

export function RegisterForm() {
  const { mutate, isPending, error } = useRegister();
  const { fieldError, formError, setClientErrors } = useFormErrors<Field>(error);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = registerFormSchema.safeParse({
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      department: String(form.get("department") ?? ""),
      password: String(form.get("password") ?? ""),
      confirmPassword: String(form.get("confirmPassword") ?? ""),
      terms: form.get("terms") === "on",
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
      title="Đăng ký tài khoản"
      description="Đăng ký để được cấp quyền truy cập hệ thống nội bộ."
    >
      <form className="mt-4" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="register-full-name"
          name="fullName"
          label="HỌ VÀ TÊN"
          autoComplete="name"
          placeholder="vd: Phạm Trí Khiêm"
          disabled={isPending}
          error={fieldError("fullName")}
        />
        <AuthField
          id="register-email"
          name="email"
          type="email"
          label="EMAIL NỘI BỘ"
          autoComplete="email"
          placeholder="vd: tanantrikhiem@gmail.com"
          disabled={isPending}
          error={fieldError("email")}
        />
        <AuthSelect
          id="register-department"
          name="department"
          label="PHÒNG / BỘ PHẬN"
          defaultValue=""
          disabled={isPending}
          error={fieldError("department")}
        >
          <option value="" disabled>Chọn phòng của anh/chị</option>
          <option value="hanh-chinh">Phòng Hành chính – CNTT</option>
          <option value="phap-ly">Phòng Pháp lý</option>
          <option value="kinh-doanh">Phòng Kinh doanh</option>
        </AuthSelect>
        <AuthPasswordField
          id="register-password"
          name="password"
          label="Mật khẩu"
          autoComplete="new-password"
          placeholder="Tối thiểu 8 ký tự, có chữ và số"
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

        <AuthCheckbox id="register-terms" name="terms" error={fieldError("terms")}>
          Tôi đồng ý với nội quy sử dụng hệ thống
        </AuthCheckbox>

        <AuthSubmitButton pending={isPending} pendingLabel="Đang đăng ký..." className="mt-4">
          Tạo tài khoản
        </AuthSubmitButton>
      </form>

      {formError && <AuthAlert tone="danger">{formError}</AuthAlert>}

      <p className="text-auth-muted mt-4 text-center text-[9px]">
        Đã có tài khoản?{" "}
        <a className="text-brand font-semibold hover:underline" href={AUTH_ROUTES.login}>
          Đăng nhập
        </a>
      </p>
      <AuthAlert tone="warning">
        Tài khoản mới cần phòng CNTT phê duyệt và gán vai trò trước khi đăng nhập được.
      </AuthAlert>
    </AuthCard>
  );
}
