export type UserRole = 'USER' | 'ADMIN';

export type UserStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'RESTRICTED'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'DELETED';

export type EngagementLevel = 'low' | 'medium' | 'high';

export interface IAdminUserListItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  emailVerified: boolean;
  subscriptionStatus: string;
  plan: string;
  subscribedAt?: string;
  nextBillingAt?: string;
  totalSymptomLogs: number;
  totalMealLogs: number;
  totalAiSessions: number;
  engagement: EngagementLevel;
  currentStreak: number;
  createdAt: string;
  lastActiveAt?: string;
}

export interface IUserDossier extends IAdminUserListItem {
  dateOfBirth?: string;
  location?: string;
  trialEndsAt?: string | null;
  cancelledAt?: string | null;
}

export interface IMetricValue {
  value: number;
  changePct: number;
  direction: 'up' | 'down' | 'neutral';
}

export interface IUserDashboardMetrics {
  meta: {
    comparisonPeriod: string;
  };
  totalUsers: IMetricValue;
  activeUsers: IMetricValue;
  pendingUsers: IMetricValue;
  suspendedUsers: IMetricValue;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IAdminUserListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: IPaginationMeta;
  data: IAdminUserListItem[];
}

export interface IUserDossierResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IUserDossier;
}

export interface IUserMetricsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IUserDashboardMetrics;
}

export interface IAdminUpdateUserPayload {
  name?: string;
  email?: string;
  dateOfBirth?: string;
  status?: UserStatus;
  role?: UserRole;
}
