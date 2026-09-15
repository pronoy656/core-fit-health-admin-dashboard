import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { removeAccessToken } from "@/lib/cookie-client";

import { adminProfileService } from "@/services/admin-profile.service";
import { IUpdateProfilePayload, IChangePasswordPayload, IApiResponse } from "@/types/adminProfile";

export const ADMIN_PROFILE_QUERY_KEY = ["admin-profile"] as const;

export function useGetAdminProfile() {
  return useQuery({
    queryKey: ADMIN_PROFILE_QUERY_KEY,
    queryFn: () => adminProfileService.getAdminProfile()
  });
}

export function useUpdateAdminProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateProfilePayload) => 
      adminProfileService.updateAdminProfile(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PROFILE_QUERY_KEY });
      toast.success(res.message || "Profile updated successfully");
    },
    onError: (error: any) => {
      if (isAxiosError<IApiResponse>(error)) {
        const errorData = error.response?.data;
        const msg = errorData?.errorMessages?.[0]?.message || errorData?.message || "Failed to update profile";
        toast.error(msg);
      } else {
        toast.error(error.message || "Failed to update profile");
      }
    }
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: IChangePasswordPayload) => 
      adminProfileService.changePassword(payload),
    onSuccess: (res) => {
      toast.success(res.message || "Password changed successfully. Please login again.");
      removeAccessToken();
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    },
    onError: (error: any) => {
      if (isAxiosError<IApiResponse>(error)) {
        const errorData = error.response?.data;
        const msg = errorData?.errorMessages?.[0]?.message || errorData?.message || "Failed to change password";
        toast.error(msg);
      } else {
        toast.error(error.message || "Failed to change password");
      }
    }
  });
}
