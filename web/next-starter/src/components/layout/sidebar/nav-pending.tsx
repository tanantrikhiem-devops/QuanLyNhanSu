"use client";

import { useLinkStatus } from "next/link";
import { Loader2 } from "lucide-react";

export function NavPending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return <Loader2 className="text-muted-foreground ml-auto size-3.5 animate-spin" />;
}
