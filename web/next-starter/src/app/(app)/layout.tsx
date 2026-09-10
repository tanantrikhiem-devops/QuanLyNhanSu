import type { UserMenuUser } from "@/components/layout";

import { AppLayoutClient } from "./app-layout-client";

/** Server Component: nơi lấy dữ liệu người dùng (session, DB…) rồi đưa xuống shell. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const user: UserMenuUser = {
    name: "Phan Thành Long",
    email: "long.thanhphan04@gmail.com",
    role: "Quản trị viên",
  };

  return <AppLayoutClient user={user}>{children}</AppLayoutClient>;
}
