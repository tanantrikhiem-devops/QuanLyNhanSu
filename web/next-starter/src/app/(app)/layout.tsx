import { AppLayoutClient } from "./app-layout-client";

/**
 * Người dùng đến từ `/users/me` phía client (access token nằm trong RAM của
 * browser nên server không đọc được) — xem `AppLayoutClient`.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppLayoutClient>{children}</AppLayoutClient>;
}
