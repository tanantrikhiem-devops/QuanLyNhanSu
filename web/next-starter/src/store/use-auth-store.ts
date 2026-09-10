"use client";

import { create } from "zustand";

/**
 * Access token sống trong RAM: KHÔNG `persist`, KHÔNG localStorage, KHÔNG cookie
 * đọc được từ JS. Đóng tab hoặc F5 là mất — phiên được dựng lại từ `refresh_token`
 * (httpOnly cookie) qua `POST /auth/refresh`.
 *
 * `status` mô tả vòng đời phiên để UI biết lúc nào đang khôi phục:
 *  - `unknown`   : chưa thử khôi phục lần nào (ngay sau khi tải trang);
 *  - `anonymous` : đã thử và không có phiên hợp lệ;
 *  - `authenticated` : đang giữ access token còn hạn.
 */
export type AuthStatus = "unknown" | "anonymous" | "authenticated";

type AuthState = {
  accessToken: string | null;
  status: AuthStatus;
  setAccessToken: (token: string | null) => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  status: "unknown",
  setAccessToken: (accessToken) =>
    set({ accessToken, status: accessToken === null ? "anonymous" : "authenticated" }),
}));
