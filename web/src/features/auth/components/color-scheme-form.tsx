"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
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
          fontFamily: font.split(" /")[0],
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
        <Button variant="outline" onClick={reset}>
          <RotateCcw /> Khôi phục mặc định
        </Button>
      </div>

      <div className="color-layout">
        <section className="color-panel preset-panel">
          <PanelHeading
            title="Bảng màu dựng sẵn"
            subtitle="Bấm một bảng màu để áp dụng cho toàn bộ giao diện."
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

        <section className="color-panel custom-panel">
          <PanelHeading
            title="Tùy chỉnh từng màu"
            subtitle="Chọn từ danh sách màu bên dưới hoặc mở bảng chọn màu để lấy mã bất kỳ."
          />
          <ColorPicker
            label="Màu chủ đạo"
            hint="Nút chính, tab, nhãn nhấn mạnh"
            value={colors.primary}
            onChange={(value) => setColor("primary", value)}
          />
          <ColorPicker
            label="Nền thanh điều hướng"
            hint="Sidebar trái"
            value={colors.sidebar}
            onChange={(value) => setColor("sidebar", value)}
          />
          <ColorPicker
            label="Màu nhấn phụ"
            hint="Logo, cảnh báo, ghi chú"
            value={colors.accent}
            onChange={(value) => setColor("accent", value)}
          />
        </section>

        <section className="color-panel surface-panel">
          <PanelHeading
            title="Nền & chữ"
            subtitle="Nên giữ nền sáng và chữ tối để đảm bảo dễ đọc."
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

        <section className="color-panel font-panel">
          <PanelHeading
            title="Phông chữ"
            subtitle="Toàn bộ hệ thống dùng phông sans-serif."
          />
          {fonts.map((fontName) => (
            <button
              type="button"
              key={fontName}
              onClick={() => setFont(fontName)}
              className={`font-choice ${font === fontName ? "font-selected" : ""}`}
            >
              <strong>{fontName}</strong>
              <span>Sơ đồ làm việc tư vấn pháp lý 5 tầng — 0123456789</span>
            </button>
          ))}
        </section>

        <section className="color-panel preview-panel">
          <PanelHeading
            title="Xem trước"
            subtitle="Các thành phần chính với bảng màu hiện tại."
          />
          <div className="preview-box">
            <div
              className="preview-banner"
              style={{ backgroundColor: colors.primary }}
            >
              CÔNG TY CP TÂN AN
              <small>Quy trình tư vấn pháp lý · 5 tầng</small>
            </div>
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
                }}
              >
                Nút phụ
              </button>
              <span
                style={{
                  color: colors.primary,
                  borderColor: `color-mix(in srgb, ${colors.primary} 45%, white)`,
                }}
              >
                Lê Thu Hà · Chủ trì
              </span>
            </div>
            <div className="preview-tags">
              <i style={{ color: colors.foreground }}>Bình thường</i>
              <i>Cao</i>
              <i>Khẩn</i>
              <b>4A</b>
              <b>4B</b>
            </div>
            <div
              className="preview-note"
              style={{
                borderColor: `color-mix(in srgb, ${colors.primary} 38%, white)`,
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
