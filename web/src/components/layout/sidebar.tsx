"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsDesktop } from "@/hooks/use-media-query";
import { getOpenKeys, isNavBranchActive, isNavItemActive, toRoute } from "@/lib/nav";
import { cn } from "@/lib/utils";
import type { NavGroup, NavItem } from "@/types/nav";

export type SidebarProps = {
  groups: NavGroup[];
  brandLogo?: React.ReactNode;
  brandTitle?: string;
  brandSubtitle?: string;
  brandHref?: string;
  footer?: React.ReactNode;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  className?: string;
};

type BodyProps = Pick<
  SidebarProps,
  "groups" | "brandLogo" | "brandTitle" | "brandSubtitle" | "brandHref" | "footer"
> & {
  iconOnly: boolean;
  layoutIdPrefix: string;
  onNavigate?: () => void;
};

export function Sidebar({
  collapsed,
  onCollapsedChange,
  mobileOpen,
  onMobileOpenChange,
  className,
  ...bodyProps
}: SidebarProps) {
  const isDesktop = useIsDesktop();
  const iconOnly = isDesktop && collapsed;

  const onShortcut = useEffectEvent(() => {
    if (isDesktop) onCollapsedChange(!collapsed);
    else onMobileOpenChange(!mobileOpen);
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onShortcut();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <TooltipProvider>
      <motion.aside
        data-collapsed={collapsed}
        animate={{ width: iconOnly ? "var(--sidebar-width-collapsed)" : "var(--sidebar-width)" }}
        initial={false}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-30 hidden shrink-0 flex-col lg:flex",
          className,
        )}
      >
        <SidebarBody {...bodyProps} iconOnly={iconOnly} layoutIdPrefix="sidebar-desktop" />

        <button
          type="button"
          onClick={() => onCollapsedChange(!collapsed)}
          aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
          title={`${collapsed ? "Mở rộng" : "Thu gọn"} (Ctrl + B)`}
          className={cn(
            "text-sidebar-foreground/80 hover:text-sidebar-foreground focus-visible:ring-sidebar-ring/60 absolute top-[calc(var(--topbar-height)/2)] z-40 grid size-7 -translate-y-1/2 place-items-center rounded-md border border-white/20 transition-colors outline-none hover:bg-white/10 focus-visible:ring-[3px]",
            iconOnly ? "bg-sidebar -right-3.5" : "right-3",
          )}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </motion.aside>

      {!isDesktop && (
        <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
          <SheetContent
            open={mobileOpen}
            side="left"
            hideClose
            title={bodyProps.brandTitle ?? "Điều hướng"}
            className="bg-sidebar text-sidebar-foreground w-[17rem] p-0"
          >
            <SidebarBody
              {...bodyProps}
              iconOnly={false}
              layoutIdPrefix="sidebar-mobile"
              onNavigate={() => onMobileOpenChange(false)}
            />
          </SheetContent>
        </Sheet>
      )}
    </TooltipProvider>
  );
}

function SidebarBody({ groups, footer, iconOnly, layoutIdPrefix, onNavigate, ...brand }: BodyProps) {
  return (
    <>
      <Brand {...brand} iconOnly={iconOnly} />
      <SidebarNav
        groups={groups}
        iconOnly={iconOnly}
        layoutIdPrefix={layoutIdPrefix}
        onNavigate={onNavigate}
      />
      {footer && (
        <>
          <div className="bg-sidebar-border h-px" />
          <div className={cn("p-2", iconOnly && "px-1.5")}>{footer}</div>
        </>
      )}
    </>
  );
}

