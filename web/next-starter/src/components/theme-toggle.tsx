"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/use-ui-store";

export function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Đổi giao diện">
      {theme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
}
