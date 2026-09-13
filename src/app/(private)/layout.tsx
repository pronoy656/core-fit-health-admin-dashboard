import { AppSidebar } from "@/components/layouts/app-sidebar";
import { NotificationDropdown } from "@/components/layouts/notification-dropdown";
import { UserNav } from "@/components/layouts/user-nav";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between px-6 border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-2 transition-colors hover:bg-accent hover:text-accent-foreground" />
            <Separator orientation="vertical" className="h-6 opacity-50" />
            <div className="font-semibold text-sm tracking-tight text-foreground/90 hidden sm:block">
              Admin Dashboard
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <UserNav />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 overflow-y-hidden rounded-xl bg-background p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
