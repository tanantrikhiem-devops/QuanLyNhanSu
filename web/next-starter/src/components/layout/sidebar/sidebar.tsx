"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toRoute } from "@/lib/nav";
import type { NavGroup } from "@/types/nav";

import { useSidebar } from "./sidebar-context";
import { SidebarNav } from "./sidebar-nav";

export type SidebarProps = {
  groups: NavGroup[];
  /** Logo: chữ cái, icon hoặc <Image />. */
  brandLogo?: React.ReactNode;
  brandTitle?: string;
  brandSubtitle?: string;
  brandHref?: string;
  /** Thay toàn bộ khối brand mặc định. */
  brand?: React.ReactNode;
  /** Slot ngay dưới brand: ô tìm kiếm, chọn workspace… */
  header?: React.ReactNode;
  /** Slot dưới cùng: thẻ người dùng, phiên bản, nút hỗ trợ… */
  footer?: React.ReactNode;
  /** Cho phép thu gọn ở desktop. */
  collapsible?: boolean;
  className?: string;
};

function Brand({
  brand,
  brandLogo,
  brandTitle,
  brandSubtitle,
  brandHref,
  iconOnly,
}: Pick<SidebarProps, "brand" | "brandLogo" | "brandTitle" | "brandSubtitle" | "brandHref"> & {
  iconOnly: boolean;
}) {
  if (brand) return <>{brand}</>;

  return (
    <Link
      href={toRoute(brandHref ?? "/")}
      className={cn(
        "flex h-topbar items-center gap-2.5 pr-11 pl-3.5 transition-opacity hover:opacity-90",
        iconOnly && "justify-center px-0",
      )}
    >
      <span className="bg-brand-gold text-brand-ink grid size-8 shrink-0 place-items-center rounded-md text-xs font-bold">
        {brandLogo ?? (brandTitle?.charAt(0) ?? "A")}
      </span>

      <AnimatePresence initial={false}>
        {!iconOnly && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="flex min-w-0 flex-col leading-tight"
          >
            <span className="truncate text-sm font-bold tracking-wide">{brandTitle ?? "App"}</span>
            {brandSubtitle && (
              <span className="text-sidebar-muted truncate text-[0.6875rem]">{brandSubtitle}</span>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

/** Nội dung dùng chung cho cả sidebar desktop và drawer mobile. */
function SidebarBody({
  groups,
  layoutIdPrefix,
  onNavigate,
  header,
  footer,
  iconOnly,
  ...brandProps
}: SidebarProps & { layoutIdPrefix: string; onNavigate?: () => void; iconOnly: boolean }) {
  return (
    <>
      <Brand {...brandProps} iconOnly={iconOnly} />
      {header && <div className={cn("px-2 pt-3", iconOnly && "px-1.5")}>{header}</div>}
      <SidebarNav groups={groups} layoutIdPrefix={layoutIdPrefix} onNavigate={onNavigate} />
      {footer && (
        <>
          <div className="bg-sidebar-border h-px" />
          <div className={cn("p-2", iconOnly && "px-1.5")}>{footer}</div>
        </>
      )}
    </>
  );
}

/**
 * Sidebar core: desktop là cột cố định thu gọn được, mobile là drawer trượt.
 * Toàn bộ nội dung đến từ props nên có thể tái sử dụng cho bất kỳ app nào.
 */
export function Sidebar({ collapsible = true, className, ...props }: SidebarProps) {
  const { collapsed, toggleCollapsed, isDesktop, isIconOnly, mobileOpen, setMobileOpen } =
    useSidebar();

  return (
    <>
      <motion.aside
        data-collapsed={collapsed}
        animate={{ width: isIconOnly ? "var(--sidebar-width-collapsed)" : "var(--sidebar-width)" }}
        initial={false}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-30 hidden shrink-0 flex-col lg:flex",
          className,
        )}
      >
        <SidebarBody {...props} layoutIdPrefix="sidebar-desktop" iconOnly={isIconOnly} />

        {collapsible && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggleCollapsed}
                aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
                className={cn(
                  "text-sidebar-foreground/80 hover:text-sidebar-foreground focus-visible:ring-sidebar-ring/60 absolute top-[calc(var(--topbar-height)/2)] grid size-7 -translate-y-1/2 place-items-center rounded-md border border-white/20 transition-colors outline-none hover:bg-white/10 focus-visible:ring-[3px]",
                  isIconOnly ? "bg-sidebar -right-3.5" : "right-3",
                )}
              >
                {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {collapsed ? "Mở rộng" : "Thu gọn"} · ⌘/Ctrl + B
            </TooltipContent>
          </Tooltip>
        )}
      </motion.aside>

      {!isDesktop && (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            open={mobileOpen}
            side="left"
            hideClose
            title={props.brandTitle ?? "Điều hướng"}
            className="bg-sidebar text-sidebar-foreground w-[17rem] p-0"
          >
            <SidebarBody
              {...props}
              layoutIdPrefix="sidebar-mobile"
              iconOnly={false}
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
