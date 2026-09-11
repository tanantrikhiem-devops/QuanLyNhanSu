import { Suspense } from "react";
import type { Metadata } from "next";

import { ResetPasswordForm } from "@/features/auth";

export const metadata: Metadata = { title: "Đặt mật khẩu mới" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function ResetPasswordPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<ResetPasswordForm />}>
      <ResetSection searchParams={searchParams} />
    </Suspense>
  );
}

async function ResetSection({ searchParams }: { searchParams: SearchParams }) {
  const { token } = await searchParams;
  return <ResetPasswordForm token={typeof token === "string" && token ? token : undefined} />;
}
