import { connection } from "next/server";
import { cacheLife, cacheTag } from "next/cache";

export type Stat = {
  label: string;
  value: string;
  delta: string;
  tone: "success" | "warning" | "destructive" | "muted";
};

/**
 * Dữ liệu ĐƯỢC CACHE.
 * `"use cache"` để Next tự sinh cache key; `cacheLife` đặt vòng đời;
 * `cacheTag` để sau này gọi `updateTag("dashboard-stats")` trong Server Action.
 */
export async function getDashboardStats(): Promise<Stat[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("dashboard-stats");

  await new Promise((r) => setTimeout(r, 300)); // giả lập truy vấn

  return [
    { label: "Công việc đang mở", value: "128", delta: "+12%", tone: "success" },
    { label: "Quá hạn SLA", value: "7", delta: "-3", tone: "destructive" },
    { label: "Biểu mẫu chờ duyệt", value: "34", delta: "+5", tone: "warning" },
    { label: "Quy trình đang chạy", value: "19", delta: "0", tone: "muted" },
  ];
}

/**
 * Dữ liệu KHÔNG cache — `connection()` báo cho Next biết phần này phải đợi request thật,
 * nên nó bị đẩy ra khỏi shell tĩnh và stream qua <Suspense>.
 */
export async function getLiveActivity(): Promise<{ at: string; items: string[] }> {
  await connection();
  await new Promise((r) => setTimeout(r, 600));

  return {
    at: new Date().toLocaleTimeString("vi-VN"),
    items: [
      "Nguyễn An gửi biểu mẫu Đề nghị thanh toán",
      "Quy trình Duyệt hợp đồng chuyển sang bước Pháp chế",
      "3 công việc sắp chạm hạn SLA trong 2 giờ tới",
    ],
  };
}
