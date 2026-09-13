import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { notificationService } from "@/services";
import { ApiResponse } from "@/types";
import { GetNotificationsResponse, SendBroadcastPayload } from "@/types/notification";

export const NOTIFICATIONS_QUERY_KEY = ["notifications", "me"] as const;
export const BROADCASTS_QUERY_KEY = ["notifications", "broadcasts"] as const;

export function useNotifications(limit: number = 10, searchTerm?: string) {
  return useInfiniteQuery<GetNotificationsResponse, Error>({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, limit, searchTerm],
    queryFn: ({ pageParam }) => notificationService.getNotifications(limit, pageParam as string, searchTerm),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.meta.hasNext ? lastPage.meta.nextCursor : undefined),
    staleTime: 1000 * 60 * 2 // 2 mins
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onMutate: async (notificationId) => {
      // Optimistically update read status
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      const previousData = queryClient.getQueriesData<GetNotificationsResponse>({ queryKey: NOTIFICATIONS_QUERY_KEY });

      queryClient.setQueriesData({ queryKey: NOTIFICATIONS_QUERY_KEY }, (old: any) => {
        if (!old || !old.pages) return old;
        let updatedCount = false;
        
        const newPages = old.pages.map((page: any) => {
          const newData = page.data.map((item: any) => {
            if (item.id === notificationId && !item.isRead) {
              updatedCount = true;
              return { ...item, isRead: true };
            }
            return item;
          });
          
          return {
            ...page,
            data: newData,
            meta: {
              ...page.meta,
              unreadCount: updatedCount ? Math.max(0, page.meta.unreadCount - 1) : page.meta.unreadCount
            }
          };
        });

        return { ...old, pages: newPages };
      });

      return { previousData };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      toast.error("Failed to mark notification as read");
    }
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: (res) => {
      queryClient.setQueriesData({ queryKey: NOTIFICATIONS_QUERY_KEY }, (old: any) => {
        if (!old || !old.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((item: any) => ({ ...item, isRead: true })),
            meta: { ...page.meta, unreadCount: 0 }
          }))
        };
      });
      toast.success(res.message || "All notifications marked as read");
    },
    onError: () => {
      toast.error("Failed to mark all notifications as read");
    }
  });
}

export function useBroadcasts(page: number = 1, limit: number = 10, searchTerm?: string) {
  return useQuery({
    queryKey: [...BROADCASTS_QUERY_KEY, page, limit, searchTerm],
    queryFn: () => notificationService.getBroadcasts(page, limit, searchTerm)
  });
}

export function useSendBroadcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendBroadcastPayload) => notificationService.sendBroadcast(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: BROADCASTS_QUERY_KEY });
      toast.success(res.message || `Broadcast sent to ${res.data?.recipientCount || "users"}`);
    },
    onError: (error) => {
      if (isAxiosError<ApiResponse<unknown>>(error)) {
        const errorData = error.response?.data;
        const msg = errorData?.errorMessages?.[0]?.message || errorData?.message || error.message || "Failed to send broadcast";
        toast.error(msg);
      } else {
        toast.error(error.message || "Failed to send broadcast");
      }
    }
  });
}
