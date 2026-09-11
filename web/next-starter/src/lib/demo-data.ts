import { cacheLife, cacheTag } from "next/cache";

import type { WorkflowTemplate } from "@/lib/api/contracts";

export async function getWorkflowTemplates(): Promise<WorkflowTemplate[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("workflow-templates");

  await new Promise((r) => setTimeout(r, 300));

  return [
    {
      id: 1,
      code: "QT-PL-01",
      name: "Quy trình tư vấn pháp lý",
      description: "Áp dụng cho hồ sơ tư vấn, thương lượng và tranh tụng của khách hàng doanh nghiệp.",
      icon: "legal",
      status: "active",
      locked: true,
      stage_count: 5,
      task_count: 3,
      owner_name: "LS. Nguyễn Hoàng Nam",
      updated_at: "2026-08-26",
    },
    {
      id: 2,
      code: "QT-TN-02",
      name: "Quy trình toà nhà",
      description: "Hồ sơ pháp lý dự án toà nhà, căn hộ: thẩm định, cấp phép và bàn giao.",
      icon: "building",
      status: "draft",
      locked: false,
      stage_count: 0,
      task_count: 0,
      owner_name: "LS. Phạm Thu Hương",
      updated_at: "2026-08-12",
    },
    {
      id: 3,
      code: "QT-NĐ-03",
      name: "Quy trình nhà đất",
      description: "Chuyển nhượng, tách thửa, cấp giấy chứng nhận quyền sử dụng đất.",
      icon: "land",
      status: "draft",
      locked: false,
      stage_count: 0,
      task_count: 0,
      owner_name: "LS. Trần Minh Khoa",
      updated_at: "2026-08-03",
    },
  ];
}
