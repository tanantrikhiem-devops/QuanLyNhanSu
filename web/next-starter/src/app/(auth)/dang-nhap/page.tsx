import { Suspense } from "react";
import type { Metadata } from "next";

import { LoginForm } from "@/features/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Đăng nhập",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Đăng nhập</CardTitle>
        <CardDescription>Dùng tài khoản nội bộ để vào hệ thống.</CardDescription>
      </CardHeader>
      <CardContent>
        {/*
          `searchParams` là dữ liệu lúc request. Cache Components đang bật nên
          phần đọc nó phải nằm trong <Suspense>, còn khung thẻ vẫn được prerender.
        */}
        <Suspense fallback={<FormSkeleton />}>
          <LoginSection searchParams={searchParams} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function LoginSection({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const target = params["tiep-tuc"];

  // Chỉ nhận đường dẫn nội bộ — chặn open redirect sang tên miền lạ.
  const redirectTo =
    typeof target === "string" && target.startsWith("/") && !target.startsWith("//")
      ? target
      : "/";

  return <LoginForm redirectTo={redirectTo} />;
}

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="mt-2 h-9 w-full" />
    </div>
  );
}
