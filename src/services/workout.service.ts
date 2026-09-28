import { IExercise } from "@/types/exercise";
import {
  ICreateWorkoutPayload,
  IWorkout,
  IWorkoutLog,
  IWorkoutProgram,
  WorkoutStats
} from "@/types/workout";
import {
  mockExercisesList,
  mockWorkoutsList,
  mockWorkoutProgramsList,
  mockWorkoutLogsList,
  mockWorkoutStatsData
} from "@/data/mock/workouts";

// Local in-memory state for mock CRUD persistence during session
let inMemoryWorkouts: IWorkout[] = [...mockWorkoutsList];
let inMemoryExercises: IExercise[] = [...mockExercisesList];
const inMemoryPrograms: IWorkoutProgram[] = [...mockWorkoutProgramsList];
const inMemoryLogs: IWorkoutLog[] = [...mockWorkoutLogsList];

export interface GetWorkoutsParams {
  searchTerm?: string;
  category?: string;
  difficulty?: string;
  status?: string;
  muscleGroup?: string;
}

export const workoutService = {
  getWorkouts: async (params?: GetWorkoutsParams): Promise<{ data: IWorkout[]; total: number }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    let results = [...inMemoryWorkouts];

    if (params?.searchTerm) {
      const q = params.searchTerm.toLowerCase();
      results = results.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q) ||
          w.muscleGroups.some((m) => m.toLowerCase().includes(q))
      );
    }

    if (params?.category && params.category !== "All") {
      results = results.filter((w) => w.category === params.category);
    }

    if (params?.difficulty && params.difficulty !== "All") {
      results = results.filter((w) => w.difficulty === params.difficulty);
    }

    if (params?.status && params.status !== "All") {
      results = results.filter((w) => w.status === params.status);
    }

    if (params?.muscleGroup && params.muscleGroup !== "All") {
      results = results.filter((w) =>
        w.muscleGroups.some((m) => m.toLowerCase() === params.muscleGroup?.toLowerCase())
      );
    }

    return {
      data: results,
      total: results.length
    };
  },

  getWorkoutById: async (id: string): Promise<IWorkout | null> => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const workout = inMemoryWorkouts.find((w) => w.id === id);
    return workout || null;
  },

  createWorkout: async (payload: ICreateWorkoutPayload): Promise<IWorkout> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newWorkout: IWorkout = {
      ...payload,
      id: `wk_${Date.now()}`,
      slug: payload.slug || payload.title.toLowerCase().replace(/\s+/g, "-"),
      completionsCount: 0,
      rating: 5.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    inMemoryWorkouts.unshift(newWorkout);
    return newWorkout;
  },

  updateWorkout: async (id: string, payload: Partial<IWorkout>): Promise<IWorkout> => {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const index = inMemoryWorkouts.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new Error("Workout not found");
    }

    inMemoryWorkouts[index] = {
      ...inMemoryWorkouts[index],
      ...payload,
      updatedAt: new Date().toISOString()
    };

    return inMemoryWorkouts[index];
  },

  deleteWorkout: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    inMemoryWorkouts = inMemoryWorkouts.filter((w) => w.id !== id);
    return true;
  },

  duplicateWorkout: async (id: string): Promise<IWorkout> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const original = inMemoryWorkouts.find((w) => w.id === id);
    if (!original) throw new Error("Workout not found");

    const duplicated: IWorkout = {
      ...original,
      id: `wk_${Date.now()}`,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      status: "draft",
      completionsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    inMemoryWorkouts.unshift(duplicated);
    return duplicated;
  },

  // Exercise database operations
  getExercises: async (params?: { search?: string; muscleGroup?: string; equipment?: string }): Promise<IExercise[]> => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    let list = [...inMemoryExercises];

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (ex) =>
          ex.name.toLowerCase().includes(q) ||
          ex.muscleGroup.toLowerCase().includes(q)
      );
    }

    if (params?.muscleGroup && params.muscleGroup !== "All") {
      list = list.filter((ex) => ex.muscleGroup.toLowerCase() === params.muscleGroup?.toLowerCase());
    }

    if (params?.equipment && params.equipment !== "All") {
      list = list.filter((ex) => ex.equipment.toLowerCase().includes(params.equipment?.toLowerCase() || ""));
    }

    return list;
  },

  createExercise: async (payload: Omit<IExercise, "_id" | "createdAt" | "updatedAt">): Promise<IExercise> => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const newEx: IExercise = {
      ...payload,
      _id: `ex_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    inMemoryExercises.unshift(newEx);
    return newEx;
  },

  updateExercise: async (id: string, payload: Partial<IExercise>): Promise<IExercise> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = inMemoryExercises.findIndex((ex) => ex._id === id);
    if (index === -1) throw new Error("Exercise not found");

    inMemoryExercises[index] = {
      ...inMemoryExercises[index],
      ...payload,
      updatedAt: new Date().toISOString()
    };
    return inMemoryExercises[index];
  },

  deleteExercise: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    inMemoryExercises = inMemoryExercises.filter((ex) => ex._id !== id);
    return true;
  },

  // Programs & splits
  getWorkoutPrograms: async (): Promise<IWorkoutProgram[]> => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...inMemoryPrograms];
  },

  // User completion activity logs
  getWorkoutLogs: async (): Promise<IWorkoutLog[]> => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...inMemoryLogs];
  },

  // Statistics
  getWorkoutStats: async (): Promise<WorkoutStats> => {
    return {
      ...mockWorkoutStatsData,
      totalWorkouts: inMemoryWorkouts.length,
      activeWorkouts: inMemoryWorkouts.filter((w) => w.status === "active").length,
      totalExercises: inMemoryExercises.length
    };
  }
};
