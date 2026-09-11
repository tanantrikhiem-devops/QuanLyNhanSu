"use client";

import * as React from "react";

import { useIsDesktop } from "@/hooks/use-media-query";
import { usePersistedFlag } from "@/hooks/use-persisted-flag";

const STORAGE_KEY = "sidebar:collapsed";

type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggleCollapsed: () => void;
  /** Drawer ở mobile/tablet. */
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  isDesktop: boolean;
  /** `true` khi sidebar đang hiển thị ở dạng dải icon. */
  isIconOnly: boolean;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar phải được dùng bên trong <SidebarProvider>");
  return ctx;
}

export type SidebarProviderProps = {
  children: React.ReactNode;
  /** Trạng thái thu gọn ban đầu khi chưa có giá trị lưu trong localStorage. */
  defaultCollapsed?: boolean;
  /** Tắt việc ghi nhớ trạng thái thu gọn. */
  persist?: boolean;
};

export function SidebarProvider({
  children,
  defaultCollapsed = false,
  persist = true,
}: SidebarProviderProps) {
  const isDesktop = useIsDesktop();
  const [collapsed, setCollapsed] = usePersistedFlag(STORAGE_KEY, defaultCollapsed, persist);
  const [mobileRequested, setMobileOpen] = React.useState(false);

  // Suy ra thay vì reset bằng effect: lên desktop là drawer tự coi như đóng.
  const mobileOpen = mobileRequested && !isDesktop;

  const toggleCollapsed = React.useCallback(
    () => setCollapsed(!collapsed),
    [collapsed, setCollapsed],
  );

  // Ctrl/Cmd + B. `useEffectEvent` (React 19.2) tách logic không-reactive ra khỏi
  // effect, nhờ vậy listener chỉ gắn/gỡ một lần thay vì mỗi lần state đổi.
  const onShortcut = React.useEffectEvent(() => {
    if (isDesktop) setCollapsed(!collapsed);
    else setMobileOpen(!mobileOpen);
  });

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onShortcut();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = React.useMemo<SidebarContextValue>(
    () => ({
      collapsed,
      setCollapsed,
      toggleCollapsed,
      mobileOpen,
      setMobileOpen,
      isDesktop,
      isIconOnly: isDesktop && collapsed,
    }),
    [collapsed, setCollapsed, toggleCollapsed, mobileOpen, isDesktop],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
