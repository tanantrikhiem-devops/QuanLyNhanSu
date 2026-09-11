'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { register } from "@/shared/api/auth-api";

import Sidebar from "../sidebar";

export default function RegisterPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setSuccess("");

		if (password.length < 8) {
			setError("Mật khẩu phải có ít nhất 8 ký tự.");
			return;
		}
		if (password !== confirmPassword) {
			setError("Mật khẩu xác nhận không trùng khớp.");
			return;
		}

		setIsSubmitting(true);
		try {
			await register({ email, password });
			router.replace("/login");
		} catch (requestError) {
			setError(requestError instanceof Error ? requestError.message : "Đăng ký thất bại.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className="flex min-h-screen flex-col bg-[#f4f5f4] text-[#15231d] lg:flex-row">
			<Sidebar />

			<section className="flex min-w-0 flex-1 items-center justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
				<div className="w-full max-w-[360px] rounded-lg border border-[#e5e9e6] bg-white px-5 py-6 shadow-[0_8px_22px_rgba(21,35,29,0.08)] sm:px-7 sm:py-7">
					<h2 className="text-[13px] font-bold text-[#17251e]">Tạo tài khoản</h2>
					<p className="mt-1.5 text-[9px] leading-relaxed text-[#6e7974]">
						Đăng ký tài khoản nội bộ để sử dụng hệ thống.
					</p>

					<form className="mt-4" onSubmit={handleSubmit}>
						<label className="block text-[9px] font-medium text-[#26332d]" htmlFor="register-email">
							Email
						</label>
						<input
							className="mt-1.5 h-[30px] w-full rounded-md border border-[#dfe5e1] px-2.5 text-[9px] text-[#26332d] outline-none transition focus:border-[#0d7748] focus:ring-2 focus:ring-[#0d7748]/10"
							id="register-email"
							name="email"
							onChange={(event) => setEmail(event.target.value)}
							placeholder="vd: email@congty.vn"
							required
							type="email"
							value={email}
						/>

						<label className="mt-3 block text-[9px] font-medium text-[#26332d]" htmlFor="register-password">
							Mật khẩu
						</label>
						<div className="relative mt-1.5">
							<input
								className="h-[30px] w-full rounded-md border border-[#dfe5e1] px-2.5 pr-12 text-[9px] text-[#26332d] outline-none transition focus:border-[#0d7748] focus:ring-2 focus:ring-[#0d7748]/10"
								id="register-password"
								name="password"
								onChange={(event) => setPassword(event.target.value)}
								placeholder="Tối thiểu 8 ký tự"
								required
								type={showPassword ? "text" : "password"}
								value={password}
							/>
							<button
								className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-[#26332d] hover:text-[#0d7748]"
								onClick={() => setShowPassword((visible) => !visible)}
								type="button"
							>
								{showPassword ? "Ẩn" : "Hiện"}
							</button>
						</div>

						<label className="mt-3 block text-[9px] font-medium text-[#26332d]" htmlFor="register-confirm-password">
							Nhập lại mật khẩu
						</label>
						<div className="relative mt-1.5">
							<input
								className="h-[30px] w-full rounded-md border border-[#dfe5e1] px-2.5 pr-12 text-[9px] text-[#26332d] outline-none transition focus:border-[#0d7748] focus:ring-2 focus:ring-[#0d7748]/10"
								id="register-confirm-password"
								name="confirmPassword"
								onChange={(event) => setConfirmPassword(event.target.value)}
								placeholder="Nhập lại mật khẩu"
								required
								type={showConfirmPassword ? "text" : "password"}
								value={confirmPassword}
							/>
							<button
								className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-[#26332d] hover:text-[#0d7748]"
								onClick={() => setShowConfirmPassword((visible) => !visible)}
								type="button"
							>
								{showConfirmPassword ? "Ẩn" : "Hiện"}
							</button>
						</div>

						<button
							className="mt-4 h-[30px] w-full rounded-md bg-[#0d7748] text-[9px] font-bold text-white transition hover:bg-[#09633b] focus:outline-none focus:ring-2 focus:ring-[#0d7748]/30 disabled:cursor-not-allowed disabled:opacity-60"
							disabled={isSubmitting}
							type="submit"
						>
							{isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
						</button>
					</form>

					{error && <p className="mt-3 rounded-md bg-[#fff0ef] px-2.5 py-2 text-[8px] text-[#b43e35]">{error}</p>}
					{success && <p className="mt-3 rounded-md bg-[#eaf6ef] px-2.5 py-2 text-[8px] text-[#167344]">{success}</p>}

					<Link
						className="mt-3 flex h-[30px] w-full items-center justify-center rounded-md border border-[#d5ddd8] text-[9px] font-semibold text-[#26332d] transition hover:bg-[#f4f7f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d7748]"
						href="/login"
					>
						Đã có tài khoản? Đăng nhập
					</Link>
				</div>
			</section>
		</main>
	);
}
