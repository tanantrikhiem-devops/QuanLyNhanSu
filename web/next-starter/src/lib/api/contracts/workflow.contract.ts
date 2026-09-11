import type { ApiResponse } from "./common.contract";

export type WorkflowTemplateStatus = "active" | "draft";

export type WorkflowTemplateIcon = "legal" | "building" | "land";

export type WorkflowTemplate = {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: WorkflowTemplateIcon;
  status: WorkflowTemplateStatus;
  locked: boolean;
  stage_count: number;
  task_count: number;
  owner_name: string;
  updated_at: string;
};

export type WorkflowTemplateListResponse = ApiResponse<WorkflowTemplate[]>;
