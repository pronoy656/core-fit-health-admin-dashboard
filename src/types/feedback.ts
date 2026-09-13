export type FeedbackCategory =
  | 'APP_EXPERIENCE'
  | 'BUG_REPORT'
  | 'FEATURE_REQUEST'
  | 'CONTENT'
  | 'GENERAL';

export type FeedbackStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED';

export interface IFeedbackUser {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface IFeedback {
  _id: string;
  user: IFeedbackUser | string;
  comment: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPaginationMeta {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IFeedbackListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: IPaginationMeta;
  data: IFeedback[];
}

export interface ISingleFeedbackResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IFeedback;
}

export interface ICategoryDistribution {
  _id: FeedbackCategory;
  count: number;
}

export interface IStatusDistribution {
  _id: FeedbackStatus;
  count: number;
}

export interface IFeedbackStats {
  totalFeedbacks: number;
  categoryDistribution: ICategoryDistribution[];
  statusDistribution: IStatusDistribution[];
}

export interface IFeedbackStatsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IFeedbackStats;
}

export interface ICreateFeedbackPayload {
  comment: string;
  category?: FeedbackCategory;
}

export interface IUpdateFeedbackPayload {
  status?: FeedbackStatus;
  adminResponse?: string;
}
