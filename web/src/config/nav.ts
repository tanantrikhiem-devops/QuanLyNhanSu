import { FileSignature, FolderOpen, Palette, PlayCircle, Workflow } from "lucide-react";

import type { NavGroup } from "@/types/nav";

export const navGroups: NavGroup[] = [
  {
    key: "admin",
    label: "Quản trị",
    items: [
      { key: "workflow-templates", label: "Quy trình mẫu", href: "/", icon: Workflow },
      { key: "cases", label: "Quản lý hồ sơ", href: "/ho-so", icon: FolderOpen, badge: 4 },
      {
        key: "contracts",
        label: "Quản lý hợp đồng",
        href: "/hop-dong",
        icon: FileSignature,
        badge: 3,
      },
      { key: "simulation", label: "Mô phỏng hệ thống", href: "/mo-phong", icon: PlayCircle },
      { key: "appearance", label: "Giao diện & màu sắc", href: "/color-scheme", icon: Palette },
    ],
  },
];
