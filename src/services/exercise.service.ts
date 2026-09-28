import { api } from "@/lib/api";
import {
  ICreateExercisePayload,
  IExerciseListResponse,
  ISingleExerciseResponse,
  IUpdateExercisePayload,
  TEquipmentType,
  TMuscleGroup
} from "@/types/exercise";

export interface GetExercisesParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  muscleGroup?: TMuscleGroup | string;
  equipment?: TEquipmentType | string;
}

export const exerciseService = {
  // 1. Admin: Get All Exercises
  getAllExercises: async (params?: GetExercisesParams): Promise<IExerciseListResponse> => {
    const response = await api.get<IExerciseListResponse>("/exercises", {
      params
    });
    return response.data;
  },

  // 2. Admin: Get Exercise By ID
  getExerciseById: async (id: string): Promise<ISingleExerciseResponse> => {
    const response = await api.get<ISingleExerciseResponse>(`/exercises/${id}`);
    return response.data;
  },

  // 3. Admin: Create an Exercise
  createExercise: async (payload: ICreateExercisePayload): Promise<ISingleExerciseResponse> => {
    const response = await api.post<ISingleExerciseResponse>("/exercises", payload);
    return response.data;
  },

  // 4. Admin: Update an Exercise
  updateExercise: async (
    id: string,
    payload: IUpdateExercisePayload
  ): Promise<ISingleExerciseResponse> => {
    const response = await api.patch<ISingleExerciseResponse>(`/exercises/${id}`, payload);
    return response.data;
  },

  // 5. Admin: Delete an Exercise
  deleteExercise: async (id: string): Promise<{ success: boolean; message?: string }> => {
    const response = await api.delete<{ success: boolean; message?: string }>(`/exercises/${id}`);
    return response.data;
  }
};
