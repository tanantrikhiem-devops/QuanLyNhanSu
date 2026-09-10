import { Suspense } from "react";
import { Activity, Clock } from "lucide-react";

import { PageHeader } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats, getLiveActivity } from "@/lib/demo-data";

/** Phần cached: nằm luôn trong shell tĩnh, hiển thị ngay lập tức. */
async function StatsGrid() {
  const stats = await getDashboardStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight">{stat.value}</span>
            <Badge variant={stat.tone}>{stat.delta}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/** Phần dynamic: chạy lúc request, stream về sau khi shell đã hiển thị. */
async function LiveActivity() {
  const { at, items } = await getLiveActivity();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="size-4" />
          Hoạt động gần đây
        </CardTitle>
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Clock className="size-3.5" />
          {at}
        </span>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item} className="text-muted-foreground flex gap-2.5 text-sm">
              <span className="bg-muted-foreground/40 mt-2 size-1.5 shrink-0 rounded-full" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-44" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-4 w-full max-w-sm" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <PageHeader
        title="Bảng điều khiển"
        description="Tổng quan tiến độ công việc, SLA và biểu mẫu theo thời gian thực."
      />

      <Suspense fallback={<StatsSkeleton />}>
        <StatsGrid />
      </Suspense>

      <Suspense fallback={<ActivitySkeleton />}>
        <LiveActivity />
      </Suspense>
    </div>
  );
}
