"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { isNavBranchActive, isNavItemActive, toRoute } from "@/lib/nav";
import type { NavItem } from "@/types/nav";

import { NavPending } from "./nav-pending";
import { useSidebar } from "./sidebar-context";

type SidebarNavItemProps = {
  item: NavItem;
  pathname: string;
  /** Độ sâu menu con — dùng để thụt lề. */
  depth?: number;
  /** Tránh trùng `layoutId` giữa sidebar desktop và drawer mobile. */
  layoutIdPrefix: string;
  openKeys: string[];
  onToggleOpen: (key: string) => void;
  /** Gọi khi điều hướng — drawer mobile dùng để tự đóng. */
  onNavigate?: () => void;
};

const rowClass =
  "group/item relative flex min-h-11 w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-[0.8125rem] leading-tight font-semibold transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50";

export function SidebarNavItem({
  item,
  pathname,
  depth = 0,
  layoutIdPrefix,
  openKeys,
  onToggleOpen,
  onNavigate,
}: SidebarNavItemProps) {
  const { isIconOnly } = useSidebar();
  const hasChildren = Boolean(item.children?.length);
  const active = hasChildren ? isNavBranchActive(item, pathname) : isNavItemActive(item, pathname);
  const open = openKeys.includes(item.key);
  const Icon = item.icon;

  const label = (
    <AnimatePresence initial={false}>
      {!isIconOnly && (
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: 0.15 }}
          className="line-clamp-2 flex-1 text-left"
        >
          {item.label}
        </motion.span>
      )}
    </AnimatePresence>
  );

  const badge =
    item.badge !== undefined && !isIconOnly ? (
      <span className="bg-brand-gold text-brand-ink ml-auto grid h-5 min-w-5 shrink-0 place-items-center rounded-full px-1.5 text-[0.625rem] font-bold">
        {item.badge}
      </span>
    ) : null;

  const indicator = active ? (
    <motion.span
      layoutId={`${layoutIdPrefix}-active`}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      className="bg-sidebar-accent absolute inset-0 -z-10 rounded-lg shadow-[0_6px_16px_rgb(0_0_0/0.25)]"
    >
      {depth === 0 && <span className="bg-brand-gold absolute inset-y-2 -left-2.5 w-1 rounded-r" />}
    </motion.span>
  ) : null;

  const content = (
    <>
      {indicator}
      {Icon ? (
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-md transition-colors",
            active ? "bg-white/15" : "bg-white/[0.06] group-hover/item:bg-white/10",
          )}
        >
          <Icon className="size-4" />
        </span>
      ) : (
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full transition-colors",
            active ? "bg-sidebar-accent-foreground" : "bg-sidebar-muted",
          )}
        />
      )}
      {label}
      {badge}
      {hasChildren && !isIconOnly && (
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.18 }}
          className="text-sidebar-muted ml-auto"
        >
          <ChevronRight className="size-4" />
        </motion.span>
      )}
    </>
  );

  const row = hasChildren ? (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={`nav-${item.key}`}
      disabled={item.disabled}
      onClick={() => onToggleOpen(item.key)}
      className={cn(
        rowClass,
        active
          ? "text-sidebar-accent-foreground"
          : "text-sidebar-foreground/85 hover:text-sidebar-foreground hover:bg-white/5",
        item.disabled && "pointer-events-none opacity-50",
        isIconOnly && "justify-center px-0",
      )}
    >
      {content}
    </button>
  ) : (
    <Link
      href={toRoute(item.href ?? "#")}
      aria-current={active ? "page" : undefined}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer noopener" : undefined}
      onClick={onNavigate}
      className={cn(
        rowClass,
        active
          ? "text-sidebar-accent-foreground"
          : "text-sidebar-foreground/85 hover:text-sidebar-foreground hover:bg-white/5",
        item.disabled && "pointer-events-none opacity-50",
        isIconOnly && "justify-center px-0",
      )}
    >
      {content}
      <NavPending />
    </Link>
  );

  return (
    <li style={depth > 0 && !isIconOnly ? { paddingLeft: depth * 12 } : undefined}>
      {isIconOnly ? (
        <Tooltip>
          <TooltipTrigger asChild>{row}</TooltipTrigger>
          <TooltipContent side="right">
            {item.label}
            {item.badge !== undefined && ` · ${item.badge}`}
          </TooltipContent>
        </Tooltip>
      ) : (
        row
      )}

      {hasChildren && (
        <AnimatePresence initial={false}>
          {open && !isIconOnly && (
            <motion.div
              id={`nav-${item.key}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <ul className="border-sidebar-border mt-1 space-y-1 border-l pl-2">
                {item.children!.map((child) => (
                  <SidebarNavItem
                    key={child.key}
                    item={child}
                    pathname={pathname}
                    depth={depth + 1}
                    layoutIdPrefix={layoutIdPrefix}
                    openKeys={openKeys}
                    onToggleOpen={onToggleOpen}
                    onNavigate={onNavigate}
                  />
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </li>
  );
}