function Brand({
  brandLogo,
  brandTitle,
  brandSubtitle,
  brandHref,
  iconOnly,
}: Pick<BodyProps, "brandLogo" | "brandTitle" | "brandSubtitle" | "brandHref" | "iconOnly">) {
  return (
    <Link
      href={toRoute(brandHref ?? "/")}
      className={cn(
        "flex h-topbar items-center gap-2.5 pr-11 pl-3.5 transition-opacity hover:opacity-90",
        iconOnly && "justify-center px-0",
      )}
    >
      <span className="bg-brand-gold text-brand-ink grid size-8 shrink-0 place-items-center rounded-md text-xs font-bold">
        {brandLogo ?? brandTitle?.charAt(0) ?? "A"}
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

function SidebarNav({
  groups,
  iconOnly,
  layoutIdPrefix,
  onNavigate,
}: {
  groups: NavGroup[];
  iconOnly: boolean;
  layoutIdPrefix: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const autoOpen = useMemo(() => getOpenKeys(groups, pathname), [groups, pathname]);
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  const openKeys = useMemo(() => {
    const keys = new Set(autoOpen);
    for (const [key, open] of Object.entries(overrides)) {
      if (open) keys.add(key);
      else keys.delete(key);
    }
    return Array.from(keys);
  }, [autoOpen, overrides]);

  const toggleOpen = (key: string) => {
    setOverrides((prev) => ({ ...prev, [key]: !(prev[key] ?? autoOpen.includes(key)) }));
  };

  return (
    <nav aria-label="Điều hướng chính" className="scrollbar-thin flex-1 overflow-y-auto px-2.5 py-4">
      {groups.map((group, index) => (
        <div key={group.key} className={cn(index > 0 && "mt-5")}>
          <AnimatePresence initial={false}>
            {group.label && !iconOnly && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sidebar-muted px-2.5 pb-2.5 text-[0.625rem] font-bold tracking-[0.14em] uppercase"
              >
                {group.label}
              </motion.p>
            )}
          </AnimatePresence>

          {iconOnly && index > 0 && <div className="bg-sidebar-border mx-2 mb-3 h-px" />}

          <ul className="space-y-1.5">
            {group.items.map((item) => (
              <SidebarNavItem
                key={item.key}
                item={item}
                pathname={pathname}
                iconOnly={iconOnly}
                layoutIdPrefix={layoutIdPrefix}
                openKeys={openKeys}
                onToggleOpen={toggleOpen}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

const rowClass =
  "group/item relative flex min-h-11 w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-[0.8125rem] leading-tight font-semibold transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50";

function SidebarNavItem({
  item,
  pathname,
  iconOnly,
  depth = 0,
  layoutIdPrefix,
  openKeys,
  onToggleOpen,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  iconOnly: boolean;
  depth?: number;
  layoutIdPrefix: string;
  openKeys: string[];
  onToggleOpen: (key: string) => void;
  onNavigate?: () => void;
}) {
  const hasChildren = Boolean(item.children?.length);
  const active = hasChildren ? isNavBranchActive(item, pathname) : isNavItemActive(item, pathname);
  const open = openKeys.includes(item.key);
  const Icon = item.icon;

  const rowStateClass = cn(
    rowClass,
    active
      ? "text-sidebar-accent-foreground"
      : "text-sidebar-foreground/85 hover:text-sidebar-foreground hover:bg-white/5",
    item.disabled && "pointer-events-none opacity-50",
    iconOnly && "justify-center px-0",
  );

  const content = (
    <>
      {active && (
        <motion.span
          layoutId={`${layoutIdPrefix}-active`}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          className="bg-sidebar-accent absolute inset-0 -z-10 rounded-lg shadow-[0_6px_16px_rgb(0_0_0/0.25)]"
        >
          {depth === 0 && (
            <span className="bg-brand-gold absolute inset-y-2 -left-2.5 w-1 rounded-r" />
          )}
        </motion.span>
      )}

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

      <AnimatePresence initial={false}>
        {!iconOnly && (
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

      {item.badge !== undefined && !iconOnly && (
        <span className="bg-brand-gold text-brand-ink ml-auto grid h-5 min-w-5 shrink-0 place-items-center rounded-full px-1.5 text-[0.625rem] font-bold">
          {item.badge}
        </span>
      )}

      {hasChildren && !iconOnly && (
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
      className={rowStateClass}
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
      className={rowStateClass}
    >
      {content}
      <NavPending />
    </Link>
  );

  return (
    <li style={depth > 0 && !iconOnly ? { paddingLeft: depth * 12 } : undefined}>
      {iconOnly ? (
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
          {open && !iconOnly && (
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
                    iconOnly={iconOnly}
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

function NavPending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return <Loader2 className="text-sidebar-muted ml-auto size-3.5 animate-spin" />;
}
