export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  errorMessages?: Array<{
    path: string;
    message: string;
  }>;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginData {
  accessToken: string;
  mustChangePassword?: boolean;
  isOnboard?: boolean;
  isApproved?: boolean;
  appState?: string;
}

export interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isVerified?: boolean;
  avatar?: string;
}

export type LoginResponse = ApiResponse<LoginData>;
export type ProfileResponse = ApiResponse<AdminProfile>;
