"use client";

import Link from "next/link";
import { ArrowLeft, Check, CircleAlert, FileCheck2, ShieldCheck } from "lucide-react";
import { useState } from "react";

import type { CaseData } from "./ho-so-form";

type DetailProps = { item: CaseData };

const workflowSteps = [
  "Tiếp nhận yêu cầu và mở mã hồ sơ",
  "Kiểm tra xung đột lợi ích và điều kiện tiếp nhận",
  "Phỏng vấn, lập bảng sự kiện và mục tiêu",
  "Tiếp nhận, số hóa và kiểm kê tài liệu",
];

const documents = [
  "Hợp đồng thuê mặt bằng số 6/12/2024/HĐT",
  "Phụ lục điều chỉnh giá thuê",
  "Công văn 041/CV-ĐH về thông báo chấm dứt",
  "Chứng từ thanh toán tiền cọc",
  "Thư phản hồi và biên bản đối soát",
];

export function HoSoDetailForm({ item }: DetailProps) {
  const [reopenedSteps, setReopenedSteps] = useState<number[]>([]);
  const [consentConfirmed, setConsentConfirmed] = useState(true);
  const [verifiedDocuments, setVerifiedDocuments] = useState<Record<string, boolean>>(
    () => Object.fromEntries(documents.map((document) => [document, true])),
  );
  const verifiedDocumentCount = Object.values(verifiedDocuments).filter(Boolean).length;

  function toggleReopened(stepIndex: number) {
    setReopenedSteps((current) =>
      current.includes(stepIndex)
        ? current.filter((index) => index !== stepIndex)
        : [...current, stepIndex],
    );
  }

  function completeStep(stepIndex: number) {
    setReopenedSteps((current) => current.filter((index) => index !== stepIndex));
  }

  return (
    <div className="case-detail-page">
      <Link href="/ho-so" className="case-back-link"><ArrowLeft /> Danh sách hồ sơ</Link>
      <header className="case-detail-header">
        <div>
          <p className="case-detail-id">{item.id} · {item.received}</p>
          <h1>{item.title}</h1>
          <p>{item.customer} · {item.opposing} · {item.goal}</p>
        </div>
        <div className="case-detail-badges"><span className="status-badge status-green">{item.status}</span><span className="case-protocol">QT-TTDS-01 · Tầng 1 · Bước 1→4</span></div>
      </header>

      <section className="case-metrics">
        <Metric label="GIAI ĐOẠN HIỆN TẠI" value="Xong 4/4" note="Đã đủ điều kiện thẩm định pháp lý" />
        <Metric label="XUNG ĐỘT LỢI ÍCH" value="Không" note="Không phát hiện mối liên quan" good />
        <Metric label="TÀI LIỆU" value={item.documents} note="Đã kiểm kê và số hóa" good />
        <Metric label="THỜI HẠN HỒ SƠ" value="0 bước" note="Đang đúng tiến độ xử lý" />
      </section>

      <div className="case-detail-grid">
        <main className="case-detail-main">
          <DetailSection title="Tiến trình 4 bước · Tầng 1" subtitle="Theo dõi trạng thái xử lý và các mốc kiểm soát của hồ sơ">
            <div className="workflow-list">
              {workflowSteps.map((step, index) => (
                <WorkflowRow
                  key={step}
                  index={index}
                  step={step}
                  reopened={reopenedSteps.includes(index)}
                  onReopen={() => toggleReopened(index)}
                  onComplete={() => completeStep(index)}
                />
              ))}
            </div>
            <div className="approval-row"><ShieldCheck /><div><strong>Tầng 1 đã được phê duyệt</strong><p>10/8/2026 14:32 · Lê Thu Hà · Chuyển hồ sơ sang thẩm định pháp lý</p></div><button type="button" className="approval-action">↻ Duyệt lại</button></div>
            <div className="contract-row"><FileCheck2 /><div><strong>Đã chuyển sang hợp đồng HĐ-2026/041</strong><p>Việc ký hợp đồng dịch vụ được thực hiện sau khi hoàn tất quy trình 4 bước.</p></div><button type="button" className="workflow-action">Mở hợp đồng</button></div>
          </DetailSection>

          <DetailSection title="BM04 · Kiểm kê tài liệu và bằng chứng" subtitle={`Đã kiểm tra chính tả và bảo mật · ${verifiedDocumentCount}/${documents.length} tài liệu đã được số hóa`}>
            <div className="document-list">
              {documents.map((document, index) => (
                <DocumentRow
                  key={document}
                  name={document}
                  primary={index === 0}
                  verified={verifiedDocuments[document] ?? false}
                  onToggle={() => setVerifiedDocuments((current) => ({ ...current, [document]: !current[document] }))}
                />
              ))}
            </div>
            <p className="section-footnote">Đã số hóa {verifiedDocumentCount}/{documents.length} tài liệu · 5 bản gốc được giữ tại hồ sơ.</p>
          </DetailSection>

          <DetailSection title="BM03 · Bảng sự kiện và điểm cần xác minh" subtitle="Các tình tiết quan trọng và cảnh báo kiểm soát hồ sơ">
            <div className="event-list"><Event date="12/12/2024" text="Hai bên ký hợp đồng thuê mặt bằng số 6/12/2024/HĐT, thời hạn 5 năm." warning="Xác minh thẩm quyền người ký và điều khoản phạt." /><Event date="6/5/2026" text="Bên cho thuê đơn phương thông báo tăng giá thuê 35% từ tháng 7/2026." warning="Cần bản gốc công văn và bằng chứng gửi nhận." /><Event date="24/7/2026" text="Khách hàng gửi văn bản phản đối và yêu cầu chấm dứt hợp đồng." /></div>
          </DetailSection>
        </main>

        <aside className="case-detail-side">
          <DetailSection title="BM01 · Phiếu tiếp nhận yêu cầu" subtitle="Thông tin ban đầu được xác minh tại thời điểm tiếp nhận">
            <InfoRow label="HỌ TÊN / TỔ CHỨC" value={item.customer} />
            <InfoRow label="CCCD / MST / ĐC" value="MST 0310xxxx · Đ/c Tân An, TP. Hồ Chí Minh" />
            <InfoRow label="LIÊN HỆ" value="0903 123 456 · contact@minhphat.vn" />
            <InfoRow label="NGUỒN GỐC YÊU CẦU" value="Khách hàng giới thiệu" />
            <InfoRow label="KINH NGHIỆM PHÁP" value="Điện thoại, Email" />
            <InfoRow label="MỨC ĐỘ KHẨN CẤP" value={item.receivedTone} />
            <InfoRow
              label="ĐỒNG Ý XỬ LÝ DỮ LIỆU"
              value={consentConfirmed ? "☑ Đã đồng ý" : "☐ Chưa xác nhận"}
              valueClassName={consentConfirmed ? "info-value-confirmed" : "info-value-unconfirmed"}
            />
            <button
              type="button"
              className="consent-toggle"
              onClick={() => setConsentConfirmed((confirmed) => !confirmed)}
            >
              {consentConfirmed ? "☐ Bỏ xác nhận đồng ý" : "☑ Xác nhận đồng ý"}
            </button>
            <p className="consent-note">Phiếu này chưa hình thành cam kết nhận vụ việc nếu chưa có hợp đồng và phê duyệt.</p>
          </DetailSection>
          <DetailSection title="BM02 · Kiểm tra xung đột lợi ích" subtitle="Tra cứu khách hàng, bên đối diện và người liên quan">
            <div className="conflict-pass"><Check /> Không phát hiện xung đột</div>
            <InfoRow label="KHÁCH HÀNG" value={item.customer} />
            <InfoRow label="BÊN ĐỐI DIỆN" value={item.opposing} />
            <InfoRow label="KẾT LUẬN" value="Không trùng khớp trong dữ liệu đã kiểm tra." />
            <InfoRow label="NGƯỜI PHÊ DUYỆT" value="Lê Nguyễn Hoàng Nam · 10/8/2026" />
          </DetailSection>
        </aside>
      </div>
    </div>
  );
}

