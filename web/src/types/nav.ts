import type { LucideIcon } from "lucide-react";

/**
 * Một mục điều hướng trong sidebar.
 * Core component không tự biết route nào — mọi thứ đến từ config,
 * nên app khác chỉ cần đưa mảng `NavItem[]` là dùng lại được.
 */
export type NavItem = {
  /** Khoá duy nhất, dùng cho React key và trạng thái mở/đóng. */
  key: string;
  label: string;
  href?: string;
  icon?: LucideIcon;
  /** Badge nhỏ bên phải: số thông báo, "Mới", "Beta"… */
  badge?: string | number;
  disabled?: boolean;
  /** Mở tab mới (link ngoài). */
  external?: boolean;
  /** Menu con — render dạng collapsible (desktop) / accordion (mobile). */
  children?: NavItem[];
  /**
   * Ghi đè cách xác định active. Mặc định: so khớp `href` với pathname
   * theo kiểu prefix (`/don-hang` active khi ở `/don-hang/123`).
   */
  match?: (pathname: string) => boolean;
};

/** Nhóm các mục điều hướng, có tiêu đề nhỏ phía trên. */
export type NavGroup = {
  key: string;
  /** Bỏ trống nếu không muốn hiện tiêu đề nhóm. */
  label?: string;
  items: NavItem[];
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};
