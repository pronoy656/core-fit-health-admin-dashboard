import { get, patch, post } from "@/lib/api";
import { ApiResponse } from "@/types";
import {
  GetBroadcastsResponse,
  GetNotificationsResponse,
  SendBroadcastPayload
} from "@/types/notification";

export const notificationService = {
  getNotifications: async (
    limit: number = 10,
    nextCursor?: string | null,
    searchTerm?: string
  ): Promise<GetNotificationsResponse> => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (nextCursor) params.append("nextCursor", nextCursor);
    if (searchTerm) params.append("searchTerm", searchTerm);

    return get<GetNotificationsResponse>(`/notifications/me?${params.toString()}`);
  },

  markAllAsRead: async (): Promise<ApiResponse<{ updated: number }>> => {
    return patch("/notifications/read-all");
  },

  markAsRead: async (notificationId: string): Promise<ApiResponse<null>> => {
    return patch(`/notifications/${notificationId}/read`);
  },

  getBroadcasts: async (
    page: number = 1,
    limit: number = 10,
    searchTerm?: string,
    sortBy: string = "createdAt",
    sortOrder: string = "desc"
  ): Promise<GetBroadcastsResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      sortOrder
    });
    if (searchTerm) params.append("searchTerm", searchTerm);

    return get<GetBroadcastsResponse>(`/notifications/broadcasts?${params.toString()}`);
  },

  sendBroadcast: async (payload: SendBroadcastPayload): Promise<ApiResponse<{ recipientCount: number }>> => {
    return post("/notifications/broadcasts", payload);
  }
};
