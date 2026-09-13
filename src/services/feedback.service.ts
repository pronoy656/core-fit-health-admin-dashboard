import { api } from '@/lib/api';
import {
  IFeedbackListResponse,
  ISingleFeedbackResponse,
  IFeedbackStatsResponse,
  IUpdateFeedbackPayload,
  FeedbackCategory,
  FeedbackStatus,
} from '@/types/feedback';

export const feedbackService = {
  // 1. Admin: Fetch All Feedbacks with Filters
  getAllFeedbacks: async (params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    category?: FeedbackCategory | string;
    status?: FeedbackStatus | string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<IFeedbackListResponse> => {
    const response = await api.get<IFeedbackListResponse>('/feedbacks', {
      params,
    });
    return response.data;
  },

  // 2. Admin: Fetch Feedback Metrics & Stats
  getFeedbackStats: async (): Promise<IFeedbackStatsResponse> => {
    const response = await api.get<IFeedbackStatsResponse>('/feedbacks/stats');
    return response.data;
  },

  // 3. Fetch Single Feedback Detail
  getFeedbackById: async (
    feedbackId: string
  ): Promise<ISingleFeedbackResponse> => {
    const response = await api.get<ISingleFeedbackResponse>(
      `/feedbacks/${feedbackId}`
    );
    return response.data;
  },

  // 4. Admin: Update Status & Admin Response
  updateFeedback: async (
    feedbackId: string,
    payload: IUpdateFeedbackPayload
  ): Promise<ISingleFeedbackResponse> => {
    const response = await api.patch<ISingleFeedbackResponse>(
      `/feedbacks/${feedbackId}`,
      payload
    );
    return response.data;
  },

  // 5. Delete Feedback
  deleteFeedback: async (feedbackId: string): Promise<void> => {
    await api.delete(`/feedbacks/${feedbackId}`);
  }
};
