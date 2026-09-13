import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { env } from "@/env";
import { getAccessToken, removeAccessToken } from "@/lib/cookie-client";

// Create Axios Instance
export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

// Request Interceptor: Attach Bearer Token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle Global Errors & 401 Logout
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errorMessages?: Array<{ message: string }> }>) => {
    if (axios.isAxiosError(error)) {
      // 401 Unauthorized handling
      if (error.response?.status === 401) {
        removeAccessToken();
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }

    return Promise.reject(new AxiosError("An unexpected error occurred. Please try again."));
  }
);

export type ApiRequestConfig = AxiosRequestConfig & { signal?: AbortSignal };

export const get = async <T>(url: string, config?: ApiRequestConfig) =>
  (await api.get<T>(url, config)).data;

export const post = async <T, B = unknown>(url: string, body?: B, config?: ApiRequestConfig) =>
  (await api.post<T>(url, body, config)).data;

export const put = async <T, B = unknown>(url: string, body?: B, config?: ApiRequestConfig) =>
  (await api.put<T>(url, body, config)).data;

export const patch = async <T, B = unknown>(url: string, body?: B, config?: ApiRequestConfig) =>
  (await api.patch<T>(url, body, config)).data;

export const del = async <T>(url: string, config?: ApiRequestConfig) =>
  (await api.delete<T>(url, config)).data;
