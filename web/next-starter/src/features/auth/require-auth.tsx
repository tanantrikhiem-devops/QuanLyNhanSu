"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useMe } from "@/features/auth/use-auth";
import { toRoute } from "@/lib/nav";

/**
 * Chốt chặn duy nhất của ứng dụng.
 *
 * Không còn guard phía server: cookie xác thực thuộc về origin của backend nên
 * server Next không đọc được. Ai đã đăng nhập hay chưa, chỉ `/users/me` trả lời
 * được — và câu trả lời đó chỉ có ở phía client.
 *
 * QUAN TRỌNG: component này LUÔN render `children`, kể cả lúc đang tải. Next 16
 * kiểm tra instant navigation và báo `instant-unrendered-segment` nếu layout bỏ
 * qua slot `children`. Chỗ nào cần dữ liệu người dùng thì tự hiện skeleton tại
 * chỗ đó, không chặn cả cây con.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isError } = useMe();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isError) return;
    // Nhớ trang đang xem để đăng nhập xong quay lại đúng chỗ.
    const target = pathname === "/" ? "/dang-nhap" : `/dang-nhap?tiep-tuc=${encodeURIComponent(pathname)}`;
    router.replace(toRoute(target));
  }, [isError, pathname, router]);

  return <>{children}</>;
}
