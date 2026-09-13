import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { feedbackService } from "@/services";
import { IUpdateFeedbackPayload, FeedbackCategory, FeedbackStatus } from "@/types/feedback";
import { ApiResponse } from "@/types";

export const FEEDBACKS_QUERY_KEY = ["feedbacks"] as const;
export const FEEDBACK_STATS_QUERY_KEY = ["feedback-stats"] as const;

export function useAllFeedbacks(params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: FeedbackCategory | string;
  status?: FeedbackStatus | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: [...FEEDBACKS_QUERY_KEY, params],
    queryFn: () => feedbackService.getAllFeedbacks(params)
  });
}

export function useFeedbackStats() {
  return useQuery({
    queryKey: FEEDBACK_STATS_QUERY_KEY,
    queryFn: () => feedbackService.getFeedbackStats()
  });
}

export function useFeedback(feedbackId: string) {
  return useQuery({
    queryKey: [...FEEDBACKS_QUERY_KEY, feedbackId],
    queryFn: () => feedbackService.getFeedbackById(feedbackId),
    enabled: !!feedbackId
  });
}

export function useUpdateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateFeedbackPayload }) => 
      feedbackService.updateFeedback(id, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: FEEDBACKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: FEEDBACK_STATS_QUERY_KEY });
      toast.success(res.message || "Feedback updated successfully");
    },
    onError: (error) => {
      if (isAxiosError<ApiResponse<unknown>>(error)) {
        const errorData = error.response?.data;
        const msg = errorData?.errorMessages?.[0]?.message || errorData?.message || "Failed to update feedback";
        toast.error(msg);
      } else {
        toast.error(error.message || "Failed to update feedback");
      }
    }
  });
}

export function useDeleteFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => feedbackService.deleteFeedback(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEEDBACKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: FEEDBACK_STATS_QUERY_KEY });
      toast.success("Feedback deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete feedback");
    }
  });
}
