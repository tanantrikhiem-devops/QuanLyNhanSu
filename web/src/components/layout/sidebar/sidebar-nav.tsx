"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { getOpenKeys } from "@/lib/nav";
import type { NavGroup } from "@/types/nav";

import { useSidebar } from "./sidebar-context";
import { SidebarNavItem } from "./sidebar-nav-item";

export type SidebarNavProps = {
  groups: NavGroup[];
  /** Chuỗi duy nhất cho mỗi bản sidebar (desktop / drawer) để `layoutId` không trùng. */
  layoutIdPrefix?: string;
  onNavigate?: () => void;
  className?: string;
};

export function SidebarNav({
  groups,
  layoutIdPrefix = "sidebar",
  onNavigate,
  className,
}: SidebarNavProps) {
  const pathname = usePathname();
  const { isIconOnly } = useSidebar();

  const autoOpen = React.useMemo(() => getOpenKeys(groups, pathname), [groups, pathname]);

  // Chỉ lưu những nhánh người dùng tự bật/tắt; trạng thái cuối = override ?? tự động.
  // Cách này bỏ hẳn useEffect đồng bộ state (React Compiler cảnh báo cascading render).
  const [overrides, setOverrides] = React.useState<Record<string, boolean>>({});

  const openKeys = React.useMemo(() => {
    const keys = new Set(autoOpen);
    for (const [key, open] of Object.entries(overrides)) {
      if (open) keys.add(key);
      else keys.delete(key);
    }
    return Array.from(keys);
  }, [autoOpen, overrides]);

  const toggleOpen = React.useCallback(
    (key: string) => {
      setOverrides((prev) => ({ ...prev, [key]: !(prev[key] ?? autoOpen.includes(key)) }));
    },
    [autoOpen],
  );

  return (
    <nav
      aria-label="Điều hướng chính"
      className={cn("scrollbar-thin flex-1 overflow-y-auto px-2.5 py-4", className)}
    >
      {groups.map((group, index) => (
        <div key={group.key} className={cn(index > 0 && "mt-5")}>
          <AnimatePresence initial={false}>
            {group.label && !isIconOnly && (
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

          {isIconOnly && index > 0 && <div className="bg-sidebar-border mx-2 mb-3 h-px" />}

          <ul className="space-y-1.5">
            {group.items.map((item) => (
              <SidebarNavItem
                key={item.key}
                item={item}
                pathname={pathname}
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
