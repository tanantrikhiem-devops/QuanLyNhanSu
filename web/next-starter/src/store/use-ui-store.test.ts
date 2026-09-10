import { beforeEach, describe, expect, it } from "vitest";

import { useUiStore } from "@/store/use-ui-store";

describe("useUiStore", () => {
  beforeEach(() => {
    useUiStore.setState({ theme: "light", sidebarOpen: true });
  });

  it("toggleTheme đổi qua lại light/dark", () => {
    useUiStore.getState().toggleTheme();
    expect(useUiStore.getState().theme).toBe("dark");

    useUiStore.getState().toggleTheme();
    expect(useUiStore.getState().theme).toBe("light");
  });

  it("toggleSidebar đảo trạng thái", () => {
    useUiStore.getState().toggleSidebar();
    expect(useUiStore.getState().sidebarOpen).toBe(false);
  });
});
