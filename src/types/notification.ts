export type NotificationType =
  | 'ADMIN'
  | 'SYSTEM'
  | 'CONNECTION_REQUEST'
  | 'CONNECTION_ACCEPTED'
  | 'NEW_MESSAGE'
  | 'QUESTION_ANSWERED'
  | 'NEW_QUESTION'
  | 'POST_LIKED'
  | 'POST_COMMENTED'
  | 'COMMENT_REPLIED'
  | 'CONTENT_LIKED'
  | 'CONTENT_COMMENTED'
  | 'NEW_CONTENT'
  | 'NEW_KHUTBAH'
  | 'MOSQUE_UPDATE';

export interface NotificationActor {
  id: string;
  name: string;
  profileImage: string;
}

export interface NotificationSubject {
  type: string;
  id: string;
  chatId?: string;
}

export interface NotificationAction {
  type: 'ACCEPT' | 'REJECT' | 'VIEW_PROFILE' | string;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  schemaVersion: 0 | 1;

  // Present when schemaVersion === 1
  actor?: NotificationActor | null;
  actions?: NotificationAction[];

  // Present when schemaVersion === 0 (Legacy/Admin)
  title?: string;
  text?: string;
  subject?: NotificationSubject | null;
}

export interface NotificationPaginationMeta {
  limit: number;
  nextCursor: string | null;
  hasNext: boolean;
  unreadCount: number;
}

export interface GetNotificationsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: NotificationPaginationMeta;
  data: NotificationItem[];
}

export interface BroadcastHistoryItem {
  _id: string;
  title: string;
  text: string;
  audience: 'USER' | string;
  recipientCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetBroadcastsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: BroadcastHistoryItem[];
}

export interface SendBroadcastPayload {
  title: string;
  text: string;
  audience: 'USER' | string;
}
