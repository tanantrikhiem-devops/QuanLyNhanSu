"use client";

import * as React from "react";

import { applyThemeToDom } from "@/lib/theme-presets";
import { useThemeStore } from "@/store/use-theme-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const config = useThemeStore((s) => s.config);

  React.useEffect(() => {
    applyThemeToDom(config.colors, config.font);
  }, [config]);

  return <>{children}</>;
}
