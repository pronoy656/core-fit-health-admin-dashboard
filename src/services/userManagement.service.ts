import { api } from '@/lib/api';
import {
  IAdminUserListResponse,
  IUserMetricsResponse,
  IUserDossierResponse,
  IAdminUpdateUserPayload
} from '@/types/userManagement';

export const userManagementService = {
  // 1. Fetch All Users (Directory Table)
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    email?: string;
    status?: string;
    role?: string;
    isVerified?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<IAdminUserListResponse> => {
    const response = await api.get<IAdminUserListResponse>('/users', { params });
    return response.data;
  },

  // 2. User Dashboard KPIs & Metrics
  getUserMetrics: async (): Promise<IUserMetricsResponse> => {
    const response = await api.get<IUserMetricsResponse>('/users/metrics');
    return response.data;
  },

  // 3. Get Single User Dossier
  getUserById: async (userId: string): Promise<IUserDossierResponse> => {
    const response = await api.get<IUserDossierResponse>(`/users/${userId}`);
    return response.data;
  },

  // 4. Update User by Admin
  updateUser: async (
    userId: string,
    payload: IAdminUpdateUserPayload
  ): Promise<{ success: boolean; message: string; data: any }> => {
    const response = await api.patch(`/users/${userId}`, payload);
    return response.data;
  },

  // 5. Permanently Delete User
  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`);
  }
};
