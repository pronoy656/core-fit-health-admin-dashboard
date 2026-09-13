import { api } from "@/lib/api";
import {
  IBlogListResponse,
  ISingleBlogResponse,
  ICreateBlogPayload,
} from "@/types/educationBlog";

export const educationBlogService = {
  getEducationBlogs: async (params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    category?: string;
    status?: 'DRAFT' | 'PUBLISHED';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<IBlogListResponse> => {
    const response = await api.get<IBlogListResponse>('/education-blogs', {
      params,
    });
    return response.data;
  },

  getEducationBlogById: async (blogId: string): Promise<ISingleBlogResponse> => {
    const response = await api.get<ISingleBlogResponse>(`/education-blogs/${blogId}`);
    return response.data;
  },

  createEducationBlog: async (
    payload: ICreateBlogPayload,
    thumbnailFile?: File
  ): Promise<ISingleBlogResponse> => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('content', payload.content);
    if (payload.category) formData.append('category', payload.category);
    if (payload.status) formData.append('status', payload.status);
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

    const response = await api.post<ISingleBlogResponse>('/education-blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateEducationBlog: async (
    blogId: string,
    payload: Partial<ICreateBlogPayload>,
    newThumbnailFile?: File
  ): Promise<ISingleBlogResponse> => {
    const formData = new FormData();
    if (payload.title) formData.append('title', payload.title);
    if (payload.content) formData.append('content', payload.content);
    if (payload.category) formData.append('category', payload.category);
    if (payload.status) formData.append('status', payload.status);
    if (newThumbnailFile) formData.append('thumbnail', newThumbnailFile);

    const response = await api.patch<ISingleBlogResponse>(`/education-blogs/${blogId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteEducationBlog: async (blogId: string): Promise<void> => {
    await api.delete(`/education-blogs/${blogId}`);
  },
};
