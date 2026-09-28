"use client";

import Image from "next/image";
import {
  Clock,
  Flame,
  Star,
  Dumbbell,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/widgets/empty-state";
import { IWorkout, WorkoutDifficulty } from "@/types/workout";

interface WorkoutCardGridProps {
  workouts: IWorkout[];
  isLoading?: boolean;
  onPreview: (workout: IWorkout) => void;
  onEdit: (workout: IWorkout) => void;
  onDuplicate: (workout: IWorkout) => void;
  onDelete: (workout: IWorkout) => void;
  onToggleStatus: (workout: IWorkout) => void;
}

const getDifficultyBadge = (difficulty: WorkoutDifficulty) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    case "Intermediate":
      return "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30";
    case "Advanced":
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
    case "Elite":
      return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function WorkoutCardGrid({
  workouts,
  isLoading,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus
}: WorkoutCardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse border-border/60">
            <div className="h-44 bg-muted" />
            <CardHeader className="space-y-2 p-4">
              <div className="h-5 w-3/4 bg-muted rounded" />
              <div className="h-3.5 w-1/2 bg-muted rounded" />
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-4/5 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!workouts.length) {
    return (
      <div className="py-12">
        <EmptyState
          title="No workout routines found"
          description="Try adjusting your filters or search keywords, or create a brand new routine."
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workouts.map((workout) => (
        <Card
          key={workout.id}
          className="group relative flex flex-col overflow-hidden border-border/60 hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-card"
        >
          {/* Cover Image & Badges */}
          <div className="relative h-48 w-full overflow-hidden bg-muted">
            <Image
              src={workout.coverImage || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80"}
              alt={workout.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
              <Badge
                variant="outline"
                className={`font-semibold backdrop-blur-md border ${getDifficultyBadge(workout.difficulty)}`}
              >
                {workout.difficulty}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-black/40 text-white backdrop-blur-md border-white/20 text-xs"
              >
                {workout.category}
              </Badge>
            </div>

            {/* Status & Options Menu */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <Badge
                variant="outline"
                className={`text-[11px] font-medium backdrop-blur-md ${
                  workout.status === "active"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                    : workout.status === "draft"
                    ? "bg-amber-500/20 text-amber-300 border-amber-400/40"
                    : "bg-zinc-500/20 text-zinc-300 border-zinc-400/40"
                }`}
              >
                {workout.status === "active" && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
                {workout.status === "draft" && <AlertCircle className="w-3 h-3 mr-1 inline" />}
                {workout.status.toUpperCase()}
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md border border-white/20"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => onPreview(workout)} className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4 text-sky-500" />
                    Preview Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(workout)} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4 text-amber-500" />
                    Edit Routine
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(workout)} className="cursor-pointer">
                    <Copy className="mr-2 h-4 w-4 text-emerald-500" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleStatus(workout)} className="cursor-pointer">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-purple-500" />
                    Set as {workout.status === "active" ? "Draft" : "Active"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(workout)}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Routine
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Bottom Floating Stats */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/95">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-medium bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  <Clock className="h-3.5 w-3.5 text-sky-400" />
                  {workout.durationMinutes} min
                </span>
                <span className="flex items-center gap-1 font-medium bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  <Flame className="h-3.5 w-3.5 text-orange-400" />
                  ~{workout.estimatedCalories} kcal
                </span>
              </div>
              <span className="flex items-center gap-1 font-medium bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm text-amber-300">
                <Star className="h-3 w-3 fill-amber-300" />
                {workout.rating}
              </span>
            </div>
          </div>

          {/* Content */}
          <CardHeader className="p-4 pb-2">
            <h3 className="text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {workout.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
              {workout.description}
            </p>
          </CardHeader>

          <CardContent className="p-4 pt-1 flex-1 space-y-3">
            {/* Target Muscles */}
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-[11px] text-muted-foreground mr-1">Focus:</span>
              {workout.muscleGroups.slice(0, 3).map((muscle) => (
                <span
                  key={muscle}
                  className="text-[10px] bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-md"
                >
                  {muscle}
                </span>
              ))}
              {workout.muscleGroups.length > 3 && (
                <span className="text-[10px] text-muted-foreground">
                  +{workout.muscleGroups.length - 3} more
                </span>
              )}
            </div>

            {/* Exercise Count & Equipment summary */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
              <div className="flex items-center gap-1.5">
                <Dumbbell className="h-3.5 w-3.5 text-primary" />
                <span>
                  <strong className="text-foreground">{workout.exercises?.length || 0}</strong> Exercises
                </span>
              </div>
              <div className="text-[11px] truncate max-w-[150px]">
                {workout.equipment.join(", ") || "Bodyweight"}
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => onPreview(workout)}
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              View Details
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => onEdit(workout)}
            >
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
