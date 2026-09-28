import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { exerciseService, GetExercisesParams } from "@/services/exercise.service";
import { ICreateExercisePayload, IUpdateExercisePayload } from "@/types/exercise";

export const EXERCISES_QUERY_KEY = ["exercises"] as const;

export function useExercises(params?: GetExercisesParams) {
  return useQuery({
    queryKey: [...EXERCISES_QUERY_KEY, params],
    queryFn: () => exerciseService.getAllExercises(params)
  });
}

export function useExercise(id?: string) {
  return useQuery({
    queryKey: [...EXERCISES_QUERY_KEY, id],
    queryFn: () => (id ? exerciseService.getExerciseById(id) : null),
    enabled: !!id
  });
}

export function useCreateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateExercisePayload) => exerciseService.createExercise(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_QUERY_KEY });
      toast.success(res.message || "Exercise created successfully");
    },
    onError: (error) => {
      if (isAxiosError<{ message?: string; errorMessages?: Array<{ message: string }> }>(error)) {
        const errorData = error.response?.data;
        const msg =
          errorData?.errorMessages?.[0]?.message ||
          errorData?.message ||
          "Failed to create exercise";
        toast.error(msg);
      } else {
        toast.error((error as Error).message || "Failed to create exercise");
      }
    }
  });
}

export function useUpdateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateExercisePayload }) =>
      exerciseService.updateExercise(id, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_QUERY_KEY });
      toast.success(res.message || "Exercise updated successfully");
    },
    onError: (error) => {
      if (isAxiosError<{ message?: string; errorMessages?: Array<{ message: string }> }>(error)) {
        const errorData = error.response?.data;
        const msg =
          errorData?.errorMessages?.[0]?.message ||
          errorData?.message ||
          "Failed to update exercise";
        toast.error(msg);
      } else {
        toast.error((error as Error).message || "Failed to update exercise");
      }
    }
  });
}

export function useDeleteExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => exerciseService.deleteExercise(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_QUERY_KEY });
      toast.success(res.message || "Exercise deleted successfully");
    },
    onError: (error) => {
      if (isAxiosError<{ message?: string; errorMessages?: Array<{ message: string }> }>(error)) {
        const errorData = error.response?.data;
        const msg =
          errorData?.errorMessages?.[0]?.message ||
          errorData?.message ||
          "Failed to delete exercise";
        toast.error(msg);
      } else {
        toast.error((error as Error).message || "Failed to delete exercise");
      }
    }
  });
}
