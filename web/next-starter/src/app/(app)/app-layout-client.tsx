"use client";

import { Bell, Plus } from "lucide-react";

import { AppShell, Topbar, UserMenu } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { navGroups } from "@/config/nav";
import { RequireAuth, useLogout } from "@/features/auth";
import type { User } from "@/schemas/auth";

/**
 * Lớp wiring giữa config và core layout.
 * Phải là Client Component vì `navGroups` chứa icon (function) — React không
 * serialize được function khi truyền từ Server sang Client Component.
 */
export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const logout = useLogout();

  return (
    <RequireAuth>
      {(user) => (
        <AppShell
          groups={navGroups}
          brandTitle="Tanan Workflow"
          brandSubtitle="Quản trị vận hành"
          footer={
            <UserMenu
              user={toMenuUser(user)}
              showDetails
              onSignOut={() => logout.mutate()}
            />
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
          {children}
        </AppShell>
      )}
    </RequireAuth>
  );
}

/** `UserRead` chỉ có `id` + `email`, nên tên hiển thị suy ra từ phần trước @. */
function toMenuUser(user: User) {
  return {
    name: user.email.split("@")[0] ?? user.email,
    email: user.email,
  };
}
