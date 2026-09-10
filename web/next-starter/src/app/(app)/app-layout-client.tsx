"use client";

import { Bell, Plus } from "lucide-react";

import { AppShell, Topbar, UserMenu, type UserMenuUser } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { navGroups } from "@/config/nav";

/**
 * Lớp wiring giữa config và core layout.
 * Phải là Client Component vì `navGroups` chứa icon (function) — React không
 * serialize được function khi truyền từ Server sang Client Component.
 */
export function AppLayoutClient({
  user,
  children,
}: {
  user: UserMenuUser;
  children: React.ReactNode;
}) {
  return (
    <AppShell
      groups={navGroups}
      brandTitle="Tanan Workflow"
      brandSubtitle="Quản trị vận hành"
      footer={<UserMenu user={user} showDetails />}
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
        >
        </Topbar>
      }
    >
      {children}
    </AppShell>
  );
}
