"use client";

import { useEffect, useRef } from "react";
import { Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TopbarProps = {
  onMenuClick: () => void;
  searchPlaceholder?: string;
  onSearch?: (keyword: string) => void;
  actions?: React.ReactNode;
  className?: string;
};

export function Topbar({
  onMenuClick,
  searchPlaceholder = "Tìm kiếm...",
  onSearch,
  actions,
  className,
}: TopbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header
      className={cn(
        "bg-card border-border sticky top-0 z-20 flex h-topbar items-center gap-3 border-b px-3 sm:px-5",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Mở menu"
        onClick={onMenuClick}
      >
        <Menu />
      </Button>

      <div className="min-w-0 flex-1 lg:pl-3">
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch?.(inputRef.current?.value.trim() ?? "");
          }}
          className="border-input bg-card focus-within:border-primary focus-within:ring-primary/15 hidden h-8 w-72 items-center gap-2 rounded-lg border px-2.5 transition focus-within:ring-2 md:flex"
        >
          <Search className="text-muted-foreground size-3.5 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            aria-label={searchPlaceholder}
            placeholder={searchPlaceholder}
            className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-xs outline-none"
          />
          <kbd className="border-border text-muted-foreground rounded border px-1.5 py-0.5 font-sans text-[0.625rem]">
            Ctrl+K
          </kbd>
        </form>
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}
