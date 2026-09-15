import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/cookie-client";
import { env } from "@/env";
import { 
  IAdminProfile, 
  IUpdateProfilePayload, 
  IChangePasswordPayload, 
  IApiResponse 
} from "@/types/adminProfile";

export const adminProfileService = {
  getAdminProfile: async (): Promise<IApiResponse<IAdminProfile>> => {
    const response = await api.get<IApiResponse<IAdminProfile>>('/users/me');
    return response.data as any; // Using custom wrapper, response is actually the data
  },

  updateAdminProfile: async (
    payload: IUpdateProfilePayload
  ): Promise<IApiResponse<IAdminProfile>> => {
    const formData = new FormData();
    if (payload.name) formData.append('name', payload.name);
    if (payload.phone) formData.append('phone', payload.phone);
    if (payload.location) formData.append('location', payload.location);
    if (payload.dateOfBirth) formData.append('dateOfBirth', payload.dateOfBirth);
    if (payload.profileImage && payload.profileImage instanceof File) {
      formData.append('profileImage', payload.profileImage);
    }

    const token = getAccessToken();
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update profile');
    }
    
    return await response.json();
  },

  changePassword: async (
    payload: IChangePasswordPayload
  ): Promise<IApiResponse<null>> => {
    const response = await api.post<IApiResponse<null>>('/auth/change-password', payload);
    return response.data as any;
  },
};
