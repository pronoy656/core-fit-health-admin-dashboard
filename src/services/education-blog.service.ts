import { api } from "@/lib/api";
import {
  IBlogListResponse,
  ISingleBlogResponse,
  ICreateBlogPayload,
} from "@/types/educationBlog";
import { getAccessToken } from "@/lib/cookie-client";
import { env } from "@/env";

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

    const token = getAccessToken();
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/education-blogs`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create blog');
    }
    
    const data = await response.json();
    return data;
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

    const token = getAccessToken();
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/education-blogs/${blogId}`, {
      method: 'PATCH',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update blog');
    }
    
    const data = await response.json();
    return data;
  },

  deleteEducationBlog: async (blogId: string): Promise<void> => {
    await api.delete(`/education-blogs/${blogId}`);
  },
};
