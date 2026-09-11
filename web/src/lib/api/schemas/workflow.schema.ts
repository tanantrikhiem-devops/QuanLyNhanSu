import { z } from "zod";

import type { WorkflowTemplate } from "@/lib/api/contracts";

import { apiResponseSchema } from "./common.schema";

export const workflowTemplateSchema: z.ZodType<WorkflowTemplate> = z.object({
  id: z.number().int().positive(),
  code: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.enum(["legal", "building", "land"]),
  status: z.enum(["active", "draft"]),
  locked: z.boolean(),
  stage_count: z.number().int().nonnegative(),
  task_count: z.number().int().nonnegative(),
  owner_name: z.string(),
  updated_at: z.string(),
});

export const workflowTemplateListResponseSchema = apiResponseSchema(z.array(workflowTemplateSchema));
