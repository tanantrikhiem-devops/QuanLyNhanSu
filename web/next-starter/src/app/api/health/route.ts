import { connection } from "next/server";

/**
 * Endpoint cho HEALTHCHECK của Docker / orchestrator.
 * Cache Components đang bật nên KHÔNG dùng `export const dynamic` (Next 16 báo lỗi);
 * `connection()` là cách khai báo "chạy lúc request".
 */
export async function GET() {
  await connection();
  return Response.json({ status: "ok", at: new Date().toISOString() });
}
