export type WorkoutDifficulty = "Beginner" | "Intermediate" | "Advanced" | "Elite";

export type WorkoutCategory =
  | "Strength & Hypertrophy"
  | "Cardio & HIIT"
  | "Fat Loss"
  | "Flexibility & Mobility"
  | "Calisthenics"
  | "Rehab & Recovery";

export type WorkoutStatus = "active" | "draft" | "archived";

export interface WorkoutExerciseItem {
  id: string;
  exerciseId: string;
  name: string;
  sets: number;
  repsOrDuration: string;
  restSeconds: number;
  targetMuscle: string;
  equipment?: string;
  notes?: string;
}

export interface IWorkout {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: WorkoutCategory;
  difficulty: WorkoutDifficulty;
  durationMinutes: number;
  estimatedCalories: number;
  exercises: WorkoutExerciseItem[];
  equipment: string[];
  muscleGroups: string[];
  coverImage: string;
  status: WorkoutStatus;
  completionsCount: number;
  rating: number;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
}

export type ICreateWorkoutPayload = Omit<
  IWorkout,
  "id" | "slug" | "completionsCount" | "rating" | "createdAt" | "updatedAt"
> & {
  slug?: string;
};


export interface IWorkoutProgramDay {
  dayNumber: number;
  dayName: string;
  isRestDay: boolean;
  workoutId?: string;
  workoutTitle?: string;
  durationMinutes?: number;
  focusArea?: string;
}

export interface IWorkoutProgram {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  durationWeeks: number;
  daysPerWeek: number;
  category: WorkoutCategory;
  difficulty: WorkoutDifficulty;
  enrolledUsersCount: number;
  completionRatePercent: number;
  coverImage: string;
  status: "active" | "draft" | "archived";
  schedule: IWorkoutProgramDay[];
}

export interface IWorkoutLog {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  workoutId: string;
  workoutTitle: string;
  category: WorkoutCategory;
  durationMinutes: number;
  caloriesBurned: number;
  avgHeartRateBpm: number;
  rating: number;
  completedAt: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  activeWorkouts: number;
  totalExercises: number;
  completedSessions: number;
  avgDurationMinutes: number;
  avgCaloriesBurned: number;
}
