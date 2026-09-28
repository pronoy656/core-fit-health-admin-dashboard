import { IExercise } from "@/types/exercise";
import { IWorkout, IWorkoutLog, IWorkoutProgram, WorkoutStats } from "@/types/workout";

export const mockExercisesList: IExercise[] = [
  {
    _id: "ex_01",
    name: "Barbell Back Squat",
    muscleGroup: "LEGS",
    equipment: "BARBELL",
    createdAt: "2024-01-10T10:00:00.000Z",
    updatedAt: "2024-01-10T10:00:00.000Z"
  },
  {
    _id: "ex_02",
    name: "Barbell Bench Press",
    muscleGroup: "CHEST",
    equipment: "BARBELL",
    createdAt: "2024-01-10T10:00:00.000Z",
    updatedAt: "2024-01-10T10:00:00.000Z"
  },
  {
    _id: "ex_03",
    name: "Deadlift",
    muscleGroup: "BACK",
    equipment: "BARBELL",
    createdAt: "2024-01-12T10:00:00.000Z",
    updatedAt: "2024-01-12T10:00:00.000Z"
  },
  {
    _id: "ex_04",
    name: "Pull-Ups",
    muscleGroup: "BACK",
    equipment: "BODYWEIGHT",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z"
  },
  {
    _id: "ex_05",
    name: "Overhead Dumbbell Press",
    muscleGroup: "SHOULDERS",
    equipment: "DUMBBELL",
    createdAt: "2024-01-18T10:00:00.000Z",
    updatedAt: "2024-01-18T10:00:00.000Z"
  },
  {
    _id: "ex_06",
    name: "Incline Dumbbell Fly",
    muscleGroup: "CHEST",
    equipment: "DUMBBELL",
    createdAt: "2024-01-20T10:00:00.000Z",
    updatedAt: "2024-01-20T10:00:00.000Z"
  },
  {
    _id: "ex_07",
    name: "Dumbbell Romanian Deadlift",
    muscleGroup: "LEGS",
    equipment: "DUMBBELL",
    createdAt: "2024-01-22T10:00:00.000Z",
    updatedAt: "2024-01-22T10:00:00.000Z"
  },
  {
    _id: "ex_08",
    name: "Kettlebell Swing",
    muscleGroup: "FULL_BODY",
    equipment: "KETTLEBELL",
    createdAt: "2024-01-25T10:00:00.000Z",
    updatedAt: "2024-01-25T10:00:00.000Z"
  },
  {
    _id: "ex_09",
    name: "Cable Tricep Pushdown",
    muscleGroup: "TRICEPS",
    equipment: "CABLE",
    createdAt: "2024-01-28T10:00:00.000Z",
    updatedAt: "2024-01-28T10:00:00.000Z"
  },
  {
    _id: "ex_10",
    name: "Bicep Curl",
    muscleGroup: "BICEPS",
    equipment: "DUMBBELL",
    createdAt: "2024-02-01T10:00:00.000Z",
    updatedAt: "2024-02-01T10:00:00.000Z"
  }
];

