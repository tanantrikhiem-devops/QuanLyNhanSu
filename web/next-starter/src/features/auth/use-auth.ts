"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getMe, login, logout } from "@/features/auth/api";
import { ApiError } from "@/lib/api/errors";
import { toRoute } from "@/lib/nav";
import type { LoginInput, User } from "@/schemas/auth";

/** Key tập trung một chỗ để invalidate không bị lệch chuỗi. */
export const authKeys = {
  me: ["auth", "me"] as const,
};

/**
 * Người dùng hiện tại. `apiFetch` đã lo khôi phục phiên bằng `refresh_token`,
 * nên hook này chỉ cần quan tâm tới dữ liệu.
 */
export function useMe() {
  return useQuery<User, ApiError>({
    queryKey: authKeys.me,
    queryFn: getMe,
    // 401 là câu trả lời hợp lệ ("chưa đăng nhập"), thử lại chỉ tổ chậm.
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useLogin(redirectTo = "/") {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<User, ApiError, LoginInput>({
    mutationFn: login,
    onSuccess: (user) => {
      // Ghi thẳng vào cache để trang đích không phải gọi lại `/users/me`.
      queryClient.setQueryData(authKeys.me, user);
      router.replace(toRoute(redirectTo));
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<void, ApiError>({
    mutationFn: logout,
    // Dù backend lỗi thì phía client vẫn phải coi như đã đăng xuất.
    onSettled: () => {
      queryClient.clear();
      router.replace("/dang-nhap");
    },
  });
}
