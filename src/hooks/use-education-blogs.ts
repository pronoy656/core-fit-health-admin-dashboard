import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { educationBlogService } from "@/services";
import { ICreateBlogPayload } from "@/types/educationBlog";
import { ApiResponse } from "@/types";

export const BLOGS_QUERY_KEY = ["education-blogs"] as const;

export function useEducationBlogs(params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: [...BLOGS_QUERY_KEY, params],
    queryFn: () => educationBlogService.getEducationBlogs(params)
  });
}

export function useEducationBlog(blogId: string) {
  return useQuery({
    queryKey: [...BLOGS_QUERY_KEY, blogId],
    queryFn: () => educationBlogService.getEducationBlogById(blogId),
    enabled: !!blogId
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, thumbnail }: { payload: ICreateBlogPayload; thumbnail?: File }) => 
      educationBlogService.createEducationBlog(payload, thumbnail),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: BLOGS_QUERY_KEY });
      toast.success(res.message || "Blog created successfully");
    },
    onError: (error) => {
      if (isAxiosError<ApiResponse<unknown>>(error)) {
        const errorData = error.response?.data;
        const msg = errorData?.errorMessages?.[0]?.message || errorData?.message || "Failed to create blog";
        toast.error(msg);
      } else {
        toast.error(error.message || "Failed to create blog");
      }
    }
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload, thumbnail }: { id: string; payload: Partial<ICreateBlogPayload>; thumbnail?: File }) => 
      educationBlogService.updateEducationBlog(id, payload, thumbnail),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: BLOGS_QUERY_KEY });
      toast.success(res.message || "Blog updated successfully");
    },
    onError: (error) => {
      if (isAxiosError<ApiResponse<unknown>>(error)) {
        const errorData = error.response?.data;
        const msg = errorData?.errorMessages?.[0]?.message || errorData?.message || "Failed to update blog";
        toast.error(msg);
      } else {
        toast.error(error.message || "Failed to update blog");
      }
    }
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => educationBlogService.deleteEducationBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOGS_QUERY_KEY });
      toast.success("Blog deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete blog");
    }
  });
}
