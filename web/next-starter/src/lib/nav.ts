import type { Route } from "next";

import type { NavGroup, NavItem } from "@/types/nav";

/**
 * `typedRoutes: true` khiến <Link href> chỉ nhận route có thật.
 * Menu lại đến từ config động (có thể là route chưa tồn tại hoặc link ngoài),
 * nên ép kiểu tại một chỗ duy nhất thay vì rải `as` khắp nơi.
 */
export function toRoute(href: string): Route {
  return href as Route;
}

/** Chuẩn hoá đường dẫn: bỏ dấu `/` thừa ở cuối. */
function normalize(path: string): string {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

/**
 * Một mục có đang active không.
 * Mặc định khớp theo prefix: `/quy-trinh` active khi ở `/quy-trinh/123`,
 * riêng `/` chỉ active khi đúng trang chủ. Có thể ghi đè bằng `item.match`.
 */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.match) return item.match(pathname);
  if (!item.href || item.external) return false;

  const href = normalize(item.href);
  const current = normalize(pathname);

  if (href === "/") return current === "/";
  return current === href || current.startsWith(`${href}/`);
}

/** Mục cha được coi là active khi chính nó hoặc bất kỳ con nào active. */
export function isNavBranchActive(item: NavItem, pathname: string): boolean {
  if (isNavItemActive(item, pathname)) return true;
  return (item.children ?? []).some((child) => isNavBranchActive(child, pathname));
}

/** Danh sách `key` của các nhánh cần mở sẵn theo pathname hiện tại. */
export function getOpenKeys(groups: NavGroup[], pathname: string): string[] {
  const keys: string[] = [];

  const walk = (items: NavItem[]) => {
    for (const item of items) {
      if (item.children?.length && isNavBranchActive(item, pathname)) {
        keys.push(item.key);
        walk(item.children);
      }
    }
  };

  groups.forEach((group) => walk(group.items));
  return keys;
}

/** Điểm "cụ thể" của một nhánh: href active dài nhất — dùng để chọn đúng mục sâu nhất. */
function branchScore(item: NavItem, pathname: string): number {
  const own = isNavItemActive(item, pathname) ? (item.href?.length ?? 1) : 0;
  const child = (item.children ?? []).reduce(
    (max, c) => Math.max(max, branchScore(c, pathname)),
    0,
  );
  return Math.max(own, child);
}

/**
 * Chuỗi breadcrumb suy ra từ config nav — dùng khi trang không tự khai báo.
 * Khi nhiều mục cùng khớp prefix (vd `/quy-trinh` và `/quy-trinh/sla`),
 * mục cụ thể hơn được chọn.
 */
export function getNavTrail(groups: NavGroup[], pathname: string): NavItem[] {
  const trail: NavItem[] = [];

  const walk = (items: NavItem[]) => {
    const candidates = items.filter((item) => isNavBranchActive(item, pathname));
    if (candidates.length === 0) return;

    const best = candidates.reduce((a, b) =>
      branchScore(b, pathname) > branchScore(a, pathname) ? b : a,
    );

    trail.push(best);
    if (best.children?.length) walk(best.children);
  };

  groups.forEach((group) => walk(group.items));
  return trail;
}
