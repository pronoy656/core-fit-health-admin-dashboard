import { get, post } from "@/lib/api";
import { removeAccessToken, setAccessToken } from "@/lib/cookie-client";
import { AdminProfile, LoginPayload, LoginResponse, ProfileResponse } from "@/types";

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await post<LoginResponse, LoginPayload>("/auth/login", payload);
    if (response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response;
  },

  getProfile: async (signal?: AbortSignal): Promise<AdminProfile> => {
    try {
      const res = await get<ProfileResponse>("/auth/me", { signal });
      return res.data;
    } catch {
      // Fallback in case backend exposes it at /users/me
      const res = await get<ProfileResponse>("/users/me", { signal });
      return res.data;
    }
  },

  logout: async (): Promise<void> => {
    removeAccessToken();
  }
};
