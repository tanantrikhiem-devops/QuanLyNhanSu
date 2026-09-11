import Link from "next/link";
import { ArrowRight, Building2, House, Lock, Scale, type LucideIcon } from "lucide-react";

import type {
  WorkflowTemplate,
  WorkflowTemplateIcon,
  WorkflowTemplateStatus,
} from "@/lib/api/contracts";
import { toRoute } from "@/lib/nav";
import { cn } from "@/lib/utils";

const ICONS: Record<WorkflowTemplateIcon, LucideIcon> = {
  legal: Scale,
  building: Building2,
  land: House,
};

const STATUS: Record<WorkflowTemplateStatus, { label: string; className: string }> = {
  active: {
    label: "Đang áp dụng",
    className: "border-primary/40 bg-auth-success-bg text-primary",
  },
  draft: {
    label: "Bản nháp",
    className: "border-border bg-muted text-muted-foreground",
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function WorkflowTemplateCard({ template }: { template: WorkflowTemplate }) {
  const Icon = ICONS[template.icon];
  const status = STATUS[template.status];
  const href = toRoute(`/quy-trinh/${template.id}`);

  return (
    <article className="bg-card border-border group relative flex flex-col rounded-xl border p-4 shadow-[0_1px_2px_rgb(21_35_29/0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgb(21_35_29/0.08)]">
      <header className="flex items-start gap-2.5">
        <span className="bg-muted text-brand-ink grid size-9 shrink-0 place-items-center rounded-lg">
          <Icon className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold">
            <Link
              href={href}
              className="focus-visible:ring-ring/50 rounded outline-none after:absolute after:inset-0 focus-visible:ring-[3px]"
            >
              {template.name}
            </Link>
            {template.locked && (
              <Lock className="text-brand-gold size-3.5 shrink-0" aria-label="Đã khoá" />
            )}
          </h2>
          <p className="text-muted-foreground mt-1 font-mono text-[0.625rem]">{template.code}</p>
        </div>
      </header>

      <p className="text-foreground/80 mt-3 text-xs leading-relaxed">{template.description}</p>

      <div className="border-border mt-3 flex items-center gap-2 border-t border-dashed pt-2.5">
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-semibold",
            status.className,
          )}
        >
          {status.label}
        </span>
        <span className="text-muted-foreground text-[0.6875rem]">
          {template.stage_count} tầng · {template.task_count} việc
        </span>
        <span className="text-primary ml-auto inline-flex items-center gap-0.5 text-[0.6875rem] font-bold">
          Mở
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>

      <p className="text-muted-foreground mt-2 text-[0.6875rem]">
        Phụ trách: {template.owner_name} · cập nhật {formatDate(template.updated_at)}
      </p>
    </article>
  );
}

export function WorkflowTemplateCardSkeleton() {
  return (
    <div className="bg-card border-border flex h-44 flex-col gap-3 rounded-xl border p-4">
      <div className="flex gap-2.5">
        <div className="bg-muted size-9 animate-pulse rounded-lg" />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="bg-muted h-3.5 w-40 animate-pulse rounded" />
          <div className="bg-muted h-2.5 w-16 animate-pulse rounded" />
        </div>
      </div>
      <div className="bg-muted h-3 w-full animate-pulse rounded" />
      <div className="bg-muted h-3 w-3/4 animate-pulse rounded" />
    </div>
  );
}
