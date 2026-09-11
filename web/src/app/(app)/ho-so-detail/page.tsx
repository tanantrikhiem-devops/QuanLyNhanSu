import { Suspense } from "react";
import { notFound } from "next/navigation";

import { cases } from "@/features/auth/components/ho-so-form";
import { HoSoDetailForm } from "@/features/auth/components/ho-so-detail-form";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function HoSoDetailPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<HoSoDetailSkeleton />}>
      <HoSoDetailSection searchParams={searchParams} />
    </Suspense>
  );
}

async function HoSoDetailSection({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const id = typeof params.id === "string" ? params.id : cases[0]?.id;
  const item = cases.find((caseItem) => caseItem.id === id);

  if (!item) notFound();
  return <HoSoDetailForm item={item} />;
}

function HoSoDetailSkeleton() {
  return (
    <div className="case-detail-skeleton" aria-busy="true">
      <div className="h-3 w-24 rounded bg-muted" />
      <div className="mt-4 h-7 w-2/3 rounded bg-muted" />
      <div className="mt-5 grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-16 rounded-lg bg-muted" />
        ))}
      </div>
      <div className="mt-3 h-64 rounded-lg bg-muted" />
    </div>
  );
}
