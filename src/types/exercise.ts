export type TMuscleGroup =
  | "CHEST"
  | "BACK"
  | "LEGS"
  | "SHOULDERS"
  | "BICEPS"
  | "TRICEPS"
  | "CORE"
  | "CARDIO"
  | "FULL_BODY";

export type TEquipmentType =
  | "BARBELL"
  | "DUMBBELL"
  | "MACHINE"
  | "CABLE"
  | "BODYWEIGHT"
  | "KETTLEBELL"
  | "BAND"
  | "CARDIO_MACHINE"
  | "OTHER";

export interface IExercise {
  _id: string;
  name: string;
  muscleGroup: TMuscleGroup;
  equipment: TEquipmentType;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateExercisePayload {
  name: string;
  muscleGroup: TMuscleGroup;
  equipment: TEquipmentType;
}

export type IUpdateExercisePayload = Partial<ICreateExercisePayload>;

export interface IExercisePaginationMeta {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface IExerciseListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: IExercisePaginationMeta;
  data: IExercise[];
}

export interface ISingleExerciseResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IExercise;
}
