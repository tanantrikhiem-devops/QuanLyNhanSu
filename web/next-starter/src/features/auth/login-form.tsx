"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { useLogin } from "@/features/auth/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/errors";
import { loginInputSchema } from "@/schemas/auth";
import { cn } from "@/lib/utils";

type FieldErrors = Partial<Record<"email" | "password", string>>;

export function LoginForm({
  redirectTo = "/",
  className,
}: {
  /** Đường dẫn quay lại sau khi đăng nhập, do `src/proxy.ts` gắn vào query. */
  redirectTo?: string;
  className?: string;
}) {
  const { mutate, isPending, error } = useLogin(redirectTo);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});

  // Lỗi hiển thị = lỗi validate ở client, nếu không có thì lấy lỗi 422 của server.
  const apiError = error instanceof ApiError ? error : null;
  const fieldError = (field: "email" | "password") =>
    clientErrors[field] ?? apiError?.fieldError(field);

  // 401 không gắn với field nào — hiện thành banner phía trên form.
  const formError = apiError && Object.keys(apiError.fieldErrors).length === 0 ? apiError.message : null;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = loginInputSchema.safeParse({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });

    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if ((key === "email" || key === "password") && next[key] === undefined) {
          next[key] = issue.message;
        }
      }
      setClientErrors(next);
      return;
    }

    setClientErrors({});
    mutate(parsed.data);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("flex flex-col gap-4", className)}>
      {formError && (
        <p
          role="alert"
          className="border-destructive/40 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
        >
          {formError}
        </p>
      )}

      <Field label="Email" error={fieldError("email")}>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ban@congty.vn"
          disabled={isPending}
          aria-invalid={fieldError("email") !== undefined}
        />
      </Field>

      <Field label="Mật khẩu" error={fieldError("password")}>
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={isPending}
          aria-invalid={fieldError("password") !== undefined}
        />
      </Field>

      <Button type="submit" disabled={isPending} className="mt-2">
        {isPending && <Loader2 className="animate-spin" />}
        Đăng nhập
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error && <span className="text-destructive text-xs">{error}</span>}
    </label>
  );
}
