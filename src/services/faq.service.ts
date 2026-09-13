import { api } from "@/lib/api";
import {
  IFaqListResponse,
  ISingleFaqResponse,
  ICreateFaqPayload,
} from "@/types/faq";

export const faqService = {
  getFaqs: async (params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    category?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<IFaqListResponse> => {
    const response = await api.get<IFaqListResponse>('/faqs', { params });
    return response.data;
  },

  getFaqById: async (faqId: string): Promise<ISingleFaqResponse> => {
    const response = await api.get<ISingleFaqResponse>(`/faqs/${faqId}`);
    return response.data;
  },

  createFaq: async (payload: ICreateFaqPayload): Promise<ISingleFaqResponse> => {
    const response = await api.post<ISingleFaqResponse>('/faqs', payload);
    return response.data;
  },

  updateFaq: async (faqId: string, payload: Partial<ICreateFaqPayload>): Promise<ISingleFaqResponse> => {
    const response = await api.patch<ISingleFaqResponse>(`/faqs/${faqId}`, payload);
    return response.data;
  },

  deleteFaq: async (faqId: string): Promise<void> => {
    await api.delete(`/faqs/${faqId}`);
  }
};
