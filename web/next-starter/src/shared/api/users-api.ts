import { httpClient } from "./http-client";
import { endpoints } from "./endpoints";

export type CurrentUser = {
	id: number;
	email: string;
};

export type ApiResponse<T> = {
	data: T;
	message?: string;
};

export function getCurrentUser() {
	return httpClient.get<ApiResponse<CurrentUser>>(endpoints.users.me);
}