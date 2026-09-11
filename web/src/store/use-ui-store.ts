"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

type UiState = {
  theme: Theme;
  sidebarOpen: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
};

/** State toàn cục của UI — persist vào localStorage. */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: "light",
      sidebarOpen: true,
      toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    { name: "ui-store", partialize: (s) => ({ theme: s.theme }) },
  ),
);
