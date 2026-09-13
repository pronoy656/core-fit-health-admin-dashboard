import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { faqService } from "@/services";
import { ICreateFaqPayload } from "@/types/faq";
import { ApiResponse } from "@/types";

export const FAQS_QUERY_KEY = ["faqs"] as const;

export function useFaqs(params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: [...FAQS_QUERY_KEY, params],
    queryFn: () => faqService.getFaqs(params)
  });
}

export function useFaq(faqId: string) {
  return useQuery({
    queryKey: [...FAQS_QUERY_KEY, faqId],
    queryFn: () => faqService.getFaqById(faqId),
    enabled: !!faqId
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateFaqPayload) => faqService.createFaq(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: FAQS_QUERY_KEY });
      toast.success(res.message || "FAQ created successfully");
    },
    onError: (error) => {
      if (isAxiosError<ApiResponse<unknown>>(error)) {
        const errorData = error.response?.data;
        const msg = errorData?.errorMessages?.[0]?.message || errorData?.message || "Failed to create FAQ";
        toast.error(msg);
      } else {
        toast.error(error.message || "Failed to create FAQ");
      }
    }
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ICreateFaqPayload> }) => 
      faqService.updateFaq(id, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: FAQS_QUERY_KEY });
      toast.success(res.message || "FAQ updated successfully");
    },
    onError: (error) => {
      if (isAxiosError<ApiResponse<unknown>>(error)) {
        const errorData = error.response?.data;
        const msg = errorData?.errorMessages?.[0]?.message || errorData?.message || "Failed to update FAQ";
        toast.error(msg);
      } else {
        toast.error(error.message || "Failed to update FAQ");
      }
    }
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => faqService.deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAQS_QUERY_KEY });
      toast.success("FAQ deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete FAQ");
    }
  });
}
