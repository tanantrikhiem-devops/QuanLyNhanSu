export const endpoints = {
	auth: {
		login: "/auth/login",
		register: "/auth/register",
		logout: "/auth/logout",
		refresh: "/auth/refresh",
		forgotPassword: "/auth/forgot-password",
		resetPassword: "/auth/reset-password",
	},
	users: {
		me: "/users/me",
	},
} as const;