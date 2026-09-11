"use client";

import { Bell, KeyRound } from "lucide-react";

import { AppShell, Breadcrumbs, Topbar, TopbarSearch, UserMenu } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { navGroups } from "@/config/nav";
import { RequireAuth, useLogout, useMe } from "@/features/auth";
import type { User } from "@/lib/api/contracts";

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const { data: user } = useMe();
  const logout = useLogout();

  return (
    <AppShell
      groups={navGroups}
      brandLogo="TA"
      brandTitle="TÂN AN"
      brandSubtitle="Quản lý hồ sơ vụ việc"
      contentClassName="px-4 py-5 sm:px-5"
      topbar={
        <Topbar
          showThemeToggle={false}
          actions={
            <div className="flex items-center gap-3">
              <NotificationBell count={11} />
              <span className="border-primary/40 bg-auth-success-bg text-primary hidden h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold sm:inline-flex">
                <KeyRound className="size-3.5" />
                Quản trị
              </span>
              {user ? (
                <UserMenu
                  user={toMenuUser(user)}
                  showDetails
                  className="w-auto"
                  onSignOut={() => logout.mutate()}
                />
              ) : (
                <UserMenuSkeleton />
              )}
            </div>
          }
        >
          <div className="flex min-w-0 items-center gap-4">
            <Breadcrumbs
              groups={navGroups}
              home={{ label: "Cấu hình hệ thống" }}
              separator={<span className="opacity-60">/</span>}
              className="shrink-0"
            />
            <TopbarSearch
              placeholder="Tìm hồ sơ, khách hàng..."
              className="hidden md:flex"
            />
          </div>
        </Topbar>
      }
    >
      <RequireAuth>{children}</RequireAuth>
    </AppShell>
  );
}

function NotificationBell({ count }: { count: number }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      aria-label={`Thông báo, ${count} chưa đọc`}
    >
      <Bell className="text-brand-gold fill-brand-gold/30" />
      {count > 0 && (
        <span className="bg-destructive absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[0.5625rem] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Button>
  );
}

function toMenuUser(user: User) {
  return {
    name: user.email.split("@")[0] ?? user.email,
    email: user.email,
    role: "Quản trị hệ thống",
  };
}

function UserMenuSkeleton() {
  return (
    <div className="flex items-center gap-2.5 p-1" aria-busy="true">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="hidden flex-col gap-1 sm:flex">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
