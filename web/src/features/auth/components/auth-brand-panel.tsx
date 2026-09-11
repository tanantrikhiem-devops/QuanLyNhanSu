const PROCESS_STEPS = [
  "TIẾP NHẬN VÀ SÀNG LỌC HỒ SƠ",
  "THẨM TRA SỰ KIỆN VÀ CHỨNG CỨ",
  "PHÂN TÍCH PHÁP LÝ VÀ PHƯƠNG ÁN",
  "PHÊ DUYỆT VÀ TRIỂN KHAI",
  "GIÁM SÁT, NGHIỆM THU, LƯU TRỮ",
];

export function AuthBrandPanel() {
  return (
    <section className="bg-brand-panel flex min-h-0 w-full flex-col justify-between px-5 py-8 text-white sm:px-10 sm:py-10 lg:min-h-screen lg:w-[37%] lg:px-12 lg:py-12">
      <div>
        <div className="flex items-center gap-3">
          <div className="bg-brand-gold text-brand-ink flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold">
            TA
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-wide">TÂN AN</p>
            <p className="text-brand-panel-text mt-0.5 text-[8px]">Quản lý hồ sơ vụ việc</p>
          </div>
        </div>

        <div className="mt-8 max-w-[330px] lg:mt-14">
          <h1 className="text-lg leading-tight font-bold sm:text-2xl">
            Hệ thống vận hành quy trình 5 tầng
          </h1>
          <p className="text-brand-panel-text mt-4 text-[10px] leading-relaxed">
            Tiếp nhận · Thẩm tra · Phân tích · Phê duyệt · Giám sát. Mỗi tầng có cơ chế kiểm soát
            riêng, không đạt thì trả lại tầng trước.
          </p>
        </div>

        <ol className="mt-4 grid max-w-[330px] grid-cols-1 gap-1.5 sm:grid-cols-2 lg:flex lg:flex-col">
          {PROCESS_STEPS.map((step, index) => (
            <li
              key={step}
              className="bg-brand-panel-item flex min-h-7 items-center gap-2 rounded-md px-2 text-[9px] font-medium text-white/95"
            >
              <span className="bg-brand-gold text-brand-ink flex h-4 w-3.5 shrink-0 items-center justify-center rounded-sm text-[9px] font-bold">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <p className="text-brand-panel-subtle mt-6 text-[8px] lg:mt-8">Phiên bản demo · 2026</p>
    </section>
  );
}