function WorkflowRow({
  index,
  step,
  reopened,
  onReopen,
  onComplete,
}: {
  index: number;
  step: string;
  reopened: boolean;
  onReopen: () => void;
  onComplete: () => void;
}) {
  return (
    <div className={`workflow-row ${reopened ? "workflow-row-reopened" : ""}`}>
      <span className="workflow-check"><Check /></span>
      <div>
        <strong>{step}</strong>
        <p>Tầng {index === 2 ? "1 → 2" : "1"} · {reopened ? "Đang mở lại" : "Đã hoàn tất"} · BM0{index + 1}</p>
      </div>
      <span className="workflow-date">Xong 11/8/2026</span>
      {reopened ? (
        <div className="workflow-reopen-actions">
          <span className="workflow-late">Trễ 32 ngày</span>
          <button type="button" className="workflow-complete" onClick={onComplete}>
            <Check /> Hoàn thành
          </button>
        </div>
      ) : (
        <button type="button" className="workflow-action" onClick={onReopen}>
          ↶ Mở lại
        </button>
      )}
      <button type="button" className="workflow-menu" aria-label={`Tùy chọn bước ${index + 1}`}>
        ▾
      </button>
    </div>
  );
}

function DocumentRow({
  name,
  primary,
  verified,
  onToggle,
}: {
  name: string;
  primary: boolean;
  verified: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" className={`document-row ${verified ? "document-row-verified" : "document-row-pending"}`} onClick={onToggle} aria-pressed={verified}>
      <span className={`workflow-check ${verified ? "" : "workflow-check-pending"}`}>{verified ? <Check /> : "○"}</span>
      <span className="document-copy"><strong>{name}</strong><small>10/8/2026 · {verified ? "Đã xác minh · Tài liệu hợp lệ" : "Chưa xác minh · Cần kiểm tra lại"}</small></span>
      <span className="document-state">{primary ? "BẢN CHÍNH" : "Bản sao"}</span>
    </button>
  );
}

function Metric({ label, value, note, good = false }: { label: string; value: string; note: string; good?: boolean }) {
  return <div className="case-metric"><span>{label}</span><strong className={good ? "metric-good" : ""}>{value}</strong><small>{note}</small></div>;
}
function DetailSection({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <section className="detail-section"><header><h2>{title}</h2><p>{subtitle}</p></header>{children}</section>;
}
function InfoRow({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) { return <div className="info-row"><strong>{label}</strong><span className={valueClassName}>{value}</span></div>; }
function Event({ date, text, warning }: { date: string; text: string; warning?: string }) { return <div className="event-row"><time>{date}</time><div><strong>{text}</strong>{warning && <p><CircleAlert /> {warning}</p>}</div></div>; }
