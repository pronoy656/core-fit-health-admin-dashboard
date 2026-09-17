import { api } from '@/lib/api';
import { 
  ISupportTicket, 
  ITicketMessage, 
  ITicketStats, 
  TicketPriority, 
  TicketStatus,
  TicketCategory
} from '@/types/support-ticket';

export interface ISupportTicketListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: ISupportTicket[];
}

export interface ISupportTicketStatsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ITicketStats;
}

export interface ISingleSupportTicketResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ISupportTicket;
}

export interface ITicketMessagesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: ITicketMessage[];
}

export interface IReplyResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    ticket: ISupportTicket;
    message: ITicketMessage;
  };
}

export const supportTicketsService = {
  // Admin: List All Tickets
  getAllTickets: async (params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    category?: TicketCategory | string;
    status?: TicketStatus | string;
    priority?: TicketPriority | string;
    sort?: string;
  }): Promise<ISupportTicketListResponse> => {
    const response = await api.get<ISupportTicketListResponse>('/support-tickets/admin/list', {
      params,
    });
    return response.data;
  },

  // Admin: Get Analytics & Stats
  getStats: async (): Promise<ISupportTicketStatsResponse> => {
    const response = await api.get<ISupportTicketStatsResponse>('/support-tickets/admin/stats');
    return response.data;
  },

  // Get Ticket Details
  getTicketById: async (ticketId: string): Promise<ISingleSupportTicketResponse> => {
    const response = await api.get<ISingleSupportTicketResponse>(`/support-tickets/${ticketId}`);
    return response.data;
  },

  // Get Ticket Messages
  getTicketMessages: async (
    ticketId: string, 
    params?: { page?: number; limit?: number; sort?: string }
  ): Promise<ITicketMessagesResponse> => {
    const response = await api.get<ITicketMessagesResponse>(`/support-tickets/${ticketId}/messages`, {
      params,
    });
    return response.data;
  },

  // Admin: Update Status
  updateStatus: async (ticketId: string, status: TicketStatus): Promise<{success: boolean, data: ISupportTicket}> => {
    const response = await api.patch<{success: boolean, data: ISupportTicket}>(
      `/support-tickets/admin/${ticketId}/status`, 
      { status }
    );
    return response.data;
  },

  // Admin: Update Priority
  updatePriority: async (ticketId: string, priority: TicketPriority): Promise<{success: boolean, data: ISupportTicket}> => {
    const response = await api.patch<{success: boolean, data: ISupportTicket}>(
      `/support-tickets/admin/${ticketId}/priority`, 
      { priority }
    );
    return response.data;
  },

  // Admin: Assign Ticket
  assignTicket: async (ticketId: string, adminId: string): Promise<{success: boolean, data: ISupportTicket}> => {
    const response = await api.patch<{success: boolean, data: ISupportTicket}>(
      `/support-tickets/admin/${ticketId}/assign`, 
      { adminId }
    );
    return response.data;
  },

  // Reply to Ticket (Supports multipart/form-data for attachments)
  replyToTicket: async (ticketId: string, formData: FormData): Promise<IReplyResponse> => {
    const response = await api.post<IReplyResponse>(
      `/support-tickets/${ticketId}/reply`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }
};