export const mockWorkoutsList: IWorkout[] = [
  {
    id: "wk_01",
    title: "Push Power & Hypertrophy Focus",
    slug: "push-power-hypertrophy-focus",
    description: "High-yield chest, shoulder, and tricep routine built to maximize upper body pressing strength, chest density, and lockout power.",
    category: "Strength & Hypertrophy",
    difficulty: "Intermediate",
    durationMinutes: 45,
    estimatedCalories: 380,
    equipment: ["Barbell & Bench", "Dumbbells", "Cable Machine"],
    muscleGroups: ["Chest", "Shoulders", "Arms"],
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    status: "active",
    completionsCount: 3840,
    rating: 4.9,
    authorName: "Coach Marcus Vance",
    createdAt: "2024-02-01T08:30:00.000Z",
    updatedAt: "2024-02-20T14:15:00.000Z",
    exercises: [
      {
        id: "we_01",
        exerciseId: "ex_02",
        name: "Flat Barbell Bench Press",
        sets: 4,
        repsOrDuration: "8-10 reps",
        restSeconds: 90,
        targetMuscle: "Chest",
        equipment: "Barbell & Bench",
        notes: "Keep shoulder blades retracted. Focus on 2-second eccentric control."
      },
      {
        id: "we_02",
        exerciseId: "ex_05",
        name: "Overhead Dumbbell Shoulder Press",
        sets: 3,
        repsOrDuration: "10-12 reps",
        restSeconds: 75,
        targetMuscle: "Shoulders",
        equipment: "Dumbbells",
        notes: "Full overhead extension without arching the lower spine."
      },
      {
        id: "we_03",
        exerciseId: "ex_06",
        name: "Incline Dumbbell Chest Fly",
        sets: 3,
        repsOrDuration: "12-15 reps",
        restSeconds: 60,
        targetMuscle: "Chest",
        equipment: "Dumbbells & Bench",
        notes: "Get a deep pec stretch at the bottom without over-rotating wrists."
      },
      {
        id: "we_04",
        exerciseId: "ex_12",
        name: "Cable Tricep Pushdown",
        sets: 4,
        repsOrDuration: "12-15 reps",
        restSeconds: 45,
        targetMuscle: "Arms",
        equipment: "Cable Machine & Rope",
        notes: "Burnout on the final set with 5 partial reps."
      }
    ]
  },
  {
    id: "wk_02",
    title: "Pull & Posterior Chain Strength",
    slug: "pull-posterior-chain-strength",
    description: "Heavy back development routine focusing on vertical and horizontal pulls, spinal erectors, and bicep isolation.",
    category: "Strength & Hypertrophy",
    difficulty: "Advanced",
    durationMinutes: 50,
    estimatedCalories: 430,
    equipment: ["Barbell", "Pull-Up Bar", "EZ-Bar"],
    muscleGroups: ["Back", "Arms", "Core"],
    coverImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    status: "active",
    completionsCount: 2950,
    rating: 4.8,
    authorName: "Coach Marcus Vance",
    createdAt: "2024-02-03T11:00:00.000Z",
    updatedAt: "2024-02-18T10:00:00.000Z",
    exercises: [
      {
        id: "we_05",
        exerciseId: "ex_03",
        name: "Conventional Deadlift",
        sets: 4,
        repsOrDuration: "5 reps",
        restSeconds: 120,
        targetMuscle: "Back",
        equipment: "Barbell",
        notes: "Warm up with 2 ramping sets before 4 working sets."
      },
      {
        id: "we_06",
        exerciseId: "ex_04",
        name: "Pull-Ups (Overhand)",
        sets: 4,
        repsOrDuration: "8-12 reps",
        restSeconds: 90,
        targetMuscle: "Back",
        equipment: "Pull-Up Bar",
        notes: "Add weighted belt if bodyweight exceeds 12 reps."
      },
      {
        id: "we_07",
        exerciseId: "ex_11",
        name: "Barbell Bicep Curl",
        sets: 3,
        repsOrDuration: "10-12 reps",
        restSeconds: 60,
        targetMuscle: "Arms",
        equipment: "EZ-Bar",
        notes: "Avoid swinging the hips. Strict elbow pivot."
      },
      {
        id: "we_08",
        exerciseId: "ex_09",
        name: "Hanging Leg Raises",
        sets: 3,
        repsOrDuration: "15 reps",
        restSeconds: 60,
        targetMuscle: "Core",
        equipment: "Pull-Up Bar",
        notes: "Slow eccentric descent."
      }
    ]
  },
  {
    id: "wk_03",
    title: "Lower Body Quad & Glute Hyperdrive",
    slug: "lower-body-quad-glute-hyperdrive",
    description: "Comprehensive leg day focusing on heavy compound squats, single-leg stabilization, and hamstring tension.",
    category: "Strength & Hypertrophy",
    difficulty: "Advanced",
    durationMinutes: 55,
    estimatedCalories: 480,
    equipment: ["Barbell & Rack", "Dumbbells & Bench"],
    muscleGroups: ["Legs", "Core"],
    coverImage: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80",
    status: "active",
    completionsCount: 4210,
    rating: 4.9,
    authorName: "Elena Rostova (CSCS)",
    createdAt: "2024-02-05T09:15:00.000Z",
    updatedAt: "2024-02-22T16:40:00.000Z",
    exercises: [
      {
        id: "we_09",
        exerciseId: "ex_01",
        name: "Barbell Back Squat",
        sets: 5,
        repsOrDuration: "6-8 reps",
        restSeconds: 120,
        targetMuscle: "Legs",
        equipment: "Barbell & Rack",
        notes: "Reach parallel depth. Brace core tight with valsalva maneuver."
      },
      {
        id: "we_10",
        exerciseId: "ex_07",
        name: "Dumbbell Romanian Deadlift",
        sets: 4,
        repsOrDuration: "10-12 reps",
        restSeconds: 90,
        targetMuscle: "Legs",
        equipment: "Dumbbells",
        notes: "Deep hamstring stretch. Neutral spine throughout."
      },
      {
        id: "we_11",
        exerciseId: "ex_13",
        name: "Bulgarian Split Squat",
        sets: 3,
        repsOrDuration: "10 reps / leg",
        restSeconds: 75,
        targetMuscle: "Legs",
        equipment: "Dumbbells & Bench",
        notes: "Drive through front heel."
      }
    ]
  },
  {
    id: "wk_04",
    title: "Metabolic HIIT Torch & Kettlebell Circuit",
    slug: "metabolic-hiit-torch-kettlebell-circuit",
    description: "High-octane conditioning routine engineered to spike calorie expenditure, VO2 max, and functional endurance.",
    category: "Cardio & HIIT",
    difficulty: "Intermediate",
    durationMinutes: 30,
    estimatedCalories: 360,
    equipment: ["Kettlebell", "Treadmill / Track", "Bodyweight"],
    muscleGroups: ["Full Body", "Core"],
    coverImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
    status: "active",
    completionsCount: 5120,
    rating: 4.7,
    authorName: "David Sterling",
    createdAt: "2024-02-08T07:45:00.000Z",
    updatedAt: "2024-02-19T11:20:00.000Z",
    exercises: [
      {
        id: "we_12",
        exerciseId: "ex_10",
        name: "Kettlebell Russian Swings",
        sets: 4,
        repsOrDuration: "20 reps",
        restSeconds: 45,
        targetMuscle: "Full Body",
        equipment: "Kettlebell",
        notes: "Snap hips at apex. Do not squat the swing."
      },
      {
        id: "we_13",
        exerciseId: "ex_08",
        name: "High-Intensity Interval Sprints",
        sets: 6,
        repsOrDuration: "30s sprint / 45s rest",
        restSeconds: 45,
        targetMuscle: "Full Body",
        equipment: "Treadmill / Track",
        notes: "Maintain sprint form and upright posture."
      },
      {
        id: "we_14",
        exerciseId: "ex_15",
        name: "Plank to Push-Up",
        sets: 3,
        repsOrDuration: "12 reps",
        restSeconds: 45,
        targetMuscle: "Core",
        equipment: "Bodyweight",
        notes: "Keep hips level and avoid tilting."
      }
    ]
  },
  {
    id: "wk_05",
    title: "Total Body Calisthenics & Core Mastery",
    slug: "total-body-calisthenics-core-mastery",
    description: "No-machine functional strength routine focusing on relative bodyweight control, core stability, and upper body pulling power.",
    category: "Calisthenics",
    difficulty: "Beginner",
    durationMinutes: 35,
    estimatedCalories: 260,
    equipment: ["Pull-Up Bar", "Bodyweight", "Yoga Mat"],
    muscleGroups: ["Core", "Back", "Chest"],
    coverImage: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80",
    status: "active",
    completionsCount: 1890,
    rating: 4.85,
    authorName: "Elena Rostova (CSCS)",
    createdAt: "2024-02-12T13:00:00.000Z",
    updatedAt: "2024-02-23T09:10:00.000Z",
    exercises: [
      {
        id: "we_15",
        exerciseId: "ex_04",
        name: "Pull-Ups (Overhand)",
        sets: 3,
        repsOrDuration: "6-10 reps",
        restSeconds: 75,
        targetMuscle: "Back",
        equipment: "Pull-Up Bar",
        notes: "Use resistance band if needed."
      },
      {
        id: "we_16",
        exerciseId: "ex_15",
        name: "Plank to Push-Up",
        sets: 3,
        repsOrDuration: "10 reps",
        restSeconds: 60,
        targetMuscle: "Core",
        equipment: "Bodyweight",
        notes: "Alternating starting arm each set."
      },
      {
        id: "we_17",
        exerciseId: "ex_09",
        name: "Hanging Leg Raises",
        sets: 3,
        repsOrDuration: "12 reps",
        restSeconds: 60,
        targetMuscle: "Core",
        equipment: "Pull-Up Bar",
        notes: "Bend knees slightly if hamstring tight."
      }
    ]
  },
  {
    id: "wk_06",
    title: "Full Body Mobility & Kinetic Flow",
    slug: "full-body-mobility-kinetic-flow",
    description: "Essential active recovery routine designed to release hip flexor tension, open thoracic spine, and improve joint longevity.",
    category: "Flexibility & Mobility",
    difficulty: "Beginner",
    durationMinutes: 25,
    estimatedCalories: 140,
    equipment: ["Yoga Mat"],
    muscleGroups: ["Full Body"],
    coverImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
    status: "active",
    completionsCount: 6420,
    rating: 4.95,
    authorName: "Dr. Rachel Kim (PT)",
    createdAt: "2024-02-14T09:00:00.000Z",
    updatedAt: "2024-02-24T12:00:00.000Z",
    exercises: [
      {
        id: "we_18",
        exerciseId: "ex_14",
        name: "Thoracic Mobility & World's Greatest Stretch",
        sets: 3,
        repsOrDuration: "8 reps / side",
        restSeconds: 30,
        targetMuscle: "Full Body",
        equipment: "Yoga Mat",
        notes: "Synchronize deep belly breathing with spinal rotation."
      }
    ]
  },
  {
    id: "wk_07",
    title: "Elite Metabolic Shred (Fast Track)",
    slug: "elite-metabolic-shred-fast-track",
    description: "Rapid cardiovascular conditioning for advanced athletes targeting accelerated fat loss and peak heart rate thresholds.",
    category: "Fat Loss",
    difficulty: "Elite",
    durationMinutes: 40,
    estimatedCalories: 510,
    equipment: ["Kettlebell", "Treadmill / Track", "Dumbbells"],
    muscleGroups: ["Full Body", "Legs", "Core"],
    coverImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
    status: "draft",
    completionsCount: 310,
    rating: 4.9,
    authorName: "David Sterling",
    createdAt: "2024-02-16T15:30:00.000Z",
    updatedAt: "2024-02-25T17:00:00.000Z",
    exercises: [
      {
        id: "we_19",
        exerciseId: "ex_10",
        name: "Kettlebell Russian Swings",
        sets: 5,
        repsOrDuration: "25 reps",
        restSeconds: 30,
        targetMuscle: "Full Body",
        equipment: "Kettlebell",
        notes: "Heavy weight (24-32kg)."
      },
      {
        id: "we_20",
        exerciseId: "ex_08",
        name: "High-Intensity Interval Sprints",
        sets: 8,
        repsOrDuration: "40s sprint / 20s rest",
        restSeconds: 30,
        targetMuscle: "Full Body",
        equipment: "Treadmill / Track",
        notes: "Maximum exertion."
      }
    ]
  }
];

