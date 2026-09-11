"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  applyThemeToDom,
  type ColorSchemeConfig,
  type ColorSchemeKey,
  defaultThemeConfig,
  type Palette,
  palettes,
  THEME_STORAGE_KEY,
} from "@/lib/theme-presets";

type ThemeStoreState = {
  config: ColorSchemeConfig;
  setPreset: (palette: Palette) => void;
  setColor: (key: ColorSchemeKey, value: string) => void;
  setFont: (fontName: string) => void;
  reset: () => void;
};

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set, get) => ({
      config: defaultThemeConfig,

      setPreset: (palette: Palette) => {
        const nextConfig: ColorSchemeConfig = {
          ...get().config,
          selectedPresetKey: palette.key,
          colors: {
            primary: palette.primary,
            sidebar: palette.sidebar,
            accent: palette.accent,
            background: palette.background,
            card: palette.card,
            foreground: palette.foreground,
          },
        };
        applyThemeToDom(nextConfig.colors, nextConfig.font);
        set({ config: nextConfig });
      },

      setColor: (key: ColorSchemeKey, value: string) => {
        const current = get().config;
        const nextColors = {
          ...current.colors,
          [key]: value,
        };

        // Check if matching an existing preset
        const matchingPreset = palettes.find(
          (p) =>
            p.primary.toLowerCase() === nextColors.primary.toLowerCase() &&
            p.sidebar.toLowerCase() === nextColors.sidebar.toLowerCase() &&
            p.accent.toLowerCase() === nextColors.accent.toLowerCase() &&
            p.background.toLowerCase() === nextColors.background.toLowerCase() &&
            p.card.toLowerCase() === nextColors.card.toLowerCase() &&
            p.foreground.toLowerCase() === nextColors.foreground.toLowerCase(),
        );

        const nextConfig: ColorSchemeConfig = {
          ...current,
          selectedPresetKey: matchingPreset ? matchingPreset.key : "custom",
          colors: nextColors,
        };

        applyThemeToDom(nextConfig.colors, nextConfig.font);
        set({ config: nextConfig });
      },

      setFont: (fontName: string) => {
        const current = get().config;
        const nextConfig: ColorSchemeConfig = {
          ...current,
          font: fontName,
        };
        applyThemeToDom(nextConfig.colors, nextConfig.font);
        set({ config: nextConfig });
      },

      reset: () => {
        applyThemeToDom(defaultThemeConfig.colors, defaultThemeConfig.font);
        set({ config: defaultThemeConfig });
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        if (state?.config) {
          applyThemeToDom(state.config.colors, state.config.font);
        }
      },
    },
  ),
);
