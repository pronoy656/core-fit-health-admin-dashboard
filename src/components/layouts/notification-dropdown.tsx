"use client";

import { useRef, useEffect } from "react";
import { Bell, Check, Loader2, Info, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from "@/hooks/use-notifications";
import { NotificationItem } from "@/types/notification";
import { useSocket } from "@/providers/SocketProvider";

export function NotificationDropdown() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useNotifications(10);
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead();
  
  // Connect to socket just to ensure provider triggers
  useSocket();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || !hasNextPage) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isLoading]);

  const allNotifications = data?.pages.flatMap((page) => page.data) || [];
  const unreadCount = data?.pages[0]?.meta.unreadCount || 0;

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9">
          <Bell className="size-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground border border-background">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 sm:w-96">
        <div className="flex items-center justify-between p-4 pb-3">
          <DropdownMenuLabel className="font-semibold p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-0 text-xs text-primary hover:bg-transparent hover:underline"
              onClick={(e) => {
                e.preventDefault();
                markAllAsRead();
              }}
              disabled={isMarkingAll}
            >
              <Check className="mr-1 size-3" />
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuGroup className="max-h-[380px] overflow-y-auto">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : allNotifications.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center text-center p-4">
              <Bell className="size-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs text-muted-foreground mt-1">When you get notifications, they'll show up here.</p>
            </div>
          ) : (
            allNotifications.map((notification) => {
              const isWarning = notification.type === "SYSTEM" || notification.title?.toLowerCase().includes("high");
              
              return (
                <div 
                  key={notification.id} 
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b last:border-b-0
                    ${!notification.isRead ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50"}`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5
                    ${isWarning ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}
                  >
                    {isWarning ? <AlertTriangle className="size-4" /> : <Info className="size-4" />}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className={`text-sm leading-tight break-words ${!notification.isRead ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>
                      {notification.schemaVersion === 0 ? notification.title : notification.type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {notification.schemaVersion === 0 ? notification.text : "You have a new update."}
                    </p>
                    <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          {isFetchingNextPage && (
            <div className="flex h-12 items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          )}
          {/* Intersection observer target */}
          <div ref={loadMoreRef} className="h-px w-full" />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
