import { beforeEach, describe, expect, it } from "vitest";

import { defaultThemeConfig, palettes } from "@/lib/theme-presets";
import { useThemeStore } from "@/store/use-theme-store";

describe("Theme Color Scheme Store", () => {
  beforeEach(() => {
    useThemeStore.getState().reset();
  });

  it("khởi tạo với cấu hình mặc định (legal-green)", () => {
    const state = useThemeStore.getState();
    expect(state.config.selectedPresetKey).toBe("legal-green");
    expect(state.config.colors.primary).toBe("#0d7748");
    expect(state.config.colors.sidebar).toBe("#0c271d");
  });

  it("chọn bảng màu dựng sẵn office-blue", () => {
    const bluePreset = palettes.find((p) => p.key === "office-blue")!;
    useThemeStore.getState().setPreset(bluePreset);

    const state = useThemeStore.getState();
    expect(state.config.selectedPresetKey).toBe("office-blue");
    expect(state.config.colors.primary).toBe(bluePreset.primary);
    expect(state.config.colors.sidebar).toBe(bluePreset.sidebar);
    expect(state.config.colors.accent).toBe(bluePreset.accent);
  });

  it("tùy chỉnh màu đơn lẻ (sidebar, primary, background, v.v.)", () => {
    useThemeStore.getState().setColor("sidebar", "#112233");
    let state = useThemeStore.getState();
    expect(state.config.colors.sidebar).toBe("#112233");
    expect(state.config.selectedPresetKey).toBe("custom");

    useThemeStore.getState().setColor("primary", "#ff5500");
    state = useThemeStore.getState();
    expect(state.config.colors.primary).toBe("#ff5500");

    useThemeStore.getState().setColor("card", "#fefefe");
    state = useThemeStore.getState();
    expect(state.config.colors.card).toBe("#fefefe");
  });

  it("thay đổi phông chữ hệ thống", () => {
    useThemeStore.getState().setFont("Roboto / Google");
    const state = useThemeStore.getState();
    expect(state.config.font).toBe("Roboto / Google");
  });

  it("khôi phục mặc định reset về legal-green", () => {
    useThemeStore.getState().setColor("primary", "#123456");
    useThemeStore.getState().setFont("Nunito Sans / Thân thiện");
    useThemeStore.getState().reset();

    const state = useThemeStore.getState();
    expect(state.config.selectedPresetKey).toBe(defaultThemeConfig.selectedPresetKey);
    expect(state.config.colors.primary).toBe(defaultThemeConfig.colors.primary);
    expect(state.config.font).toBe(defaultThemeConfig.font);
  });
});