export const mockWorkoutProgramsList: IWorkoutProgram[] = [
  {
    id: "prog_01",
    title: "Push-Pull-Legs (PPL) Hypertrophy Mastery",
    subtitle: "6-Week Systematic Muscle Growth Split",
    description: "The gold-standard training protocol for building balanced muscle mass and progressive overload across major movement patterns.",
    durationWeeks: 6,
    daysPerWeek: 5,
    category: "Strength & Hypertrophy",
    difficulty: "Intermediate",
    enrolledUsersCount: 1420,
    completionRatePercent: 84,
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    status: "active",
    schedule: [
      { dayNumber: 1, dayName: "Monday", isRestDay: false, workoutId: "wk_01", workoutTitle: "Push Power & Hypertrophy", durationMinutes: 45, focusArea: "Chest, Shoulders & Triceps" },
      { dayNumber: 2, dayName: "Tuesday", isRestDay: false, workoutId: "wk_02", workoutTitle: "Pull & Posterior Chain", durationMinutes: 50, focusArea: "Back & Biceps" },
      { dayNumber: 3, dayName: "Wednesday", isRestDay: false, workoutId: "wk_03", workoutTitle: "Lower Body Quad & Glute", durationMinutes: 55, focusArea: "Quads, Hamstrings & Glutes" },
      { dayNumber: 4, dayName: "Thursday", isRestDay: true, workoutTitle: "Active Recovery", focusArea: "Rest & Hydration" },
      { dayNumber: 5, dayName: "Friday", isRestDay: false, workoutId: "wk_01", workoutTitle: "Upper Body Hypertrophy", durationMinutes: 45, focusArea: "Upper Compound" },
      { dayNumber: 6, dayName: "Saturday", isRestDay: false, workoutId: "wk_04", workoutTitle: "Metabolic Conditioning", durationMinutes: 30, focusArea: "Full Body HIIT" },
      { dayNumber: 7, dayName: "Sunday", isRestDay: true, workoutTitle: "Full Rest", focusArea: "Sleep & Recovery" }
    ]
  },
  {
    id: "prog_02",
    title: "4-Week Metabolic Shred & Core Ignite",
    subtitle: "High Intensity Fat Loss & Conditioning Protocol",
    description: "Designed to trigger the afterburn effect (EPOC) through interval training, kettlebell complexes, and core stability circuits.",
    durationWeeks: 4,
    daysPerWeek: 4,
    category: "Fat Loss",
    difficulty: "Advanced",
    enrolledUsersCount: 2180,
    completionRatePercent: 78,
    coverImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
    status: "active",
    schedule: [
      { dayNumber: 1, dayName: "Monday", isRestDay: false, workoutId: "wk_04", workoutTitle: "Metabolic HIIT Torch", durationMinutes: 30, focusArea: "HIIT & Sprints" },
      { dayNumber: 2, dayName: "Tuesday", isRestDay: false, workoutId: "wk_05", workoutTitle: "Total Body Calisthenics", durationMinutes: 35, focusArea: "Bodyweight Conditioning" },
      { dayNumber: 3, dayName: "Wednesday", isRestDay: true, workoutTitle: "Active Mobility", focusArea: "Stretching & Foam Rolling" },
      { dayNumber: 4, dayName: "Thursday", isRestDay: false, workoutId: "wk_04", workoutTitle: "Kettlebell Circuit Burn", durationMinutes: 30, focusArea: "Full Body Burn" },
      { dayNumber: 5, dayName: "Friday", isRestDay: false, workoutId: "wk_06", workoutTitle: "Mobility & Core Flow", durationMinutes: 25, focusArea: "Core & Spinal Flow" },
      { dayNumber: 6, dayName: "Saturday", isRestDay: true, workoutTitle: "Weekend Rest", focusArea: "Rest" },
      { dayNumber: 7, dayName: "Sunday", isRestDay: true, workoutTitle: "Weekend Rest", focusArea: "Rest" }
    ]
  },
  {
    id: "prog_03",
    title: "Beginner Bodyweight & Mobility Foundation",
    subtitle: "3-Week Zero-Equipment Strength Starter",
    description: "Build foundational joint strength, posture awareness, and fundamental movement mechanics with zero equipment needed.",
    durationWeeks: 3,
    daysPerWeek: 3,
    category: "Flexibility & Mobility",
    difficulty: "Beginner",
    enrolledUsersCount: 3450,
    completionRatePercent: 91,
    coverImage: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80",
    status: "active",
    schedule: [
      { dayNumber: 1, dayName: "Monday", isRestDay: false, workoutId: "wk_05", workoutTitle: "Total Body Basics", durationMinutes: 35, focusArea: "Push & Pull Fundamentals" },
      { dayNumber: 2, dayName: "Tuesday", isRestDay: true, workoutTitle: "Rest", focusArea: "Recovery" },
      { dayNumber: 3, dayName: "Wednesday", isRestDay: false, workoutId: "wk_06", workoutTitle: "Mobility & Kinetic Flow", durationMinutes: 25, focusArea: "Hip & Spine Mobility" },
      { dayNumber: 4, dayName: "Thursday", isRestDay: true, workoutTitle: "Rest", focusArea: "Recovery" },
      { dayNumber: 5, dayName: "Friday", isRestDay: false, workoutId: "wk_05", workoutTitle: "Core & Posture Routine", durationMinutes: 35, focusArea: "Core Stabilization" },
      { dayNumber: 6, dayName: "Saturday", isRestDay: true, workoutTitle: "Rest", focusArea: "Active Walking" },
      { dayNumber: 7, dayName: "Sunday", isRestDay: true, workoutTitle: "Rest", focusArea: "Recovery" }
    ]
  }
];

