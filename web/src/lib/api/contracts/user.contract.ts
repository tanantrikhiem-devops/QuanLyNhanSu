import type { ApiResponse } from "./common.contract";

export type User = {
  id: number;
  email: string;
};

export type UserResponse = ApiResponse<User>;
