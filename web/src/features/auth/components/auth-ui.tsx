"use client";

import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";

import { ApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

export function AuthCard({
  title,
  description,
  wide = false,
  children,
}: {
  title: string;
  description: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "auth-card border-auth-card-border w-full rounded-none border-0 bg-white shadow-none",
        wide ? "max-w-[360px]" : "max-w-[302px]",
      )}
    >
      <h2 className="text-auth-heading text-[13px] font-bold">{title}</h2>
      <p className="text-auth-muted mt-1.5 text-[9px] leading-relaxed">{description}</p>
      {children}
    </div>
  );
}

const inputClass =
  "border-auth-input-border text-auth-text focus:border-brand focus:ring-brand/10 h-[30px] w-full rounded-md border px-2.5 text-[9px] outline-none transition focus:ring-2 aria-[invalid=true]:border-auth-danger";

type InputProps = Omit<React.ComponentProps<"input">, "className"> & {
  id: string;
  label: string;
  error?: string;
};

export function AuthField({ id, label, error, ...props }: InputProps) {
  return (
    <div className="mt-3 first:mt-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input id={id} className={cn(inputClass, "mt-1.5")} aria-invalid={!!error} {...props} />
      <FieldError error={error} />
    </div>
  );
}

export function AuthPasswordField({ id, label, error, ...props }: Omit<InputProps, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mt-3 first:mt-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative mt-1.5">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className={cn(inputClass, "pr-12")}
          aria-invalid={!!error}
          {...props}
        />
        <button
          type="button"
          className="text-auth-text hover:text-brand absolute top-1/2 right-2 -translate-y-1/2 text-[8px]"
          aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          aria-controls={id}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? "Ẩn" : "Hiện"}
        </button>
      </div>
      <FieldError error={error} />
    </div>
  );
}

export function AuthSelect({
  id,
  label,
  error,
  children,
  ...props
}: Omit<React.ComponentProps<"select">, "className"> & {
  id: string;
  label: string;
  error?: string;
}) {
  return (
    <div className="mt-3 first:mt-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select id={id} className={cn(inputClass, "mt-1.5 bg-white")} aria-invalid={!!error} {...props}>
        {children}
      </select>
      <FieldError error={error} />
    </div>
  );
}

export function AuthCheckbox({
  id,
  error,
  children,
  ...props
}: Omit<React.ComponentProps<"input">, "className" | "type"> & {
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <label className="text-auth-text flex items-start gap-2 text-[9px] leading-relaxed" htmlFor={id}>
        <input id={id} type="checkbox" className="accent-brand mt-0.5 h-3.5 w-3.5 shrink-0" {...props} />
        <span>{children}</span>
      </label>
      <FieldError error={error} />
    </div>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label className="text-auth-text block text-[9px] font-medium" htmlFor={htmlFor}>
      {children}
    </label>
  );
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="text-auth-danger mt-1 text-[8px]">{error}</p>;
}

export function AuthSubmitButton({
  pending,
  pendingLabel,
  children,
  className,
}: {
  pending: boolean;
  pendingLabel: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        "bg-brand hover:bg-brand-hover focus:ring-brand/30 mt-3 h-[30px] w-full rounded-md text-[9px] font-bold text-white transition focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function AuthOutlineLink({ href, children }: { href: Route; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="border-auth-outline-border text-auth-text hover:bg-auth-hover focus-visible:outline-brand mt-3 flex h-[30px] w-full items-center justify-center rounded-md border text-[9px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {children}
    </Link>
  );
}

const alertTone = {
  danger: "bg-auth-danger-bg text-auth-danger",
  success: "bg-auth-success-bg text-auth-success",
  info: "bg-auth-info-bg text-auth-info",
  note: "bg-auth-note-bg text-auth-note",
  warning: "bg-[#fff3df] text-[#76511c]",
} as const;

export function AuthAlert({
  tone,
  children,
}: {
  tone: keyof typeof alertTone;
  children: React.ReactNode;
}) {
  return (
    <p
      role={tone === "danger" ? "alert" : tone === "success" ? "status" : undefined}
      className={cn("mt-3 rounded-md px-2.5 py-2 text-[8px] leading-relaxed", alertTone[tone])}
    >
      {children}
    </p>
  );
}

export function useFormErrors<F extends string>(error: unknown) {
  const [clientErrors, setClientErrors] = useState<Partial<Record<F, string>>>({});
  const apiError = error instanceof ApiError ? error : null;

  return {
    setClientErrors,
    fieldError: (field: F) => clientErrors[field] ?? apiError?.fieldError(field),
    formError:
      apiError && Object.keys(apiError.fieldErrors).length === 0 ? apiError.message : null,
  };
}

export function issuesToFieldErrors<F extends string>(
  issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>,
): Partial<Record<F, string>> {
  const result: Partial<Record<F, string>> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]) as F;
    if (result[key] === undefined) result[key] = issue.message;
  }
  return result;
}
