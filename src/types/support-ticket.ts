export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REOPENED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TicketCategory = 'BILLING' | 'ACCOUNT' | 'BUG' | 'FEATURE' | 'OTHER';
export type SenderType = 'USER' | 'ADMIN';
export type TicketAttachmentType = 'image' | 'audio' | 'video' | 'file';

export interface ITicketAttachment {
  type: TicketAttachmentType;
  url: string;
  name?: string;
  size?: number;
  mime?: string;
}

export interface ISupportTicket {
  _id: string;
  ticketNumber: string;
  userId: string | { _id: string; name: string; email: string; profileImage?: string };
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  assignedAdminId?: string | { _id: string; name: string; email: string };
  lastReplyAt: string;
  lastReplyBy: SenderType;
  messagesCount: number;
  firstResponseAt?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITicketMessage {
  _id: string;
  ticketId: string;
  senderType: SenderType;
  senderId: string | { _id: string; name: string; email: string; role: string; profileImage?: string };
  message: string;
  attachments?: ITicketAttachment[];
  createdAt: string;
}

export interface ITicketStats {
  total: number;
  openTickets: {
    new: number;
    active: number;
    pending: number;
  };
  awaitingReply: number;
  slaBreaching: number;
  avgFirstResponseHours: number;
  avgResolutionHours: number;
  byStatus: Record<TicketStatus, number>;
  byPriority: Record<TicketPriority, number>;
  byCategory: Record<TicketCategory, number>;
}
