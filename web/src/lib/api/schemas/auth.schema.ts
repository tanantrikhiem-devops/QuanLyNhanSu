import { emptyApiResponseSchema } from "./common.schema";
import { userResponseSchema } from "./user.schema";

export const loginResponseSchema = userResponseSchema;
export const registerResponseSchema = userResponseSchema;
export const refreshResponseSchema = userResponseSchema;
export const logoutResponseSchema = emptyApiResponseSchema;
export const forgotPasswordResponseSchema = emptyApiResponseSchema;
export const resetPasswordResponseSchema = emptyApiResponseSchema;
export const changePasswordResponseSchema = emptyApiResponseSchema;
