export type Palette = {
  key: string;
  name: string;
  colors: string[];
  primary: string;
  sidebar: string;
  accent: string;
  background: string;
  card: string;
  foreground: string;
};

export type ColorSchemeKey = "primary" | "sidebar" | "accent" | "background" | "card" | "foreground";

export type ColorSchemeConfig = {
  selectedPresetKey: string;
  colors: {
    primary: string;
    sidebar: string;
    accent: string;
    background: string;
    card: string;
    foreground: string;
  };
  font: string;
};

export const paletteColors: string[] = [
  "#087344", "#13804a", "#147c7b", "#117f99", "#2454d8", "#3e7ee8", "#4138bd", "#7025d3", "#a51db4", "#bf1760", "#a90d36", "#bf1d18", "#c3470c", "#a95006", "#8e390d",
  "#d39a08", "#e6aa35", "#f0b900", "#364152", "#111827", "#102c22", "#121a2f", "#201533", "#312115", "#ffffff", "#f7f8f8", "#edf0f2", "#e3e6e9", "#dddfe2", "#d4d9dc", "#cbd1d5", "#15231d",
];

export const palettes: Palette[] = [
  {
    key: "legal-green",
    name: "Xanh lá pháp lý",
    colors: ["#0d7748", "#0c271d", "#e6ad2e"],
    primary: "#0d7748",
    sidebar: "#0c271d",
    accent: "#e6ad2e",
    background: "#f5f6f5",
    card: "#ffffff",
    foreground: "#15231d",
  },
  {
    key: "office-blue",
    name: "Xanh dương công sở",
    colors: ["#2454d8", "#121a2f", "#3e7ee8"],
    primary: "#2454d8",
    sidebar: "#121a2f",
    accent: "#3e7ee8",
    background: "#f4f6fa",
    card: "#ffffff",
    foreground: "#17233d",
  },
  {
    key: "jade",
    name: "Xanh ngọc",
    colors: ["#147c7b", "#0d3a38", "#e6aa35"],
    primary: "#147c7b",
    sidebar: "#0d3a38",
    accent: "#e6aa35",
    background: "#f3f8f7",
    card: "#ffffff",
    foreground: "#173331",
  },
  {
    key: "modern-purple",
    name: "Tím hiện đại",
    colors: ["#7025d3", "#201533", "#a51db4"],
    primary: "#7025d3",
    sidebar: "#201533",
    accent: "#a51db4",
    background: "#f6f4fa",
    card: "#ffffff",
    foreground: "#241a36",
  },
  {
    key: "red",
    name: "Đỏ đô",
    colors: ["#a90d36", "#2d0b14", "#e6aa35"],
    primary: "#a90d36",
    sidebar: "#2d0b14",
    accent: "#e6aa35",
    background: "#faf5f6",
    card: "#ffffff",
    foreground: "#371520",
  },
  {
    key: "classic-brown",
    name: "Nâu vàng cổ điển",
    colors: ["#a95006", "#312115", "#e6aa35"],
    primary: "#a95006",
    sidebar: "#312115",
    accent: "#e6aa35",
    background: "#faf7f1",
    card: "#ffffff",
    foreground: "#33291f",
  },
  {
    key: "minimal-black",
    name: "Xám đen tối giản",
    colors: ["#111827", "#1f2937", "#cbd1d5"],
    primary: "#111827",
    sidebar: "#111827",
    accent: "#f0b900",
    background: "#f5f6f7",
    card: "#ffffff",
    foreground: "#111827",
  },
  {
    key: "dynamic-orange",
    name: "Cam năng động",
    colors: ["#c3470c", "#321e14", "#f0b900"],
    primary: "#c3470c",
    sidebar: "#321e14",
    accent: "#f0b900",
    background: "#fff8f2",
    card: "#ffffff",
    foreground: "#321e14",
  },
];

export const fonts = [
  "Inter / Hệ thống",
  "Be Vietnam Pro / Roboto",
  "Segoe UI / Tahoma",
  "Nunito Sans / Verdana",
];

export const fontFamilies: Record<string, string> = {
  "Inter / Hệ thống": "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "Be Vietnam Pro / Roboto": "'Be Vietnam Pro', 'Roboto', system-ui, sans-serif",
  "Segoe UI / Tahoma": "'Segoe UI', 'Tahoma', system-ui, sans-serif",
  "Nunito Sans / Verdana": "'Nunito Sans', 'Verdana', system-ui, sans-serif",
};

export const defaultThemeConfig: ColorSchemeConfig = {
  selectedPresetKey: palettes[0]!.key,
  colors: {
    primary: palettes[0]!.primary,
    sidebar: palettes[0]!.sidebar,
    accent: palettes[0]!.accent,
    background: palettes[0]!.background,
    card: palettes[0]!.card,
    foreground: palettes[0]!.foreground,
  },
  font: fonts[0]!,
};

export const THEME_STORAGE_KEY = "app_theme_color_scheme";

export function applyThemeToDom(colors: ColorSchemeConfig["colors"], fontName: string) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--ring", colors.primary);
  root.style.setProperty("--sidebar-primary", colors.primary);
  root.style.setProperty("--sidebar-accent", colors.primary);
  root.style.setProperty("--scheme-primary", colors.primary);

  root.style.setProperty("--sidebar", colors.sidebar);
  root.style.setProperty("--color-brand-panel", colors.sidebar);

  root.style.setProperty("--sidebar-ring", colors.accent);
  root.style.setProperty("--color-brand-gold", colors.accent);

  root.style.setProperty("--background", colors.background);
  root.style.setProperty("--scheme-bg", colors.background);

  root.style.setProperty("--card", colors.card);
  root.style.setProperty("--scheme-card", colors.card);

  root.style.setProperty("--foreground", colors.foreground);
  root.style.setProperty("--card-foreground", colors.foreground);
  root.style.setProperty("--scheme-foreground", colors.foreground);

  const ff = fontFamilies[fontName] || fontFamilies[fonts[0]!]!;
  root.style.setProperty("--app-font-family", ff);
}
