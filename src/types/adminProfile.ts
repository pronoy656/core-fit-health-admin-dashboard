// Admin Profile Response
export interface IAdminProfile {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  profileImage?: string;
  phone?: string;
  location?: string;
  status: 'active' | 'inactive' | 'suspended';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  dateOfBirth?: string;
}

// Update Profile Payload
export interface IUpdateProfilePayload {
  name?: string;
  phone?: string;
  location?: string;
  dateOfBirth?: string;
  profileImage?: string | File;
}

// Change Password Payload
export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// Standard API Response
export interface IApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  errorMessages?: Array<{ path: string; message: string }>;
}
