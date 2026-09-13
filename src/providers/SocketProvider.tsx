"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { env } from "@/env";
import { getAccessToken } from "@/lib/cookie-client";
import { NOTIFICATIONS_QUERY_KEY } from "@/hooks/use-notifications";
import { NotificationItem } from "@/types/notification";

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    // Remove /api/v1 from baseURL if it exists to get the root domain for socket
    const baseUrl = env.NEXT_PUBLIC_API_URL || "http://localhost:5004/api/v1";
    let socketUrl = baseUrl;
    try {
      const url = new URL(baseUrl);
      socketUrl = `${url.protocol}//${url.host}`;
    } catch {
      socketUrl = baseUrl.replace(/\/api\/v1\/?$/, "");
    }

    const socketInstance = io(socketUrl, {
      auth: { token: `Bearer ${token}` }
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    socketInstance.on("notification:new", (notification: NotificationItem) => {
      queryClient.setQueriesData({ queryKey: NOTIFICATIONS_QUERY_KEY }, (old: any) => {
        if (!old || !old.pages) return old;
        
        const newPages = [...old.pages];
        if (newPages.length > 0) {
          // Prepend to the first page
          newPages[0] = {
            ...newPages[0],
            data: [notification, ...newPages[0].data],
            meta: {
              ...newPages[0].meta,
              unreadCount: (newPages[0].meta.unreadCount || 0) + 1,
              total: (newPages[0].meta.total || 0) + 1
            }
          };
        }
        return { ...old, pages: newPages };
      });

      const title = notification.schemaVersion === 0 ? notification.title : (notification.type.replace(/_/g, ' '));
      toast.info(`New Notification: ${title || "You have a new alert"}`);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
