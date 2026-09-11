const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

function getStorage(): Storage | null {
	if (typeof window === "undefined") {
		return null;
	}
	return window.sessionStorage;
}

function getActiveStorage(): Storage | null {
	return getStorage();
}

export function saveAuthTokens(accessToken: string, refreshToken: string | undefined, _remember: boolean) {
	if (typeof window === "undefined") {
		return;
	}

	const storage = getStorage();
	if (!storage) {
		return;
	}

	storage.setItem(ACCESS_TOKEN_KEY, accessToken);
	if (refreshToken) {
		storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
	} else {
		storage.removeItem(REFRESH_TOKEN_KEY);
	}
}

export function getAccessToken() {
	return getActiveStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null;
}

export function getRefreshToken() {
	return getActiveStorage()?.getItem(REFRESH_TOKEN_KEY) ?? null;
}

export function clearAuthTokens() {
	if (typeof window === "undefined") {
		return;
	}
	window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
	window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}