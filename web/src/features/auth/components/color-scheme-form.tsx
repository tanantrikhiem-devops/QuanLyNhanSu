"use client";

import { Check, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  fontFamilies,
  fonts,
  paletteColors,
  palettes,
} from "@/lib/theme-presets";
import { useThemeStore } from "@/store/use-theme-store";

export function ColorSchemeForm() {
  const config = useThemeStore((s) => s.config);
  const setPreset = useThemeStore((s) => s.setPreset);
  const setColor = useThemeStore((s) => s.setColor);
  const setFont = useThemeStore((s) => s.setFont);
  const reset = useThemeStore((s) => s.reset);

  const colors = config.colors;
  const font = config.font;
  const selectedPresetKey = config.selectedPresetKey;

  return (
    <div
      className="color-page"
      style={
        {
          "--scheme-primary": colors.primary,
          "--scheme-bg": colors.background,
          "--scheme-card": colors.card,
          "--scheme-foreground": colors.foreground,
          fontFamily: fontFamilies[font] || font,
        } as React.CSSProperties
      }
    >
      <div className="color-page-heading">
        <div>
          <h1>Giao diện &amp; màu sắc</h1>
          <p>
            Chọn bảng màu dựng sẵn hoặc tùy chỉnh từng màu · áp dụng ngay cho toàn hệ thống và được
            lưu lại
          </p>
        </div>
        <Button variant="outline" onClick={reset} className="gap-2">
          <RotateCcw className="size-4" /> Khôi phục mặc định
        </Button>
      </div>

      <div className="color-layout">
        {/* Cột trái: Bộ điều khiển & Tùy chọn màu */}
        <div className="color-controls-col">
          {/* 1. Bảng màu dựng sẵn */}
          <section className="color-panel preset-panel">
            <PanelHeading
              title="Bảng màu dựng sẵn"
              subtitle="Bấm một bảng màu để áp dụng nhanh cho toàn bộ giao diện."
            />
            <div className="preset-grid">
              {palettes.map((palette) => (
                <button
                  type="button"
                  className={`preset-choice ${selectedPresetKey === palette.key ? "preset-selected" : ""}`}
                  key={palette.key}
                  onClick={() => setPreset(palette)}
                >
                  <span className="preset-swatch">
                    {palette.colors.map((color) => (
                      <i key={color} style={{ backgroundColor: color }} />
                    ))}
                  </span>
                  <strong>{palette.name}</strong>
                </button>
              ))}
            </div>
          </section>

          {/* 2. Phông chữ (Đặt ngay sau Bảng màu để dễ thấy và chọn nhanh) */}
          <section className="color-panel font-panel">
            <PanelHeading
              title="Phông chữ hệ thống"
              subtitle="Chọn kiểu chữ hiển thị cho toàn bộ phần mềm và báo cáo."
            />
            <div className="font-grid">
              {fonts.map((fontName) => (
                <button
                  type="button"
                  key={fontName}
                  onClick={() => setFont(fontName)}
                  className={`font-choice ${font === fontName ? "font-selected" : ""}`}
                  style={{ fontFamily: fontFamilies[fontName] }}
                >
                  <div className="font-choice-top">
                    <span className="font-choice-name">{fontName}</span>
                    {font === fontName ? (
                      <span
                        className="font-check-badge"
                        style={{ backgroundColor: colors.primary, color: "#ffffff" }}
                      >
                        <Check className="size-3.5" />
                      </span>
                    ) : (
                      <span className="font-radio-circle" />
                    )}
                  </div>
                  <span className="font-choice-sample">
                    Tân An · Quản lý hồ sơ vụ việc pháp lý 0123456789
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* 3. Tùy chỉnh chi tiết (Màu chính & Nền/Chữ) */}
          <div className="color-pickers-grid">
            <section className="color-panel custom-panel">
              <PanelHeading
                title="Tùy chỉnh màu chính"
                subtitle="Màu chủ đạo, thanh điều hướng và điểm nhấn."
              />
              <ColorPicker
                label="Màu chủ đạo"
                hint="Nút chính, tab, nhãn nhấn mạnh"
                value={colors.primary}
                onChange={(value) => setColor("primary", value)}
              />
              <ColorPicker
                label="Nền thanh điều hướng"
                hint="Sidebar trái & thanh thương hiệu"
                value={colors.sidebar}
                onChange={(value) => setColor("sidebar", value)}
              />
              <ColorPicker
                label="Màu nhấn phụ"
                hint="Logo, cảnh báo, thông báo"
                value={colors.accent}
                onChange={(value) => setColor("accent", value)}
              />
            </section>

            <section className="color-panel surface-panel">
              <PanelHeading
                title="Nền & chữ"
                subtitle="Nên giữ nền sáng và chữ tối để đảm bảo độ tương phản."
              />
              <ColorField
                label="Nền trang"
                hint="Màu nền phía sau các thẻ"
                value={colors.background}
                onChange={(value) => setColor("background", value)}
              />
              <ColorField
                label="Nền thẻ / bảng"
                hint="Card, hộp thoại, bảng biểu"
                value={colors.card}
                onChange={(value) => setColor("card", value)}
              />
              <ColorField
                label="Màu chữ"
                hint="Chữ chính của toàn hệ thống"
                value={colors.foreground}
                onChange={(value) => setColor("foreground", value)}
              />
            </section>
          </div>
        </div>

        {/* Cột phải: Khung xem trước trực tiếp (Sticky Preview) */}
        <div className="color-preview-col">
          <section className="color-panel preview-panel">
            <div className="preview-panel-header">
              <PanelHeading
                title="Xem trước giao diện"
                subtitle="Trực quan hóa tức thì các thành phần chính khi thay đổi màu sắc."
              />
              <span
                className="preview-status-chip"
                style={{
                  backgroundColor: `color-mix(in srgb, ${colors.primary} 12%, ${colors.card})`,
                  borderColor: `color-mix(in srgb, ${colors.primary} 30%, transparent)`,
                  color: colors.primary,
                }}
              >
                {selectedPresetKey === "custom"
                  ? "Tùy chỉnh riêng"
                  : (palettes.find((p) => p.key === selectedPresetKey)?.name ?? "Mặc định")}
              </span>
            </div>

            <div
              className="preview-box"
              style={{
                backgroundColor: colors.background,
              }}
            >
              {/* Banner */}
              <div
                className="preview-banner"
                style={{ backgroundColor: colors.primary }}
              >
                CÔNG TY CP TÂN AN
                <small>Quy trình tư vấn pháp lý · 5 tầng</small>
              </div>

              {/* Buttons and Active Badges */}
              <div className="preview-controls">
                <button
                  type="button"
                  style={{ backgroundColor: colors.primary }}
                >
                  Nút chính
                </button>
                <button
                  type="button"
                  className="secondary"
                  style={{
                    backgroundColor: colors.card,
                    color: colors.foreground,
                    borderColor: `color-mix(in srgb, ${colors.foreground} 18%, transparent)`,
                  }}
                >
                  Nút phụ
                </button>
                <span
                  style={{
                    color: colors.primary,
                    borderColor: `color-mix(in srgb, ${colors.primary} 40%, transparent)`,
                    backgroundColor: `color-mix(in srgb, ${colors.primary} 8%, ${colors.card})`,
                  }}
                >
                  Lê Thu Hà · Chủ trì
                </span>
              </div>

              {/* Tag Badges */}
              <div className="preview-tags">
                <i style={{ color: colors.foreground, backgroundColor: colors.card }}>Bình thường</i>
                <i>Cao</i>
                <i>Khẩn</i>
                <b>4A</b>
                <b>4B</b>
              </div>

              {/* Card Sample */}
              <div
                className="preview-card-sample"
                style={{
                  backgroundColor: colors.card,
                  borderColor: `color-mix(in srgb, ${colors.foreground} 12%, transparent)`,
                  color: colors.foreground,
                }}
              >
                <div className="preview-card-sample-header">
                  <strong>Hồ sơ vụ việc #HS-2026-089</strong>
                  <span
                    style={{
                      backgroundColor: `color-mix(in srgb, ${colors.primary} 15%, transparent)`,
                      color: colors.primary,
                    }}
                  >
                    Đang xử lý
                  </span>
                </div>
                <p style={{ opacity: 0.8 }}>
                  Tư vấn hợp đồng đầu tư thương mại &middot; Đã hoàn thành thẩm tra sơ bộ.
                </p>
              </div>

              {/* Note / Alert */}
              <div
                className="preview-note"
                style={{
                  borderColor: `color-mix(in srgb, ${colors.primary} 35%, transparent)`,
                  backgroundColor: `color-mix(in srgb, ${colors.primary} 10%, ${colors.card})`,
                  color: colors.foreground,
                }}
              >
                Ghi chú: hồ sơ chưa đạt tiêu chí kiểm soát phải trả lại tầng trước để bổ sung.
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function PanelHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="color-panel-heading">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </header>
  );
}

function Swatches({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="swatch-grid">
      {paletteColors.map((color) => (
        <button
          type="button"
          aria-label={`Chọn màu ${color}`}
          className={value.toLowerCase() === color.toLowerCase() ? "swatch swatch-selected" : "swatch"}
          key={color}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  );
}

function ColorPicker({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="picker-block">
      <div className="picker-label">
        <div>
          <strong>{label}</strong>
          <small>{hint}</small>
        </div>
        <code>{value.toUpperCase()}</code>
        <input
          type="color"
          value={value.startsWith("#") ? value : "#000000"}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      <Swatches value={value} onChange={onChange} />
    </div>
  );
}

function ColorField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="surface-field">
      <div>
        <strong>{label}</strong>
        <small>{hint}</small>
      </div>
      <code>{value.toUpperCase()}</code>
      <input
        type="color"
        value={value.startsWith("#") ? value : "#000000"}
        onChange={(event) => onChange(event.target.value)}
      />
      <Swatches value={value} onChange={onChange} />
    </div>
  );
}
