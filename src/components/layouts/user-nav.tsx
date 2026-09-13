"use client";

import { LogOut, Settings } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAdminProfile, useLogout } from "@/hooks/use-auth";

export function UserNav() {
  const { data: profile } = useAdminProfile();
  const { logout } = useLogout();

  const adminName = profile?.name || "System Admin";
  const adminEmail = profile?.email || "admin@example.com";
  const adminRole = profile?.role || "ADMIN";
  const adminInitials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full outline-none ring-2 ring-primary/20 transition hover:ring-primary/40 focus-visible:ring-primary"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar || "https://github.com/shadcn.png"} alt={adminName} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {adminInitials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold leading-none">{adminName}</p>
              <span className="inline-flex items-center rounded-sm bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {adminRole}
              </span>
            </div>
            <p className="text-xs leading-none text-muted-foreground">{adminEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
              <Settings className="size-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
