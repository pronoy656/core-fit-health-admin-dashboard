"use client";

import {
  Activity,
  BarChart3,
  Bell,
  Megaphone,
  BookOpen,
  CreditCard,
  Dumbbell,
  FlaskConical,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Users,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from "@/components/ui/sidebar";
import { useAdminProfile, useLogout } from "@/hooks/use-auth";

import { Button } from "../ui";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const data = {
  info: {
    title: "CoreFit Health",
    subtitle: "Admin Dashboard"
  },
  navMain: [
    {
      title: "Platform",
      items: [
        { title: "Overview", url: "/overview", icon: LayoutDashboard },
        { title: "User Management", url: "/users", icon: Users },
        { title: "Membership", url: "/membership", icon: CreditCard },
        { title: "Analytics", url: "/analytics", icon: BarChart3 }
      ]
    },
    {
      title: "Content & Comm",
      items: [
        { title: "Legal Pages", url: "/legal", icon: Shield },
        { title: "Education Blogs", url: "/education-blogs", icon: BookOpen },
        { 
          title: "Help & Support",  
          url: "/support", 
          icon: HeartHandshake,
          items: [
            { title: "Support Tickets", url: "/support/tickets" },
            { title: "User Feedback", url: "/feedback" },
            { title: "FAQ Management", url: "/faqs" }
          ]
        },
        { title: "Broadcasts", url: "/notifications/broadcasts", icon: Megaphone }
      ]
    },
    {
      title: "Health & Fitness",
      items: [
        { title: "Fitness Tracking", url: "/fitness", icon: Dumbbell },
        { title: "Lab Results", url: "/lab-results", icon: FlaskConical },
        { title: "Metabolic Index", url: "/metabolic-index", icon: Activity }
      ]
    },
    {
      title: "System",
      items: [{ title: "Settings", url: "/settings", icon: Settings }]
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: profile } = useAdminProfile();
  const { logout } = useLogout();

  const adminName = profile?.name || "System Admin";
  const adminEmail = profile?.email || "admin@example.com";
  const adminInitials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="transition-all duration-300 ease-in-out"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src="/logo.svg" alt="Logo" width={32} height={32} />
                </div>
                <div className="grid flex-1 text-sm leading-tight">
                  <span className="truncate text-sm font-bold">{data.info.title}</span>
                  <span className="truncate text-xs font-semibold sidebar-accent-foreground">
                    {data.info.subtitle}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  item.items ? (
                    <Collapsible key={item.title} asChild defaultOpen={pathname.startsWith(item.url)} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title} className="w-full">
                            <item.icon />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.url}
                                >
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        className="data-[active=true]:bg-sidebar-accent data-[active=true]:shadow-md data-[active=true]:backdrop-blur-sm data-[active=true]:sidebar-accent-foreground"
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="space-y-4">
            {/* Collapsed Icon state */}
            <div className="hidden flex-col items-center gap-4 group-data-[collapsible=icon]:flex">
              <Avatar size="lg" className="h-8 w-8">
                <AvatarImage src={profile?.avatar || "https://github.com/shadcn.png"} />
                <AvatarFallback>{adminInitials}</AvatarFallback>
              </Avatar>
            </div>

            {/* Expanded State with real Admin info */}
            <div className="group-data-[collapsible=icon]:hidden">
              <div className="flex items-center justify-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-2">
                <Avatar size="lg" className="size-9 ring-2 ring-primary/20">
                  <AvatarImage src={profile?.avatar || "https://github.com/shadcn.png"} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {adminInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h2 className="truncate text-sm font-semibold">{adminName}</h2>
                    <span className="inline-flex items-center rounded-sm bg-primary/15 px-1 py-0.2 text-[10px] font-semibold text-primary">
                      {profile?.role || "ADMIN"}
                    </span>
                  </div>
                  <h3 className="truncate text-xs text-muted-foreground">{adminEmail}</h3>
                </div>
              </div>
            </div>

            {/* Logout button */}
            <SidebarMenuButton asChild className="group-data-[collapsible=icon]:w-full">
              <Button
                variant="outline"
                onClick={logout}
                className="w-full justify-center bg-transparent border-border/80 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 group-data-[collapsible=icon]:p-0"
              >
                <LogOut className="size-4 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
                <span className="group-data-[collapsible=icon]:hidden font-medium">Sign Out</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
