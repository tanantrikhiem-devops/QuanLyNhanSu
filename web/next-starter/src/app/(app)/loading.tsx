import { Skeleton } from "@/components/ui/skeleton";
import { WorkflowTemplateCardSkeleton } from "@/features/workflow";

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:max-w-[64rem]">
        {Array.from({ length: 3 }).map((_, i) => (
          <WorkflowTemplateCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
