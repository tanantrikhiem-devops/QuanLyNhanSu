import {
  BarChart3,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";

import type { NavGroup } from "@/types/nav";

/**
 * Cấu hình điều hướng mặc định của app.
 */
export const navGroups: NavGroup[] = [
  {
    key: "overview",
    label: "Tổng quan",
    items: [
      { key: "dashboard", label: "Bảng điều khiển", href: "/", icon: LayoutDashboard },
      { key: "reports", label: "Báo cáo", href: "/bao-cao", icon: BarChart3, badge: "Mới" },
    ],
  },
  {
    key: "operation",
    label: "Vận hành",
    items: [
      {
        key: "workflow",
        label: "Quy trình",
        icon: Workflow,
        children: [
          { key: "workflow-list", label: "Danh sách quy trình", href: "/quy-trinh" },
          { key: "workflow-builder", label: "Thiết kế quy trình", href: "/quy-trinh/thiet-ke" },
          { key: "workflow-sla", label: "Cấu hình SLA", href: "/quy-trinh/sla" },
        ],
      },
      { key: "tasks", label: "Công việc", href: "/cong-viec", icon: ClipboardList, badge: 12 },
      { key: "forms", label: "Biểu mẫu", href: "/bieu-mau", icon: FileText },
    ],
  },
  {
    key: "system",
    label: "Hệ thống",
    items: [
      { key: "users", label: "Người dùng", href: "/nguoi-dung", icon: Users },
      { key: "roles", label: "Phân quyền", href: "/phan-quyen", icon: ShieldCheck },
      { key: "settings", label: "Cài đặt", href: "/cai-dat", icon: Settings },
    ],
  },
];
