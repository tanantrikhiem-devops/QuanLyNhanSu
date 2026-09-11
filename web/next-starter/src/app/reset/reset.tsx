'use client';

import { FormEvent, useState } from "react";

import { resetPassword } from "@/shared/api/auth-api";

import Sidebar from "../sidebar";

const passwordRules = [
	{ label: "Tối thiểu 10 ký tự", test: (value: string) => value.length >= 10 },
	{ label: "Có chữ hoa, chữ thường và số", test: (value: string) => /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) },
	{ label: "Không trùng 3 mật khẩu gần nhất", test: () => true },
];

function PasswordField({
	id,
	label,
	placeholder,
	value,
	onChange,
}: {
	id: string;
	label: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
}) {
	const [visible, setVisible] = useState(false);

	return (
		<div className="space-y-1.5">
			<label className="block text-[8px] font-semibold text-[#26332d]" htmlFor={id}>
				{label}
			</label>
			<div className="relative">
				<input
					className="h-7 w-full rounded-[5px] border border-[#dce3df] px-2 pr-10 text-[9px] text-[#26332d] outline-none transition focus:border-[#0c7547] focus:ring-2 focus:ring-[#0c7547]/15"
					id={id}
					name={id}
					onChange={(event) => onChange(event.target.value)}
					placeholder={placeholder}
					required
					type={visible ? "text" : "password"}
					value={value}
				/>
				<button
					className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-[#65716b] hover:text-[#0c7547]"
					onClick={() => setVisible((current) => !current)}
					type="button"
				>
					{visible ? "Ẩn" : "Hiện"}
				</button>
			</div>
		</div>
	);
}

export default function ResetPage() {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setMessage("");
		setError("");
		if (newPassword !== confirmPassword) {
			setError("Mật khẩu xác nhận không trùng khớp.");
			return;
		}
		if (!passwordRules.every((rule) => rule.test(newPassword))) {
			setError("Mật khẩu chưa đáp ứng đủ điều kiện.");
			return;
		}

		setIsSubmitting(true);
		try {
			const token = new URLSearchParams(window.location.search).get("token") ?? undefined;
			const response = await resetPassword({ currentPassword, newPassword, token });
			setMessage(response.message ?? "Đổi mật khẩu thành công.");
		} catch (requestError) {
			setError(requestError instanceof Error ? requestError.message : "Không thể đổi mật khẩu.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className="flex min-h-screen flex-col bg-[#f5f6f5] text-[#15211d] lg:flex-row">
			<Sidebar />

			<section className="flex min-w-0 flex-1 items-center justify-center px-5 py-10 sm:px-8">
				<div className="w-full max-w-[302px] rounded-lg border border-[#e4e8e5] bg-white px-6 py-6 shadow-[0_8px_22px_rgba(17,37,28,0.08)]">
					<h2 className="text-[13px] font-bold text-[#17221e]">Đặt mật khẩu mới</h2>
					<p className="mt-2 text-[8px] leading-relaxed text-[#66716c]">
						Tài khoản mới cấp bắt buộc đổi mật khẩu trước khi vào hệ thống.
					</p>

					<form className="mt-4 space-y-3" onSubmit={handleSubmit}>
						<PasswordField
							id="current-password"
							label="Mật khẩu hiện tại"
							placeholder="Mật khẩu tạm do phòng CNTT cấp"
							value={currentPassword}
							onChange={setCurrentPassword}
						/>
						<PasswordField
							id="new-password"
							label="Mật khẩu mới"
							placeholder="Tối thiểu 10 ký tự"
							value={newPassword}
							onChange={setNewPassword}
						/>
						<PasswordField
							id="confirm-password"
							label="Nhập lại mật khẩu mới"
							placeholder="Nhập lại để xác nhận"
							value={confirmPassword}
							onChange={setConfirmPassword}
						/>

						<div className="rounded-[5px] bg-[#edf1ef] px-2 py-2 text-[7px] leading-relaxed text-[#69756f]">
							<p className="mb-1 font-semibold text-[#59665f]">MẬT KHẨU PHẢI CÓ</p>
							{passwordRules.map((rule) => (
								<p className="flex items-center gap-1" key={rule.label}>
									<span className={rule.test(newPassword) ? "text-[#16834d]" : "text-[#c4c9c6]"}>
										{rule.test(newPassword) ? "●" : "○"}
									</span>
									{rule.label}
								</p>
							))}
							<p className="flex items-center gap-1 text-[#c34e45]">
								<span>{confirmPassword && confirmPassword === newPassword ? "●" : "○"}</span>
								Mật khẩu phải trùng khớp
							</p>
						</div>

						<button
							className="h-7 w-full rounded-[5px] bg-[#087442] text-[9px] font-semibold text-white transition hover:bg-[#075e36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087442] disabled:cursor-not-allowed disabled:opacity-60"
							disabled={isSubmitting}
							type="submit"
						>
							{isSubmitting ? "Đang cập nhật..." : "Xác nhận và vào hệ thống"}
						</button>
					</form>

					{error && <p className="mt-3 rounded-[5px] bg-[#fff0ef] px-2 py-2 text-[7px] text-[#b43e35]">{error}</p>}
					{message && <p className="mt-3 rounded-[5px] bg-[#eaf6ef] px-2 py-2 text-[7px] text-[#167344]">{message}</p>}
				</div>
			</section>
		</main>
	);
}
