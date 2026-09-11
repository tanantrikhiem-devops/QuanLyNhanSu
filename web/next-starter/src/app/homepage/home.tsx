'use client';

import { Check, ChevronDown, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { logout, restoreSession } from "@/shared/api/auth-api";

import MenuSidebar from "../menuSidebar";

type WorkItem = {
	title: string;
	meta: string;
	status: "KHẨN" | "CAO" | "BÌNH THƯỜNG";
	due: string;
};

const workItems: WorkItem[] = [
	{ title: "Kiểm tra xung đột lợi ích — HS-DS-2026-0058", meta: "Tầng 1 · BM02", status: "KHẨN", due: "Quá hạn 12 ngày" },
	{ title: "Duyệt phiếu trình Tầng 4 — HS-DS-2026-0041", meta: "Tầng 4 · BM10", status: "CAO", due: "Hôm nay 17:00" },
	{ title: "Phê duyệt phương án nhánh 4B — HD-2026/038", meta: "Tầng 4 · BM07", status: "CAO", due: "Hôm nay 17:00" },
	{ title: "Rà soát một số khối kiến — HD-2026/045", meta: "Tầng 3 · BM13", status: "BÌNH THƯỜNG", due: "08/09/2026" },
	{ title: "Nghiệm thu và đóng hồ sơ — HS-DS-2026-0033", meta: "Tầng 5 · BM16", status: "BÌNH THƯỜNG", due: "10/09/2026" },
];

const approvals = [
	{ title: "HS-DS-2026-0041 · Chuyển Tầng 1 → 2", owner: "Lê Thu Hà · 07/09 · 2 việc trễ hạn" },
	{ title: "HD-2026/038 · Phương án nhánh 4B", owner: "LS. Trần Minh Khoa · 06/09" },
	{ title: "HD-2026/045 · Báo phí và ký hợp đồng", owner: "Bùi Đức Anh · 05/09" },
];

function statusClass(status: WorkItem["status"]) {
	if (status === "KHẨN") return "bg-[#ffe2df] text-[#bd4d42]";
	if (status === "CAO") return "bg-[#fff0d5] text-[#a96b12]";
	return "bg-[#e8eeea] text-[#607068]";
}

export default function HomePage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const [tasks, setTasks] = useState(workItems);
	const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
	const [pendingApprovals, setPendingApprovals] = useState(approvals);
	const [showAllTasks, setShowAllTasks] = useState(false);
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
	const [taskTitle, setTaskTitle] = useState("");
	const [notice, setNotice] = useState("");

	useEffect(() => {
		let isMounted = true;
		async function loadSession() {
			try {
				const response = await restoreSession();
				if (isMounted) {
					setEmail(response.data.email);
					setIsLoading(false);
				}
			} catch {
				if (isMounted) router.replace("/login");
			}
		}
		void loadSession();
		return () => {
			isMounted = false;
		};
	}, [router]);

	async function handleLogout() {
		setIsLoggingOut(true);
		try {
			await logout();
		} finally {
			sessionStorage.removeItem("auth_user_email");
			router.replace("/login");
		}
	}

	function toggleTask(title: string) {
		setCompletedTasks((current) => ({ ...current, [title]: !current[title] }));
	}

	function handleApproval(title: string, action: "approved" | "returned") {
		setPendingApprovals((current) => current.filter((item) => item.title !== title));
		setNotice(action === "approved" ? "Đã duyệt yêu cầu." : "Đã trả yêu cầu để chỉnh sửa.");
	}

	function addTask(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const title = taskTitle.trim();
		if (!title) return;
		setTasks((current) => [
			...current,
			{ title, meta: "Tầng 4 · Việc mới", status: "BÌNH THƯỜNG", due: "Chưa đặt hạn" },
		]);
		setTaskTitle("");
		setIsTaskModalOpen(false);
		setNotice("Đã thêm việc mới vào bảng làm việc.");
	}

	if (isLoading) {
		return <main className="flex min-h-screen items-center justify-center bg-[#f3f5f4] text-sm text-[#68736e]">Đang tải bảng làm việc...</main>;
	}

	return (
		<div className={`min-h-screen bg-[#f3f5f4] text-[#1d2924] transition-[padding] duration-200 ${isSidebarCollapsed ? "lg:pl-[56px]" : "lg:pl-[146px]"}`}>
			<MenuSidebar onCollapsedChange={setIsSidebarCollapsed} />
			<header className="flex h-14 items-center justify-between border-b border-[#e0e6e2] bg-white px-4 sm:px-6">
				<div className="flex min-w-0 items-center gap-3">
					<p className="hidden text-[10px] text-[#77847d] sm:block">Cá nhân&nbsp; / &nbsp;Bảng làm việc</p>
					<div className="relative hidden w-56 md:block">
						<Search className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-[#87948d]" />
						<input className="h-7 w-full rounded-md bg-[#f1f4f2] pl-7 pr-12 text-[9px] outline-none" placeholder="Tìm hồ sơ, người, quy trình..." />
						<span className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded border border-[#d9e0db] px-1 text-[7px] text-[#76837c]">Ctrl+K</span>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<button className="hidden rounded-full bg-[#e8f2ec] px-2.5 py-1.5 text-[9px] font-semibold text-[#167344] sm:block" type="button">Luật sư điều hành · Tầng 4</button>
					<div className="flex size-7 items-center justify-center rounded-full bg-[#087442] text-[8px] font-bold text-white">{email.charAt(0).toUpperCase()}</div>
					<div className="hidden leading-tight sm:block">
						<p className="text-[9px] font-semibold">{email}</p>
						<p className="text-[7px] text-[#7b8881]">Trưởng bộ phận</p>
					</div>
					<div className="relative">
						<button
							aria-expanded={isProfileMenuOpen}
							aria-label="Mở menu tài khoản"
							className="flex items-center gap-1 rounded-md p-1 text-[#76837c] hover:bg-[#f1f4f2]"
							onClick={() => setIsProfileMenuOpen((current) => !current)}
							type="button"
						>
							<ChevronDown className={`size-3 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} />
						</button>

						{isProfileMenuOpen && (
							<div className="absolute right-0 top-9 z-10 w-44 rounded-lg border border-[#dfe6e1] bg-white p-1.5 shadow-[0_8px_24px_rgba(21,35,29,0.14)]">
								<div className="border-b border-[#edf1ee] px-2 py-2">
									<p className="truncate text-[9px] font-semibold text-[#1d2924]">{email}</p>
									<p className="mt-0.5 text-[8px] text-[#7b8881]">Trưởng bộ phận</p>
								</div>
								<button
									className="mt-1 w-full rounded-md px-2 py-2 text-left text-[9px] font-semibold text-[#bd4d42] hover:bg-[#fff0ef] disabled:cursor-not-allowed disabled:opacity-60"
									disabled={isLoggingOut}
									onClick={handleLogout}
									type="button"
								>
									{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
								</button>
							</div>
						)}
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-[1180px] px-4 py-5 sm:px-6">
				<div className="mb-5 flex items-end justify-between gap-3">
					<div>
						<h1 className="text-xl font-bold tracking-tight sm:text-2xl">Chào buổi sáng, anh Nam</h1>
						<p className="mt-1 text-[9px] text-[#75827b]">Thứ Hai, 07/09/2026 · Anh đang chủ trì Tầng 4 của 3 quy trình</p>
					</div>
					<button className="flex shrink-0 items-center gap-1.5 rounded-md bg-[#087442] px-3 py-2 text-[9px] font-semibold text-white shadow-sm hover:bg-[#075e36]" onClick={() => setIsTaskModalOpen(true)} type="button"><Plus className="size-3" /> Giao việc mới</button>
				</div>

				<div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
					{[
						["VIỆC CỦA TÔI HÔM NAY", String(tasks.length), `${Object.values(completedTasks).filter(Boolean).length} việc đã hoàn tất`, "#188452"],
						["QUÁ HẠN", String(tasks.filter((item) => item.status === "KHẨN").length), "Cần xử lý ưu tiên", "#d24e46"],
						["CHỜ TÔI PHÊ DUYỆT", String(pendingApprovals.length), "Yêu cầu đang chờ xử lý", "#b47818"],
						["YÊU CẦU MỞ KHÓA", "1", "LS. Trần Minh Khoa gửi 06/09", "#766b2c"],
					].map(([label, value, detail, color]) => (
						<div className="rounded-lg border border-[#dfe6e1] bg-white p-3" key={label}>
							<div className="mb-2 h-0.5 w-6 rounded-full" style={{ backgroundColor: color }} />
							<p className="text-[7px] font-medium text-[#718078]">{label}</p>
							<p className="mt-1 text-xl font-bold">{value}</p>
							<p className="mt-1 truncate text-[7px] text-[#76837c]">{detail}</p>
						</div>
					))}
				</div>

				<div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_270px]">
					<section className="rounded-lg border border-[#dfe6e1] bg-white p-3">
						<div className="mb-2 flex items-center justify-between"><h2 className="text-[11px] font-bold">Việc cần làm hôm nay</h2><button className="text-[8px] font-semibold text-[#188452]" onClick={() => setShowAllTasks((current) => !current)} type="button">{showAllTasks ? "Thu gọn" : "Xem tất cả"}</button></div>
						<div className="divide-y divide-[#edf1ee]">
							{tasks.slice(0, showAllTasks ? tasks.length : 3).map((item) => <div className="flex items-center gap-2 py-2.5" key={item.title}><input checked={Boolean(completedTasks[item.title])} className="size-3 rounded border-[#c9d4ce] accent-[#087442]" onChange={() => toggleTask(item.title)} type="checkbox" /><div className="min-w-0 flex-1"><p className={`truncate text-[9px] font-medium ${completedTasks[item.title] ? "text-[#8a9690] line-through" : ""}`}>{item.title}</p><p className="mt-1 text-[7px] text-[#7b8881]">{item.meta} <span className={`ml-1 rounded px-1.5 py-0.5 text-[6px] font-semibold ${statusClass(item.status)}`}>{item.status}</span></p></div><span className={`hidden shrink-0 text-[7px] sm:block ${item.status === "KHẨN" ? "text-[#d24e46]" : "text-[#718078]"}`}>{item.due}</span></div>)}
						</div>
					</section>

					<div className="space-y-3">
						<section className="rounded-lg border border-[#dfe6e1] bg-white p-3"><h2 className="mb-2 text-[11px] font-bold">Chờ tôi phê duyệt</h2><div className="space-y-2">{pendingApprovals.length === 0 ? <p className="rounded-md bg-[#eaf6ef] p-3 text-[8px] text-[#167344]">Không còn yêu cầu chờ duyệt.</p> : pendingApprovals.map((item) => <div className="rounded-md border border-[#e4ebe6] bg-[#f7f9f7] p-2" key={item.title}><p className="text-[8px] font-semibold">{item.title}</p><p className="mt-1 text-[7px] text-[#7b8881]">{item.owner}</p><div className="mt-2 flex gap-1.5"><button className="rounded bg-[#087442] px-2 py-1 text-[7px] font-semibold text-white" onClick={() => handleApproval(item.title, "approved")} type="button"><Check className="mr-0.5 inline size-2.5" />Duyệt</button><button className="rounded border border-[#d6dfd9] px-2 py-1 text-[7px] text-[#68736e]" onClick={() => handleApproval(item.title, "returned")} type="button">Trả lại sửa</button></div></div>)}</div></section>
						<section className="rounded-lg border border-[#dfe6e1] bg-white p-3"><div className="flex items-center justify-between"><h2 className="text-[11px] font-bold">Yêu cầu quyền</h2><span className="rounded bg-[#8b711d] px-1.5 py-0.5 text-[7px] text-white">1 chờ xử lý</span></div><div className="mt-2 rounded-md bg-[#fff4df] p-2"><p className="text-[8px] font-semibold">Xin mở khóa “Quy trình tư vấn pháp lý”</p><p className="mt-1 text-[7px] leading-relaxed text-[#84745d]">LS. Trần Minh Khoa · 06/09 · Lý do: cần bổ sung bước kiểm tra thẩm quyền cho nhánh 4B</p></div></section>
					</div>
				</div>
			</main>
			{notice && <button className="fixed bottom-4 right-4 rounded-md bg-[#153a2a] px-3 py-2 text-[9px] text-white shadow-lg" onClick={() => setNotice("")} type="button">{notice}</button>}
			{isTaskModalOpen && <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#09251b]/35 p-4"><form className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl" onSubmit={addTask}><h2 className="text-sm font-bold">Giao việc mới</h2><p className="mt-1 text-[10px] text-[#718078]">Thêm một việc vào bảng làm việc hôm nay.</p><input autoFocus className="mt-4 h-9 w-full rounded-md border border-[#d5ddd8] px-3 text-xs outline-none focus:border-[#087442]" onChange={(event) => setTaskTitle(event.target.value)} placeholder="Tên công việc" required value={taskTitle} /><div className="mt-4 flex justify-end gap-2"><button className="rounded-md border border-[#d5ddd8] px-3 py-2 text-xs" onClick={() => setIsTaskModalOpen(false)} type="button">Hủy</button><button className="rounded-md bg-[#087442] px-3 py-2 text-xs font-semibold text-white" type="submit">Thêm việc</button></div></form></div>}
		</div>
	);
}
