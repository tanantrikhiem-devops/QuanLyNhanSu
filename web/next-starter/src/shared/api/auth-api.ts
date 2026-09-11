import { httpClient, HttpError } from "./http-client";
import { endpoints } from "./endpoints";
import { getCurrentUser, type ApiResponse, type CurrentUser } from "./users-api";

let restoreSessionPromise: Promise<ApiResponse<CurrentUser>> | null = null;

export type LoginResponse = {
	accessToken?: string;
	refreshToken?: string;
	token?: string;
	user?: unknown;
};

export function login(payload: { email: string; password: string; remember: boolean }) {
	return httpClient.post<LoginResponse>(endpoints.auth.login, payload);
}

export function logout() {
	const request = httpClient.post<void>(endpoints.auth.logout, undefined);
	restoreSessionPromise = null;
	return request;
}

export function refreshSession() {
	return httpClient.post<ApiResponse<CurrentUser>>(endpoints.auth.refresh, undefined);
}

export function restoreSession() {
	if (restoreSessionPromise) {
		return restoreSessionPromise;
	}

	restoreSessionPromise = (async () => {
		try {
			return await getCurrentUser();
		} catch (requestError) {
			if (!(requestError instanceof HttpError) || requestError.status !== 401) {
				throw requestError;
			}
			await refreshSession();
			return getCurrentUser();
		}
	})();

	const currentPromise = restoreSessionPromise;
	void currentPromise.then(
		() => {
			if (restoreSessionPromise === currentPromise) {
				restoreSessionPromise = null;
			}
		},
		() => {
			if (restoreSessionPromise === currentPromise) {
				restoreSessionPromise = null;
			}
		},
	);

	return currentPromise;
}

export function register(payload: { email: string; password: string }) {
	return httpClient.post<{ message?: string }>(endpoints.auth.register, payload);
}

export function requestPasswordReset(email: string) {
	return httpClient.post<{ message?: string }>(endpoints.auth.forgotPassword, { email });
}

export function resetPassword(payload: { currentPassword: string; newPassword: string; token?: string }) {
	return httpClient.post<{ message?: string }>(endpoints.auth.resetPassword, payload);
}
