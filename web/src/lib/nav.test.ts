import { describe, expect, it } from "vitest";

import { getNavTrail, getOpenKeys, isNavBranchActive, isNavItemActive } from "@/lib/nav";
import type { NavGroup } from "@/types/nav";

const groups: NavGroup[] = [
  {
    key: "g1",
    items: [
      { key: "home", label: "Trang chủ", href: "/" },
      {
        key: "workflow",
        label: "Quy trình",
        children: [
          { key: "list", label: "Danh sách", href: "/quy-trinh" },
          { key: "sla", label: "SLA", href: "/quy-trinh/sla" },
        ],
      },
    ],
  },
];

describe("isNavItemActive", () => {
  it("chỉ active trang chủ khi đúng '/'", () => {
    expect(isNavItemActive({ key: "h", label: "H", href: "/" }, "/")).toBe(true);
    expect(isNavItemActive({ key: "h", label: "H", href: "/abc" }, "/")).toBe(false);
  });

  it("khớp theo prefix cho route con", () => {
    const item = { key: "w", label: "W", href: "/quy-trinh" };
    expect(isNavItemActive(item, "/quy-trinh/123")).toBe(true);
    expect(isNavItemActive(item, "/quy-trinh-khac")).toBe(false);
  });

  it("bỏ qua dấu / thừa ở cuối", () => {
    expect(isNavItemActive({ key: "w", label: "W", href: "/quy-trinh/" }, "/quy-trinh")).toBe(true);
  });
});

describe("nhánh menu", () => {
  it("cha active khi con active", () => {
    const parent = groups[0]!.items[1]!;
    expect(isNavBranchActive(parent, "/quy-trinh/sla")).toBe(true);
    expect(isNavBranchActive(parent, "/bao-cao")).toBe(false);
  });

  it("mở sẵn nhánh chứa trang hiện tại", () => {
    expect(getOpenKeys(groups, "/quy-trinh/sla")).toEqual(["workflow"]);
    expect(getOpenKeys(groups, "/bao-cao")).toEqual([]);
  });

  it("suy ra breadcrumb từ config", () => {
    expect(getNavTrail(groups, "/quy-trinh/sla").map((i) => i.label)).toEqual(["Quy trình", "SLA"]);
  });
});
