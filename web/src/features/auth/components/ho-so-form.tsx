import { AlertTriangle, Check, CircleAlert, FolderOpen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export type CaseData = {
	id: string;
	title: string;
	status: string;
	statusTone: "green" | "muted" | "red";
	risk?: string;
	customer: string;
	opposing: string;
	goal: string;
	received: string;
	receivedTone: string;
	progress: number;
	progressLabel: string;
	documents: string;
	alerts: string[];
	note?: string;
	eventCount: number;
};

export const cases: CaseData[] = [
	{ id: "HS-DS-2026-0041", title: "Tranh chấp hợp đồng thuê mặt bằng — Công ty Minh Phát", status: "S3  Đang thẩm định pháp lý", statusTone: "green", customer: "Công ty TNHH Minh Phát", opposing: "Công ty CP Đại Hưng · Ông Lê Văn Đại (người ký hợp đồng)", goal: "Chấm dứt hợp đồng thuê, đòi lại tiền cọc 450.000.000 đ và bồi thường thiệt hại.", received: "10/8/2026 · Lê Thu Hà", receivedTone: "Thông thường", progress: 100, progressLabel: "Đã xong Bước 4 — sẵn sàng thẩm định", documents: "5/5 tài liệu đã số hóa", alerts: ["Không phát hiện xung đột", "Đã chuyển sang hợp đồng HĐ-2026/041"], eventCount: 3 },
	{ id: "HS-DS-2026-0052", title: "Đòi nợ theo hợp đồng cung cấp vật tư — Công ty Trường Sơn", status: "S2  Đang thu thập hồ sơ", statusTone: "muted", customer: "Công ty CP Đầu tư Hạ tầng Tân An", opposing: "Công ty TNHH Trường Sơn · Ông Nguyễn Trường Sơn", goal: "Thu hồi công nợ 1,86 tỷ đồng và lãi chậm trả theo hợp đồng cung cấp vật tư.", received: "18/8/2026 · Ngô Bảo Trâm", receivedTone: "Phức tạp", progress: 75, progressLabel: "Bước 4/4 · Tiếp nhận, số hóa và kiểm kê tài liệu", documents: "2/4 tài liệu đã số hóa", alerts: ["Có thể xử lý bằng biện pháp cách ly / chấp thuận hợp lệ", "Bước 4 ‘Tiếp nhận, số hóa và kiểm kê tài liệu’ trễ 20 ngày (hạn 22/8/2026 · Trong ngày nhận)"], note: "Còn 2 tài liệu chưa số hóa: Biên bản nghiệm thu đợt cuối; Hóa đơn GTGT các đợt giao hàng", eventCount: 2 },
	{ id: "HS-DS-2026-0058", title: "Tranh chấp ranh giới thửa đất — hộ ông Trần Văn Bảy", status: "S1  Chờ kiểm tra xung đột", statusTone: "muted", risk: "RỦI RO CAO", customer: "Ông Trần Văn Bảy", opposing: "Bà Nguyễn Thị Hồng (hộ liền kề) · UBND xã Long Thọ (bên liên quan)", goal: "Yêu cầu xác định lại ranh giới và buộc tháo dỡ phần công trình lấn chiếm 42 m².", received: "24/8/2026 · Lê Thu Hà", receivedTone: "Khẩn cấp", progress: 25, progressLabel: "Bước 2/4 · Kiểm tra xung đột lợi ích và điều kiện tiếp nhận", documents: "0/1 tài liệu đã số hóa", alerts: ["Bước 2 ‘Kiểm tra xung đột lợi ích và điều kiện tiếp nhận’ trễ 16 ngày (hạn 26/8/2026 · Trong ngày)", "Chưa kiểm tra xung đột lợi ích — không được tư vấn kết luận hoặc nhận vụ việc."], eventCount: 1 },
	{ id: "HS-DS-2026-0060", title: "Yêu cầu tư vấn chia tài sản chung sau ly hôn", status: "S0  Yêu cầu mới", statusTone: "muted", customer: "Bà Đỗ Thanh Vy", opposing: "Ông Huỳnh Quốc Đạt (chồng cũ)", goal: "Tư vấn phương án chia tài sản chung là căn nhà và phần vốn góp doanh nghiệp.", received: "26/8/2026 · Ngô Bảo Trâm", receivedTone: "Chưa đủ điều kiện", progress: 0, progressLabel: "Bước 1/4 · Tiếp nhận yêu cầu và mở mã hồ sơ", documents: "0/0 tài liệu đã số hóa", alerts: ["Bước 1 ‘Tiếp nhận yêu cầu và mở mã hồ sơ’ trễ 15 ngày (hạn 27/8/2026 · Trong 04 giờ làm việc)", "Chưa kiểm tra xung đột lợi ích — không được tư vấn kết luận hoặc nhận vụ việc."], eventCount: 0 },
];

function Detail({ label, value, chip }: { label: string; value: string; chip?: string }) {
	return <div className="detail-row"><span className="detail-label">{label}</span><span className="detail-value">{value}{chip && <small>{chip}</small>}</span></div>;
}

function CaseCard({ item }: { item: CaseData }) {
	const completedSegments = Math.ceil(item.progress / 25);
	return <Link href={`/ho-so-detail?id=${encodeURIComponent(item.id)}`} className="block"><article className={`case-card case-card-${item.statusTone}`}><div className="flex items-start justify-between gap-2"><span className="text-brand text-[10px] font-semibold tracking-[0.08em]">{item.id}</span><div className="flex flex-wrap justify-end gap-1.5">{item.risk && <span className="risk-badge"><AlertTriangle /> {item.risk}</span>}<span className={`status-badge status-${item.statusTone}`}>{item.status}</span></div></div><h2 className="mt-3 text-[15px] leading-5 font-bold text-[#15231d]">{item.title}</h2><div className="details-table mt-3"><Detail label="KHÁCH HÀNG" value={item.customer} /><Detail label="ĐỐI PHƯƠNG" value={item.opposing} /><Detail label="MỤC TIÊU" value={item.goal} /><Detail label="TIẾP NHẬN" value={item.received} chip={item.receivedTone} /></div><div className="mt-3"><div className="flex items-center justify-between gap-2 text-[10px]"><span className="font-bold tracking-[0.08em] text-[#52615a]">TIẾN ĐỘ 4 BƯỚC</span><span className="truncate text-[#86918c]">{item.progressLabel}</span></div><div className="mt-1.5 flex gap-1">{[0, 1, 2, 3].map((segment) => <span key={segment} className={`progress-segment ${segment < completedSegments ? (item.progress < 50 && segment === 0 ? "progress-red" : "progress-green") : "progress-empty"}`} />)}</div><div className="mt-1 text-[10px] text-[#718078]">{item.progress}% hoàn thành</div></div><div className="mt-3 border-t border-[#dfe5e1] pt-2.5"><div className="flex flex-wrap gap-1.5">{item.alerts.slice(0, item.id === "HS-DS-2026-0041" ? 2 : 1).map((alert, index) => <span key={alert} className={`mini-alert ${index === 0 && item.progress < 100 ? "mini-alert-warning" : "mini-alert-success"}`}>{index === 0 && item.progress < 100 ? <CircleAlert /> : <Check />}{alert}</span>)}</div>{item.note && <div className="mini-alert mini-alert-info mt-1.5"><FolderOpen /> {item.note}</div>}{item.alerts.length > (item.id === "HS-DS-2026-0041" ? 2 : 1) && <div className="mini-alert mini-alert-danger mt-1.5"><CircleAlert /> {item.alerts[1]}</div>}<div className="mt-1.5 flex items-center justify-between text-[10px] text-[#7b8982]"><span>Bảng sự kiện <strong className="text-[#52615a]">{item.eventCount} mốc</strong></span>{item.eventCount > 0 && <Button variant="outline" size="sm" className="h-5 rounded-full px-2 text-[10px]">+{item.eventCount > 1 ? 1 : 2} cảnh báo khác</Button>}</div></div><span className="mt-2 inline-flex text-xs font-semibold text-[#087644]">Mở hồ sơ →</span></article></Link>;
}

export function HoSoForm() {
	return <div className="case-page"><div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-xl font-bold tracking-tight text-[#15231d]">Quản lý hồ sơ</h1><p className="mt-1 text-[11px] text-[#86918c]">Hồ sơ vụ án dân sự — QT-TTDS-01 · Bước 1 đến Bước 4 do Tầng 1 chủ trì. Hồ sơ đủ điều kiện mới chuyển sang ký hợp đồng dịch vụ.</p></div><Button variant="outline" className="h-8 border-[#9cc9ae] bg-[#eff8f2] px-3 text-xs font-semibold text-[#087644] hover:bg-[#e2f3e8]"><FolderOpen /> 3 hồ sơ đang mở</Button></div><div className="case-grid mt-3">{cases.map((item) => <CaseCard key={item.id} item={item} />)}</div></div>;
}
