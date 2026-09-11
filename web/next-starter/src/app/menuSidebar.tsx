"use client";

import {
	Bell,
	BookOpen,
	BriefcaseBusiness,
	Building2,
	ChartNoAxesColumn,
	ChevronsLeft,
	ChevronsRight,
	ChevronRight,
	ClipboardCheck,
	FileText,
	FolderKanban,
	LayoutDashboard,
	LockKeyhole,
	Settings2,
	ShieldCheck,
	Users,
} from "lucide-react";
import { useState } from "react";

type MenuItem = {
	label: string;
	icon: typeof LayoutDashboard;
	count?: number;
};

const groups: { label: string; items: MenuItem[] }[] = [
	{
		label: "CÁ NHÂN",
		items: [
			{ label: "Bảng làm việc", icon: LayoutDashboard },
			{ label: "Việc của tôi", icon: FolderKanban, count: 5 },
			{ label: "Thông báo", icon: Bell, count: 11 },
		],
	},
	{
		label: "NGHIỆP VỤ",
		items: [
			{ label: "Quy trình mẫu", icon: ClipboardCheck },
			{ label: "Quản lý hồ sơ", icon: FileText, count: 4 },
			{ label: "Quản lý hợp đồng", icon: BriefcaseBusiness, count: 3 },
			{ label: "Mô phòng hệ thống", icon: BookOpen },
		],
	},
	{
		label: "NHÂN SỰ",
		items: [
			{ label: "Danh bạ nhân sự", icon: Users },
			{ label: "Sơ đồ tổ chức", icon: Building2 },
			{ label: "Phân công & tái việc", icon: ShieldCheck },
		],
	},
	{
		label: "HỆ THỐNG",
		items: [
			{ label: "Vai trò & quyền", icon: LockKeyhole },
			{ label: "Yêu cầu chờ duyệt", icon: ClipboardCheck, count: 2 },
			{ label: "Nhật ký hoạt động", icon: ChartNoAxesColumn },
			{ label: "Báo cáo SLA", icon: ChartNoAxesColumn },
			{ label: "Giao diện & màu sắc", icon: Settings2 },
		],
	},
];

export default function MenuSidebar({ onCollapsedChange }: { onCollapsedChange?: (collapsed: boolean) => void }) {
	const [isCollapsed, setIsCollapsed] = useState(false);

	function toggleCollapsed() {
		const next = !isCollapsed;
		setIsCollapsed(next);
		onCollapsedChange?.(next);
	}

	return (
		<aside className={`relative w-full shrink-0 bg-[#09251b] text-white lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:flex-col lg:transition-[width] lg:duration-200 ${isCollapsed ? "lg:w-[56px]" : "lg:w-[146px]"}`}>
			<div className="flex items-center gap-2 px-3 py-3">
				<div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#e6ad2e] text-[8px] font-bold text-[#183126]">
					TA
				</div>
				<div className={`min-w-0 ${isCollapsed ? "lg:hidden" : ""}`}>
					<p className="truncate text-[9px] font-bold">TÂN AN</p>
					<p className="truncate text-[6px] text-[#9cafA6]">Quản lý hồ sơ vụ việc</p>
				</div>
			</div>
			<button
				aria-label={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
				className="absolute right-[-10px] top-1/2 hidden size-5 -translate-y-1/2 items-center justify-center rounded-full border border-[#285344] bg-[#0d7748] text-white shadow-md hover:bg-[#14935c] lg:flex"
				onClick={toggleCollapsed}
				type="button"
			>
				{isCollapsed ? <ChevronsRight className="size-3" /> : <ChevronsLeft className="size-3" />}
			</button>

			<nav className="flex gap-4 overflow-x-auto px-2 pb-3 lg:block lg:flex-1 lg:overflow-y-auto lg:px-1.5">
				{groups.map((group) => (
					<div className={`min-w-[170px] lg:mb-3 lg:min-w-0 ${isCollapsed ? "lg:min-w-0" : ""}`} key={group.label}>
						<p className={`mb-1 px-2 text-[7px] font-semibold tracking-wide text-[#789288] ${isCollapsed ? "lg:hidden" : ""}`}>{group.label}</p>
						{group.items.map((item, index) => {
							const Icon = item.icon;
							const active = group.label === "CÁ NHÂN" && index === 0;
							return (
								<button
									className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[8px] transition ${active ? "bg-[#087442] text-white" : "text-[#b4c3bc] hover:bg-[#143a2a] hover:text-white"}`}
									key={item.label}
									type="button"
								>
									<Icon className="size-3 shrink-0" strokeWidth={2.2} />
									<span className={`min-w-0 flex-1 truncate ${isCollapsed ? "lg:hidden" : ""}`}>{item.label}</span>
									{item.count && <span className={`rounded-full bg-white/15 px-1 text-[7px] ${isCollapsed ? "lg:hidden" : ""}`}>{item.count}</span>}
									{active && <ChevronRight className={`size-2.5 ${isCollapsed ? "lg:hidden" : ""}`} />}
								</button>
							);
						})}
					</div>
				))}
			</nav>

			<p className={`hidden px-2 pb-3 text-[7px] text-[#71877d] lg:block ${isCollapsed ? "lg:hidden" : ""}`}>Phiên bản demo · 2026</p>
		</aside>
	);
}
