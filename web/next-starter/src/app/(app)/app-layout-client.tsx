"use client";

import { Bell, Plus } from "lucide-react";

import { AppShell, Topbar, UserMenu } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { navGroups } from "@/config/nav";
import { RequireAuth, useLogout, useMe } from "@/features/auth";
import type { User } from "@/schemas/auth";

/**
 * Lớp wiring giữa config và core layout.
 * Phải là Client Component vì `navGroups` chứa icon (function) — React không
 * serialize được function khi truyền từ Server sang Client Component.
 */
export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  // Cùng queryKey với <RequireAuth> nên vẫn chỉ một lượt gọi `/users/me`.
  const { data: user } = useMe();
  const logout = useLogout();

  return (
    <AppShell
      groups={navGroups}
      brandTitle="Tanan Workflow"
      brandSubtitle="Quản trị vận hành"
      footer={
        user ? (
          <UserMenu user={toMenuUser(user)} showDetails onSignOut={() => logout.mutate()} />
        ) : (
          <UserMenuSkeleton />
        )
      }
      topbar={
        <Topbar
          actions={
            <>
              <Button variant="ghost" size="icon" aria-label="Thông báo">
                <Bell />
              </Button>
              <Button size="sm">
                <Plus />
                Tạo mới
              </Button>
            </>
          }
        />
      }
    >
      <RequireAuth>{children}</RequireAuth>
    </AppShell>
  );
}

/** `UserRead` chỉ có `id` + `email`, nên tên hiển thị suy ra từ phần trước @. */
function toMenuUser(user: User) {
  return {
    name: user.email.split("@")[0] ?? user.email,
    email: user.email,
  };
}

/** Giữ đúng chỗ của UserMenu trong footer sidebar khi `/users/me` chưa về. */
function UserMenuSkeleton() {
  return (
    <div className="flex w-full items-center gap-2.5 p-1" aria-busy="true">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}
