import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { userManagementService } from "@/services";
import { IAdminUpdateUserPayload } from "@/types/userManagement";
import { ApiResponse } from "@/types";

export const USERS_QUERY_KEY = ["users"] as const;
export const USER_METRICS_QUERY_KEY = ["user-metrics"] as const;

export function useAllUsers(params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  email?: string;
  status?: string;
  role?: string;
  isVerified?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, params],
    queryFn: () => userManagementService.getAllUsers(params)
  });
}

export function useUserMetrics() {
  return useQuery({
    queryKey: USER_METRICS_QUERY_KEY,
    queryFn: () => userManagementService.getUserMetrics()
  });
}

export function useUserDossier(userId: string) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, userId],
    queryFn: () => userManagementService.getUserById(userId),
    enabled: !!userId
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IAdminUpdateUserPayload }) => 
      userManagementService.updateUser(id, payload),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_METRICS_QUERY_KEY });
      toast.success(res.message || "User updated successfully");
    },
    onError: (error) => {
      if (isAxiosError<ApiResponse<unknown>>(error)) {
        const errorData = error.response?.data;
        const msg = errorData?.errorMessages?.[0]?.message || errorData?.message || "Failed to update user";
        toast.error(msg);
      } else {
        toast.error(error.message || "Failed to update user");
      }
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userManagementService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_METRICS_QUERY_KEY });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete user");
    }
  });
}
