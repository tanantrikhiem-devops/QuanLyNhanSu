import type { Metadata } from "next";

import { QueryProvider } from "@/components/providers/query-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Next Starter",
  description: "Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui + TanStack Query + Zod + Zustand",
};

/** Đặt class `dark` trước khi paint để không bị nháy sáng khi tải trang. */
const themeScript = `
try {
  var s = localStorage.getItem("ui-store");
  var t = s ? JSON.parse(s).state.theme : null;
  if (!t) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.classList.toggle("dark", t === "dark");
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
