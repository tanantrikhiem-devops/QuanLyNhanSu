"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

import { useSidebar } from "./sidebar/sidebar-context";

export type TopbarProps = {
  /** Thường là <Breadcrumbs /> hoặc tiêu đề trang. */
  children?: React.ReactNode;
  /** Slot bên phải: nút tạo mới, thông báo, user menu… */
  actions?: React.ReactNode;
  /** Ô tìm kiếm ở giữa. */
  search?: React.ReactNode;
  showThemeToggle?: boolean;
  className?: string;
};

export function Topbar({
  children,
  actions,
  search,
  showThemeToggle = true,
  className,
}: TopbarProps) {
  const { setMobileOpen } = useSidebar();

  return (
    <header
      className={cn(
        "bg-background/80 border-border sticky top-0 z-20 flex h-topbar items-center gap-3 border-b px-3 backdrop-blur-md sm:px-4",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Mở menu"
        onClick={() => setMobileOpen(true)}
      >
        <Menu />
      </Button>

      <div className="min-w-0 flex-1 lg:pl-3">{children}</div>

      {search && <div className="hidden md:block">{search}</div>}

      <div className="flex items-center gap-1.5">
        {actions}
        {showThemeToggle && (
          <>
            {actions && <Separator orientation="vertical" className="mx-1 h-5" />}
            <ThemeToggle />
          </>
        )}
      </div>
    </header>
  );
}
