export type BlogStatus = 'DRAFT' | 'PUBLISHED';

export type BlogCategory =
  | 'General Health'
  | 'Nutrition'
  | 'Wellness'
  | 'Fasting'
  | 'Medication'
  | 'Lifestyle'
  | string;

export interface IBlogListItem {
  _id: string;
  title: string;
  thumbnail?: string;
  category: BlogCategory;
  status: BlogStatus;
  createdAt: string;
}

export interface IEducationBlog {
  _id: string;
  title: string;
  content: string;
  thumbnail?: string;
  category: BlogCategory;
  readTimeMinutes: number;
  status: BlogStatus;
  publishedAt?: string | null;
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

export interface IBlogListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: IPaginationMeta;
  data: IBlogListItem[];
}

export interface ISingleBlogResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IEducationBlog;
}

export interface ICreateBlogPayload {
  title: string;
  content: string;
  category?: string;
  status?: BlogStatus;
}
