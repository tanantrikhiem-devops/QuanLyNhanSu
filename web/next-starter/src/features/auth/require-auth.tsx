"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AUTH_ROUTES, REDIRECT_PARAM } from "@/features/auth/routes";
import { useMe } from "@/features/auth/use-auth";
import { toRoute } from "@/lib/nav";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { error } = useMe();
  const router = useRouter();
  const pathname = usePathname();

  const unauthorized = error?.isUnauthorized ?? false;

  useEffect(() => {
    if (!unauthorized) return;
    const target =
      pathname === "/"
        ? AUTH_ROUTES.login
        : `${AUTH_ROUTES.login}?${REDIRECT_PARAM}=${encodeURIComponent(pathname)}`;
    router.replace(toRoute(target));
  }, [unauthorized, pathname, router]);

  return <>{children}</>;
}
