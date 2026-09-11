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
      "Inter / Hiện đại": "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      "Roboto / Google": "'Roboto', Arial, sans-serif",
      "Be Vietnam Pro / Chuẩn Việt": "'Be Vietnam Pro', sans-serif",
      "Nunito Sans / Thân thiện": "'Nunito Sans', sans-serif",
      "Inter / Hệ thống": "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      "Be Vietnam Pro / Roboto": "'Be Vietnam Pro', sans-serif",
      "Segoe UI / Tahoma": "'Segoe UI', 'Tahoma', sans-serif",
      "Nunito Sans / Verdana": "'Nunito Sans', sans-serif"
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,600;0,6..12,700;0,6..12,800;1,6..12,400&family=Roboto:ital,wght@0,400;0,500;0,700;0,900;1,400&display=swap"
          rel="stylesheet"
        />
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
