'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { login } from "@/shared/api/auth-api";

import Sidebar from "../sidebar";

export default function Login() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setSuccess("");
		setIsSubmitting(true);

		try {
			await login({ email, password, remember });
			sessionStorage.setItem("auth_user_email", email);
			router.push("/homepage");
		} catch (requestError) {
			setError(requestError instanceof Error ? requestError.message : "Đăng nhập thất bại.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className="flex min-h-screen flex-col bg-[#f4f5f4] text-[#15231d] lg:flex-row">
			<Sidebar />

			<section className="flex min-w-0 flex-1 items-center justify-center px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
				<div className="w-full max-w-[302px] rounded-lg border border-[#e5e9e6] bg-white px-6 py-7 shadow-[0_8px_22px_rgba(21,35,29,0.08)] sm:px-7">
					<h2 className="text-[13px] font-bold text-[#17251e]">Đăng nhập hệ thống</h2>
					<p className="mt-1.5 text-[9px] leading-relaxed text-[#6e7974]">
						Dùng tài khoản nội bộ do phòng Hành chính – CNTT cấp
					</p>

					<form className="mt-4" onSubmit={handleSubmit}>
						<label className="block text-[9px] font-medium text-[#26332d]" htmlFor="email">
							Tài khoản / Email
						</label>
						<input
							className="mt-1.5 h-[30px] w-full rounded-md border border-[#dfe5e1] px-2.5 text-[9px] text-[#26332d] outline-none transition focus:border-[#0d7748] focus:ring-2 focus:ring-[#0d7748]/10"
							id="email"
							name="email"
							onChange={(event) => setEmail(event.target.value)}
							placeholder="vd: tanantrikhien@gmail.com"
							required
							type="email"
							value={email}
						/>

						<label className="mt-3 block text-[9px] font-medium text-[#26332d]" htmlFor="password">
							Mật khẩu
						</label>
						<div className="relative mt-1.5">
							<input
								className="h-[30px] w-full rounded-md border border-[#dfe5e1] px-2.5 pr-12 text-[9px] text-[#26332d] outline-none transition focus:border-[#0d7748] focus:ring-2 focus:ring-[#0d7748]/10"
								id="password"
								name="password"
								onChange={(event) => setPassword(event.target.value)}
								placeholder="Nhập mật khẩu"
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

						<div className="mt-3 flex items-center justify-between text-[8px] text-[#68736e]">
							<label className="flex items-center gap-1.5" htmlFor="remember">
								<input
									className="h-3 w-3 rounded border-[#aeb8b2] accent-[#0d7748]"
									id="remember"
									name="remember"
									onChange={(event) => setRemember(event.target.checked)}
									type="checkbox"
									checked={remember}
								/>
								Ghi nhớ đăng nhập
							</label>
							<Link className="font-semibold text-[#26332d] hover:text-[#0d7748]" href="/forgot">
								Quên mật khẩu?
							</Link>
						</div>

						<button
							className="mt-3 h-[30px] w-full rounded-md bg-[#0d7748] text-[9px] font-bold text-white transition hover:bg-[#09633b] focus:outline-none focus:ring-2 focus:ring-[#0d7748]/30 disabled:cursor-not-allowed disabled:opacity-60"
							disabled={isSubmitting}
							type="submit"
						>
							{isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
						</button>
					</form>

					{error && <p className="mt-3 rounded-md bg-[#fff0ef] px-2.5 py-2 text-[8px] text-[#b43e35]">{error}</p>}
					{success && <p className="mt-3 rounded-md bg-[#eaf6ef] px-2.5 py-2 text-[8px] text-[#167344]">{success}</p>}

					<p className="mt-3 rounded-md bg-[#e8f1fb] px-2.5 py-2 text-[8px] leading-relaxed text-[#687681]">
						Mọi thao tác khoá / mở khoá quy trình đều yêu cầu nhập lại mật khẩu này và được ghi vào nhật ký hoạt động.
					</p>

					<Link
						className="mt-3 flex h-[30px] w-full items-center justify-center rounded-md border border-[#d5ddd8] text-[9px] font-semibold text-[#26332d] transition hover:bg-[#f4f7f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d7748]"
						href="/register"
					>
						Chưa có tài khoản? Đăng ký
					</Link>
				</div>
			</section>
		</main>
	);
}
