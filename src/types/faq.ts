export type FaqCategory =
  | 'General'
  | 'Account'
  | 'Fasting'
  | 'Nutrition'
  | 'Subscription'
  | 'Other'
  | string;

export interface IFaq {
  _id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  isActive: boolean;
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

export interface IFaqListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: IPaginationMeta;
  data: IFaq[];
}

export interface ISingleFaqResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IFaq;
}

export interface ICreateFaqPayload {
  question: string;
  answer: string;
  category?: string;
  isActive?: boolean;
}
