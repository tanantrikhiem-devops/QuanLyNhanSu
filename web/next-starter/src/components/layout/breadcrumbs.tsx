"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { getNavTrail, toRoute } from "@/lib/nav";
import type { BreadcrumbItem, NavGroup } from "@/types/nav";

export type BreadcrumbsProps = {
  /** Chuỗi breadcrumb tự khai báo. Bỏ trống thì suy ra từ `groups`. */
  items?: BreadcrumbItem[];
  /** Config nav để suy ra breadcrumb theo pathname. */
  groups?: NavGroup[];
  /** Mục đầu tiên (thường là Trang chủ). Truyền `null` để bỏ. */
  home?: BreadcrumbItem | null;
  className?: string;
};

export function Breadcrumbs({
  items,
  groups,
  home = { label: "Trang chủ", href: "/" },
  className,
}: BreadcrumbsProps) {
  const pathname = usePathname();

  const resolved = React.useMemo<BreadcrumbItem[]>(() => {
    if (items?.length) return items;
    if (!groups?.length) return [];
    return getNavTrail(groups, pathname).map((item) => ({ label: item.label, href: item.href }));
  }, [items, groups, pathname]);

  const all = home ? [home, ...resolved] : resolved;
  if (all.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="text-muted-foreground flex items-center gap-1 text-sm">
        {all.map((item, index) => {
          const last = index === all.length - 1;
          return (
            <li
              key={`${item.label}-${index}`}
              className={cn("min-w-0 items-center gap-1", last ? "flex" : "hidden sm:flex")}
            >
              {index > 0 && <ChevronRight className="size-3.5 shrink-0 opacity-60" />}
              {item.href && !last ? (
                <Link href={toRoute(item.href)} className="hover:text-foreground truncate transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn("truncate", last && "text-foreground font-medium")}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
