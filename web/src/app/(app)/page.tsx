import { Suspense } from "react";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { WorkflowTemplateCard, WorkflowTemplateCardSkeleton } from "@/features/workflow";
import { getWorkflowTemplates } from "@/lib/demo-data";

const gridClass = "grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:max-w-[64rem]";

async function WorkflowTemplateGrid() {
  const templates = await getWorkflowTemplates();

  return (
    <div className={gridClass}>
      {templates.map((template) => (
        <WorkflowTemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}

function WorkflowTemplateGridSkeleton() {
  return (
    <div className={gridClass}>
      {Array.from({ length: 3 }).map((_, i) => (
        <WorkflowTemplateCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function WorkflowTemplatesPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <PageHeader
        title="Quy trình xử lý"
        description="Chọn một quy trình để cấu hình các tầng và sơ đồ luồng"
        actions={
          <Button className="shadow-[0_6px_16px_rgb(13_119_72/0.3)]">
            <Plus />
            Tạo quy trình
          </Button>
        }
      />

      <Suspense fallback={<WorkflowTemplateGridSkeleton />}>
        <WorkflowTemplateGrid />
      </Suspense>
    </div>
  );
}
