import * as React from "react";

import { cn } from "@/lib/utils";

export type PageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Nút hành động chính bên phải. */
  actions?: React.ReactNode;
  /** Slot phía trên tiêu đề (vd: <Breadcrumbs />). */
  above?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, description, actions, above, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {above}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground max-w-2xl text-sm">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