export const mockWorkoutLogsList: IWorkoutLog[] = [
  {
    id: "log_01",
    userId: "usr_101",
    userName: "Alexander Hayes",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    workoutId: "wk_01",
    workoutTitle: "Push Power & Hypertrophy Focus",
    category: "Strength & Hypertrophy",
    durationMinutes: 47,
    caloriesBurned: 395,
    avgHeartRateBpm: 142,
    rating: 5,
    completedAt: "15 minutes ago"
  },
  {
    id: "log_02",
    userId: "usr_102",
    userName: "Samantha Miller",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    workoutId: "wk_04",
    workoutTitle: "Metabolic HIIT Torch & Kettlebell Circuit",
    category: "Cardio & HIIT",
    durationMinutes: 31,
    caloriesBurned: 375,
    avgHeartRateBpm: 168,
    rating: 5,
    completedAt: "42 minutes ago"
  },
  {
    id: "log_03",
    userId: "usr_103",
    userName: "Marcus Thorne",
    userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
    workoutId: "wk_03",
    workoutTitle: "Lower Body Quad & Glute Hyperdrive",
    category: "Strength & Hypertrophy",
    durationMinutes: 58,
    caloriesBurned: 510,
    avgHeartRateBpm: 154,
    rating: 4,
    completedAt: "2 hours ago"
  },
  {
    id: "log_04",
    userId: "usr_104",
    userName: "Chloe Bennet",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    workoutId: "wk_06",
    workoutTitle: "Full Body Mobility & Kinetic Flow",
    category: "Flexibility & Mobility",
    durationMinutes: 26,
    caloriesBurned: 145,
    avgHeartRateBpm: 108,
    rating: 5,
    completedAt: "3 hours ago"
  },
  {
    id: "log_05",
    userId: "usr_105",
    userName: "Liam O'Connor",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    workoutId: "wk_02",
    workoutTitle: "Pull & Posterior Chain Strength",
    category: "Strength & Hypertrophy",
    durationMinutes: 52,
    caloriesBurned: 440,
    avgHeartRateBpm: 146,
    rating: 5,
    completedAt: "5 hours ago"
  },
  {
    id: "log_06",
    userId: "usr_106",
    userName: "Jessica Rivera",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    workoutId: "wk_05",
    workoutTitle: "Total Body Calisthenics & Core Mastery",
    category: "Calisthenics",
    durationMinutes: 36,
    caloriesBurned: 275,
    avgHeartRateBpm: 132,
    rating: 4,
    completedAt: "7 hours ago"
  }
];

export const mockWorkoutStatsData: WorkoutStats = {
  totalWorkouts: 28,
  activeWorkouts: 24,
  totalExercises: 156,
  completedSessions: 24850,
  avgDurationMinutes: 38,
  avgCaloriesBurned: 345
};
