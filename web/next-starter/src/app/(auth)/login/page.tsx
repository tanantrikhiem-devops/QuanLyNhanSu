import { Suspense } from "react";
import type { Metadata } from "next";

import { LoginForm, REDIRECT_PARAM, safeRedirect } from "@/features/auth";

export const metadata: Metadata = { title: "Đăng nhập" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<LoginForm />}>
      <LoginSection searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginSection({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  return <LoginForm redirectTo={safeRedirect(params[REDIRECT_PARAM])} />;
}
