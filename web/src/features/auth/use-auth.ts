"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  changePassword,
  getMe,
  login,
  logout,
  register,
  requestPasswordReset,
  resetPassword,
} from "@/features/auth/api";
import { AUTH_ROUTES } from "@/features/auth/routes";
import { ApiError } from "@/lib/api/errors";
import { toRoute } from "@/lib/nav";
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  User,
} from "@/lib/api/contracts";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export function useMe() {
  return useQuery<User, ApiError>({
    queryKey: authKeys.me,
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useLogin(redirectTo = "/") {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<User, ApiError, LoginRequest>({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me, user);
      router.replace(toRoute(redirectTo));
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation<User, ApiError, RegisterRequest>({
    mutationFn: register,
    onSuccess: () => router.replace(AUTH_ROUTES.login),
  });
}

export function useForgotPassword() {
  return useMutation<string | null, ApiError, ForgotPasswordRequest>({
    mutationFn: requestPasswordReset,
  });
}

export function useResetPassword() {
  return useMutation<string | null, ApiError, ResetPasswordRequest>({
    mutationFn: resetPassword,
  });
}

export function useChangePassword() {
  const router = useRouter();

  return useMutation<string | null, ApiError, ChangePasswordRequest>({
    mutationFn: changePassword,
    onSuccess: () => router.replace("/"),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<void, ApiError>({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      router.replace(AUTH_ROUTES.login);
    },
  });
}
