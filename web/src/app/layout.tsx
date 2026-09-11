import type { Metadata } from "next";

import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Tân An", template: "%s · Tân An" },
  description: "Hệ thống vận hành quy trình 5 tầng — quản lý hồ sơ vụ việc.",
};

const themeInitScript = `
(function() {
  try {
    var raw = localStorage.getItem("app_theme_color_scheme");
    if (!raw) return;
    var parsed = JSON.parse(raw);
    var state = parsed && parsed.state && parsed.state.config;
    if (!state || !state.colors) return;
    var c = state.colors;
    var root = document.documentElement;
    if (c.primary) {
      root.style.setProperty("--primary", c.primary);
      root.style.setProperty("--ring", c.primary);
      root.style.setProperty("--sidebar-primary", c.primary);
      root.style.setProperty("--sidebar-accent", c.primary);
      root.style.setProperty("--scheme-primary", c.primary);
    }
    if (c.sidebar) {
      root.style.setProperty("--sidebar", c.sidebar);
      root.style.setProperty("--color-brand-panel", c.sidebar);
    }
    if (c.accent) {
      root.style.setProperty("--sidebar-ring", c.accent);
      root.style.setProperty("--color-brand-gold", c.accent);
    }
    if (c.background) {
      root.style.setProperty("--background", c.background);
      root.style.setProperty("--scheme-bg", c.background);
    }
    if (c.card) {
      root.style.setProperty("--card", c.card);
      root.style.setProperty("--scheme-card", c.card);
    }
    if (c.foreground) {
      root.style.setProperty("--foreground", c.foreground);
      root.style.setProperty("--card-foreground", c.foreground);
      root.style.setProperty("--scheme-foreground", c.foreground);
    }
    var fonts = {
      "Inter / Hệ thống": "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      "Be Vietnam Pro / Roboto": "'Be Vietnam Pro', 'Roboto', system-ui, sans-serif",
      "Segoe UI / Tahoma": "'Segoe UI', 'Tahoma', system-ui, sans-serif",
      "Nunito Sans / Verdana": "'Nunito Sans', 'Verdana', system-ui, sans-serif"
    };
    if (state.font && fonts[state.font]) {
      root.style.setProperty("--app-font-family", fonts[state.font]);
    }
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
