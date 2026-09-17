import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { supportTicketsService } from "@/services/support-tickets.service";
import { TicketStatus, TicketPriority, TicketCategory } from "@/types/support-ticket";
import { ApiResponse } from "@/types";

export const SUPPORT_TICKETS_KEY = ["support-tickets"] as const;
export const SUPPORT_TICKET_STATS_KEY = ["support-ticket-stats"] as const;
export const SUPPORT_TICKET_MESSAGES_KEY = ["support-ticket-messages"] as const;

export function useAdminSupportTickets(params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: TicketCategory | string;
  status?: TicketStatus | string;
  priority?: TicketPriority | string;
  sort?: string;
}) {
  return useQuery({
    queryKey: [...SUPPORT_TICKETS_KEY, params],
    queryFn: () => supportTicketsService.getAllTickets(params),
  });
}

export function useSupportTicketStats() {
  return useQuery({
    queryKey: SUPPORT_TICKET_STATS_KEY,
    queryFn: () => supportTicketsService.getStats(),
  });
}

export function useSupportTicket(ticketId: string) {
  return useQuery({
    queryKey: [...SUPPORT_TICKETS_KEY, ticketId],
    queryFn: () => supportTicketsService.getTicketById(ticketId),
    enabled: !!ticketId,
  });
}

export function useSupportTicketMessages(
  ticketId: string, 
  params?: { page?: number; limit?: number; sort?: string }
) {
  return useQuery({
    queryKey: [...SUPPORT_TICKET_MESSAGES_KEY, ticketId, params],
    queryFn: () => supportTicketsService.getTicketMessages(ticketId, params),
    enabled: !!ticketId,
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      supportTicketsService.updateStatus(id, status),
    onSuccess: (res, { id }) => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_TICKETS_KEY });
      queryClient.invalidateQueries({ queryKey: SUPPORT_TICKET_STATS_KEY });
      toast.success("Ticket status updated successfully");
    },
    onError: (error) => {
      handleApiError(error, "Failed to update ticket status");
    }
  });
}

export function useUpdateTicketPriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, priority }: { id: string; priority: TicketPriority }) =>
      supportTicketsService.updatePriority(id, priority),
    onSuccess: (res, { id }) => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_TICKETS_KEY });
      queryClient.invalidateQueries({ queryKey: SUPPORT_TICKET_STATS_KEY });
      toast.success("Ticket priority updated successfully");
    },
    onError: (error) => {
      handleApiError(error, "Failed to update ticket priority");
    }
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, adminId }: { id: string; adminId: string }) =>
      supportTicketsService.assignTicket(id, adminId),
    onSuccess: (res, { id }) => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_TICKETS_KEY });
      toast.success("Ticket assigned successfully");
    },
    onError: (error) => {
      handleApiError(error, "Failed to assign ticket");
    }
  });
}

export function useReplyToTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      supportTicketsService.replyToTicket(id, formData),
    onSuccess: (res, { id }) => {
      queryClient.invalidateQueries({ queryKey: [...SUPPORT_TICKET_MESSAGES_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [...SUPPORT_TICKETS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: SUPPORT_TICKETS_KEY }); // To update list's lastReplyAt
      queryClient.invalidateQueries({ queryKey: SUPPORT_TICKET_STATS_KEY });
      // We don't want to spam toast for every message, maybe leave silent on success
    },
    onError: (error) => {
      handleApiError(error, "Failed to send reply");
    }
  });
}

// Helper for error handling
function handleApiError(error: unknown, defaultMessage: string) {
  if (isAxiosError<ApiResponse<unknown>>(error)) {
    const errorData = error.response?.data;
    const msg = errorData?.errorMessages?.[0]?.message || errorData?.message || defaultMessage;
    toast.error(msg);
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error(defaultMessage);
  }
}
