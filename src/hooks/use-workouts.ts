import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { workoutService, GetWorkoutsParams } from "@/services/workout.service";
import { ICreateWorkoutPayload, IWorkout } from "@/types/workout";

export const WORKOUTS_QUERY_KEY = ["workouts"] as const;
export const PROGRAMS_QUERY_KEY = ["workout-programs"] as const;
export const WORKOUT_LOGS_QUERY_KEY = ["workout-logs"] as const;
export const WORKOUT_STATS_QUERY_KEY = ["workout-stats"] as const;

export function useWorkouts(params?: GetWorkoutsParams) {
  return useQuery({
    queryKey: [...WORKOUTS_QUERY_KEY, params],
    queryFn: () => workoutService.getWorkouts(params)
  });
}

export function useWorkout(id?: string) {
  return useQuery({
    queryKey: [...WORKOUTS_QUERY_KEY, id],
    queryFn: () => (id ? workoutService.getWorkoutById(id) : null),
    enabled: !!id
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateWorkoutPayload) =>
      workoutService.createWorkout(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: WORKOUTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WORKOUT_STATS_QUERY_KEY });
      toast.success(`Workout "${data.title}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create workout");
    }
  });
}

export function useUpdateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<IWorkout> }) =>
      workoutService.updateWorkout(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: WORKOUTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WORKOUT_STATS_QUERY_KEY });
      toast.success(`Workout "${data.title}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update workout");
    }
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workoutService.deleteWorkout(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKOUTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WORKOUT_STATS_QUERY_KEY });
      toast.success("Workout routine deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete workout");
    }
  });
}

export function useDuplicateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workoutService.duplicateWorkout(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: WORKOUTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WORKOUT_STATS_QUERY_KEY });
      toast.success(`Duplicated as "${data.title}"`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to duplicate workout");
    }
  });
}

// Programs & Logs & Stats hooks
export function useWorkoutPrograms() {
  return useQuery({
    queryKey: PROGRAMS_QUERY_KEY,
    queryFn: () => workoutService.getWorkoutPrograms()
  });
}

export function useWorkoutLogs() {
  return useQuery({
    queryKey: WORKOUT_LOGS_QUERY_KEY,
    queryFn: () => workoutService.getWorkoutLogs()
  });
}

export function useWorkoutStats() {
  return useQuery({
    queryKey: WORKOUT_STATS_QUERY_KEY,
    queryFn: () => workoutService.getWorkoutStats()
  });
}
