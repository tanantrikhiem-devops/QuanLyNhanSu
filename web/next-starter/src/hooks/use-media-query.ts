"use client";

import { useEffect, useState } from "react";

/**
 * Theo dõi một media query. Trả về `false` ở lần render đầu trên server
 * để tránh hydration mismatch.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => setMatches(e.matches);

    onChange(mql);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Breakpoint `lg` của Tailwind (1024px) — mốc chuyển giữa drawer và sidebar cố định. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}
