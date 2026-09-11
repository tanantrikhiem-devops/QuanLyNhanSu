import { z } from "zod";

import type { User } from "@/lib/api/contracts";

import { apiResponseSchema } from "./common.schema";

export const userSchema: z.ZodType<User> = z.object({
  id: z.number().int().positive(),
  email: z.email(),
});

export const userResponseSchema = apiResponseSchema(userSchema);
