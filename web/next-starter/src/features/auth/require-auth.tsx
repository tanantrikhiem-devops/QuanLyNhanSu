"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useMe } from "@/features/auth/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/schemas/auth";

/**
 * Chốt chặn phía client. `src/proxy.ts` đã chặn sẵn ở tầng request dựa trên sự
 * tồn tại của `refresh_token`, nhưng cookie có mà token hỏng/hết hạn thì chỉ
 * `/users/me` mới biết — nên vẫn cần lớp này.
 *
 * Nhận `children` dạng render prop để nhánh đã đăng nhập luôn có `user` chắc chắn
 * khác `undefined`, không phải `user!` ở mọi nơi.
 */
export function RequireAuth({ children }: { children: (user: User) => React.ReactNode }) {
  const { data: user, isPending, isError } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (isError) router.replace("/dang-nhap");
  }, [isError, router]);

  if (isPending) return <AuthPlaceholder />;
  if (user === undefined) return <AuthPlaceholder />;

  return <>{children(user)}</>;
}

function AuthPlaceholder() {
  return (
    <div className="flex flex-col gap-3 p-6" aria-busy="true">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full max-w-md" />
      <Skeleton className="h-4 w-full max-w-sm" />
    </div>
  );
}
