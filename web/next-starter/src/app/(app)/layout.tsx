import { AppLayoutClient } from "./app-layout-client";

/**
 * Người dùng lấy từ `/users/me` phía client (cookie httpOnly thuộc origin của
 * backend nên server Next không đọc được) — xem `AppLayoutClient`.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppLayoutClient>{children}</AppLayoutClient>;
}
