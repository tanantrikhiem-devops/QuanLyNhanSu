"use client";

import { useEffect, useRef } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

export type TopbarSearchProps = {
  placeholder?: string;
  onSearch?: (keyword: string) => void;
  className?: string;
};

export function TopbarSearch({
  placeholder = "Tìm kiếm...",
  onSearch,
  className,
}: TopbarSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch?.(inputRef.current?.value.trim() ?? "");
      }}
      className={cn(
        "border-input bg-card focus-within:border-primary focus-within:ring-primary/15 flex h-8 w-72 items-center gap-2 rounded-lg border px-2.5 transition focus-within:ring-2",
        className,
      )}
    >
      <Search className="text-muted-foreground size-3.5 shrink-0" />
      <input
        ref={inputRef}
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-xs outline-none"
      />
      <kbd className="border-border text-muted-foreground rounded border px-1.5 py-0.5 font-sans text-[0.625rem]">
        Ctrl+K
      </kbd>
    </form>
  );
}
