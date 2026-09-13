import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getAccessToken } from "@/lib/cookie-client";
import { authService } from "@/services/auth.service";
import { AdminProfile, ApiResponse, LoginPayload, LoginResponse } from "@/types";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      toast.success(data.message || "User logged in successfully.");
      router.replace("/overview");
    },
    onError: (error) => {
      if (isAxiosError<ApiResponse<unknown>>(error)) {
        const errorData = error.response?.data;
        const msg =
          errorData?.errorMessages?.[0]?.message ||
          errorData?.message ||
          error.message ||
          "Incorrect email or password. Please try again.";
        toast.error(msg);
      } else {
        toast.error(error.message || "Login failed. Please check your credentials.");
      }
    }
  });
}

export function useAdminProfile() {
  const token = typeof window !== "undefined" ? getAccessToken() : null;

  return useQuery<AdminProfile, Error>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: ({ signal }) => authService.getProfile(signal),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 mins
    retry: 1
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const logout = async () => {
    await authService.logout();
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
    queryClient.clear();
    toast.info("Logged out successfully");
    router.replace("/login");
  };

  return { logout };
}
