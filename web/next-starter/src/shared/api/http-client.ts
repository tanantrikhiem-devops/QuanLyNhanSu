import { getAccessToken } from "./auth-storage";

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export class HttpError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "HttpError";
		this.status = status;
	}
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const accessToken = getAccessToken();
	const response = await fetch(`${apiUrl}${path}`, {
		...options,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
			...options.headers,
		},
	});

	const contentType = response.headers.get("content-type") ?? "";
	const body = contentType.includes("application/json") ? await response.json() : await response.text();

	if (!response.ok) {
		const message = typeof body === "object" && body !== null && "message" in body && typeof body.message === "string"
			? body.message
			: "Không thể kết nối đến hệ thống. Vui lòng thử lại.";
		throw new HttpError(message, response.status);
	}

	return body as T;
}

export const httpClient = {
	get<T>(path: string, options?: RequestInit) {
		return request<T>(path, { ...options, method: "GET" });
	},
	post<T>(path: string, body: unknown, options?: RequestInit) {
		return request<T>(path, {
			...options,
			method: "POST",
			body: JSON.stringify(body),
		});
	},
};