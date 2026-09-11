'use client';

import Link from "next/link";
import { FormEvent, useState } from "react";

import { requestPasswordReset } from "@/shared/api/auth-api";

import Sidebar from "../sidebar";

export default function ForgotPage() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);
		setMessage("");
		setError("");
		try {
			const response = await requestPasswordReset(email);
			setMessage(response.message ?? "Liên kết đặt lại mật khẩu đã được gửi.");
		} catch (requestError) {
			setError(requestError instanceof Error ? requestError.message : "Không thể gửi yêu cầu.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className="flex min-h-screen flex-col bg-[#f5f6f5] text-[#15211d] lg:flex-row">
			<Sidebar />

			<section className="flex min-w-0 flex-1 items-center justify-center px-5 py-10 sm:px-8">
				<div className="w-full max-w-[302px] rounded-lg border border-[#e4e8e5] bg-white px-6 py-7 shadow-[0_8px_22px_rgba(17,37,28,0.08)] sm:px-6">
					<h2 className="text-[13px] font-bold text-[#17221e]">Quên mật khẩu</h2>
					<p className="mt-2 text-[8px] leading-relaxed text-[#66716c]">
						Nhập email nội bộ, hệ thống gửi liên kết đặt lại trong 15 phút.
					</p>

					<form className="mt-4 space-y-3" onSubmit={handleSubmit}>
						<div className="space-y-1">
							<label className="block text-[8px] font-semibold text-[#26332d]" htmlFor="email">
								Email nội bộ
							</label>
							<input
								className="h-7 w-full rounded-[5px] border border-[#dce3df] px-2 text-[9px] text-[#26332d] outline-none transition focus:border-[#0c7547] focus:ring-2 focus:ring-[#0c7547]/15"
								id="email"
								name="email"
								onChange={(event) => setEmail(event.target.value)}
								placeholder="vd: tanantrikhien@gmail.com"
								required
								type="email"
								value={email}
							/>
						</div>

						<button
							className="h-7 w-full rounded-[5px] bg-[#087442] text-[9px] font-semibold text-white transition hover:bg-[#075e36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087442] disabled:cursor-not-allowed disabled:opacity-60"
							disabled={isSubmitting}
							type="submit"
						>
							{isSubmitting ? "Đang gửi..." : "Gửi liên kết đặt lại"}
						</button>
					</form>
					{error && <p className="mt-3 rounded-[5px] bg-[#fff0ef] px-2 py-2 text-[7px] text-[#b43e35]">{error}</p>}
					{message && <p className="mt-3 rounded-[5px] bg-[#eaf6ef] px-2 py-2 text-[7px] text-[#167344]">{message}</p>}

					<Link
						className="mt-3 flex h-7 w-full items-center justify-center rounded-[5px] border border-[#d5ddd8] text-[9px] font-semibold text-[#26332d] transition hover:bg-[#f4f7f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087442]"
						href="/login"
					>
						Quay lại đăng nhập
					</Link>

					<p className="mt-3 rounded-[5px] bg-[#edf1ef] px-2 py-2 text-[7px] leading-relaxed text-[#69756f]">
						Không nhận được thư? Liên hệ Phòng Hành chính – CNTT (nội bộ 105) để được cấp lại thủ công.
					</p>
				</div>
			</section>
		</main>
	);
}
