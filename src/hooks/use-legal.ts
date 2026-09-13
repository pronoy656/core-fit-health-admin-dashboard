import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { legalService } from "@/services/legal.service";
import {
  ApiResponse,
  CreateLegalPayload,
  getLegalId,
  LegalPage,
  LegalPageListItem,
  UpdateLegalPayload
} from "@/types";

export const LEGAL_QUERY_KEYS = {
  all: ["legal"] as const,
  list: () => ["legal", "list"] as const,
  detail: (id: string) => ["legal", "detail", id] as const
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiResponse<unknown>>(error)) {
    const errorData = error.response?.data;
    return (
      errorData?.errorMessages?.[0]?.message ||
      errorData?.message ||
      error.message ||
      fallback
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

/**
 * Hook to fetch all legal pages (summary list)
 */
export function useLegalPages() {
  return useQuery<LegalPageListItem[], Error>({
    queryKey: LEGAL_QUERY_KEYS.list(),
    queryFn: ({ signal }) => legalService.getAll(signal)
  });
}

/**
 * Hook to fetch single legal page by ID
 */
export function useLegalPage(id?: string, options?: { enabled?: boolean }) {
  const cleanId = getLegalId(id);

  return useQuery<LegalPage, Error>({
    queryKey: LEGAL_QUERY_KEYS.detail(cleanId),
    queryFn: ({ signal }) => {
      if (!cleanId) throw new Error("Valid Document ID is required");
      return legalService.getById(cleanId, signal);
    },
    enabled: !!cleanId && (options?.enabled ?? true)
  });
}

/**
 * Hook to create a new legal page
 */
export function useCreateLegalPage() {
  const queryClient = useQueryClient();

  return useMutation<LegalPage, Error, CreateLegalPayload>({
    mutationFn: (payload: CreateLegalPayload) => legalService.create(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: LEGAL_QUERY_KEYS.all });
      toast.success(`"${data.title}" legal page created successfully.`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create legal page. Please try again."));
    }
  });
}

/**
 * Hook to update an existing legal page
 */
export function useUpdateLegalPage() {
  const queryClient = useQueryClient();

  return useMutation<LegalPage, Error, { id: string; payload: UpdateLegalPayload }>({
    mutationFn: ({ id, payload }) => {
      const cleanId = getLegalId(id);
      if (!cleanId) throw new Error("Valid Document ID is required for update");
      return legalService.update(cleanId, payload);
    },
    onSuccess: (data, variables) => {
      const cleanId = getLegalId(variables.id);
      queryClient.invalidateQueries({ queryKey: LEGAL_QUERY_KEYS.all });
      if (cleanId) {
        queryClient.invalidateQueries({ queryKey: LEGAL_QUERY_KEYS.detail(cleanId) });
      }
      toast.success(`"${data.title}" updated successfully.`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update legal page. Please try again."));
    }
  });
}

/**
 * Hook to delete a legal page
 */
export function useDeleteLegalPage() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { id: string; title?: string }>({
    mutationFn: ({ id }) => {
      const cleanId = getLegalId(id);
      if (!cleanId) throw new Error("Valid Document ID is required for deletion");
      return legalService.delete(cleanId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: LEGAL_QUERY_KEYS.all });
      toast.success(
        variables.title
          ? `"${variables.title}" deleted successfully.`
          : "Legal page deleted successfully."
      );
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete legal page. Please try again."));
    }
  });
}
