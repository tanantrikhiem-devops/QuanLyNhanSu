"use client";

import * as React from "react";
import { motion } from "motion/react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { NavGroup } from "@/types/nav";

import { Sidebar, type SidebarProps } from "./sidebar/sidebar";
import { SidebarProvider, useSidebar } from "./sidebar/sidebar-context";

export type AppShellProps = Omit<SidebarProps, "groups"> & {
  groups: NavGroup[];
  children: React.ReactNode;
  /** Thanh trên cùng — thường là <Topbar />. */
  topbar?: React.ReactNode;
  defaultCollapsed?: boolean;
  /** Giới hạn bề ngang nội dung; đặt `false` để dùng toàn bộ chiều rộng. */
  contentClassName?: string;
};

/** Phần bên trong, cần ở dưới provider để đọc trạng thái thu gọn. */
function ShellContent({
  children,
  topbar,
  contentClassName,
  ...sidebarProps
}: Omit<AppShellProps, "defaultCollapsed">) {
  const { isIconOnly } = useSidebar();

  return (
    <div className="bg-background min-h-svh">
      <Sidebar {...sidebarProps} />

      <motion.div
        initial={false}
        animate={{
          paddingLeft: isIconOnly ? "var(--sidebar-width-collapsed)" : "var(--sidebar-width)",
        }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="flex min-h-svh flex-col max-lg:pl-0!"
      >
        {topbar}
        <main className={cn("flex-1 px-4 py-6 sm:px-6 lg:px-8", contentClassName)}>{children}</main>
      </motion.div>
    </div>
  );
}

/**
 * Khung ứng dụng dùng chung: sidebar + topbar + vùng nội dung.
 * Mọi dữ liệu (menu, brand, user) truyền từ ngoài vào nên dùng lại được cho dự án khác.
 */
export function AppShell({ defaultCollapsed = false, ...props }: AppShellProps) {
  return (
    <SidebarProvider defaultCollapsed={defaultCollapsed}>
      <TooltipProvider>
        <ShellContent {...props} />
      </TooltipProvider>
    </SidebarProvider>
  );
}
