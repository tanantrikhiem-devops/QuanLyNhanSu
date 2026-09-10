"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toRoute } from "@/lib/nav";
import { cn } from "@/lib/utils";

export type UserMenuUser = {
  name: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
};

export type UserMenuProps = {
  user: UserMenuUser;
  /** Các mục thêm vào giữa menu. */
  items?: { key: string; label: string; href?: string; icon?: React.ReactNode; onSelect?: () => void }[];
  onSignOut?: () => void;
  /** Hiện tên + email cạnh avatar (dùng cho footer sidebar). */
  showDetails?: boolean;
  className?: string;
};

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function UserMenu({
  user,
  items,
  onSignOut,
  showDetails = false,
  className,
}: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Menu người dùng"
          className={cn(
            "hover:bg-accent focus-visible:ring-ring/50 flex items-center gap-2.5 rounded-lg p-1 transition-colors outline-none focus-visible:ring-[3px]",
            showDetails && "w-full pr-2",
            className,
          )}
        >
          <Avatar>
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
          {showDetails && (
            <span className="flex min-w-0 flex-col text-left leading-tight">
              <span className="truncate text-sm font-medium">{user.name}</span>
              {(user.role ?? user.email) && (
                <span className="text-muted-foreground truncate text-xs">
                  {user.role ?? user.email}
                </span>
              )}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-foreground text-sm font-medium">{user.name}</span>
          {user.email && <span className="text-muted-foreground text-xs">{user.email}</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {items?.length ? (
          <>
            {items.map((item) =>
              item.href ? (
                <DropdownMenuItem key={item.key} asChild>
                  <Link href={toRoute(item.href)}>
                    {item.icon}
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem key={item.key} onSelect={item.onSelect}>
                  {item.icon}
                  {item.label}
                </DropdownMenuItem>
              ),
            )}
            <DropdownMenuSeparator />
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href={toRoute("/tai-khoan")}>
                <User />
                Tài khoản
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={toRoute("/cai-dat")}>
                <Settings />
                Cài đặt
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem variant="destructive" onSelect={onSignOut}>
          <LogOut />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
