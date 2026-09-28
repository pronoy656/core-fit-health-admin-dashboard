"use client";

import Image from "next/image";
import {
  Clock,
  Flame,
  Star,
  Dumbbell,
  CheckCircle2,
  Users,
  Timer,
  Info,
  Edit,
  Copy,
  Sparkles
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IWorkout, WorkoutDifficulty } from "@/types/workout";

interface WorkoutPreviewDialogProps {
  workout: IWorkout | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (workout: IWorkout) => void;
  onDuplicate?: (workout: IWorkout) => void;
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

export function WorkoutPreviewDialog({
  workout,
  open,
  onOpenChange,
  onEdit,
  onDuplicate
}: WorkoutPreviewDialogProps) {
  if (!workout) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Hero Section */}
        <div className="relative h-60 w-full bg-muted">
          <Image
            src={
              workout.coverImage ||
              "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80"
            }
            alt={workout.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={`font-semibold backdrop-blur-md border ${getDifficultyBadge(
                workout.difficulty
              )}`}
            >
              {workout.difficulty}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-black/50 text-white backdrop-blur-md border-white/20"
            >
              {workout.category}
            </Badge>
          </div>

          <div className="absolute top-4 right-4">
            <Badge
              variant="outline"
              className={`capitalize backdrop-blur-md ${
                workout.status === "active"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                  : "bg-amber-500/20 text-amber-300 border-amber-400/40"
              }`}
            >
              {workout.status}
            </Badge>
          </div>

          {/* Title & Floating stats on hero */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold">{workout.title}</h2>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/90">
              <span className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                <Clock className="h-4 w-4 text-sky-400" />
                {workout.durationMinutes} mins
              </span>
              <span className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                <Flame className="h-4 w-4 text-orange-400" />
                ~{workout.estimatedCalories} kcal
              </span>
              <span className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm text-amber-300">
                <Star className="h-4 w-4 fill-amber-300" />
                {workout.rating} Rating
              </span>
              <span className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm text-white/80">
                <Users className="h-4 w-4 text-emerald-400" />
                {workout.completionsCount?.toLocaleString()} Completed
              </span>
            </div>
          </div>
        </div>

        <DialogHeader className="sr-only">
          <DialogTitle>{workout.title}</DialogTitle>
        </DialogHeader>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Overview & Focus
            </h3>
            <p className="text-sm leading-relaxed text-foreground/90">{workout.description}</p>
          </div>

          {/* Target Muscles & Equipment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/40 border space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Target Muscle Groups
              </span>
              <div className="flex flex-wrap gap-1.5">
                {workout.muscleGroups.map((muscle) => (
                  <Badge key={muscle} variant="secondary" className="bg-primary/10 text-primary font-medium">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/40 border space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Equipment Required
              </span>
              <div className="flex flex-wrap gap-1.5">
                {workout.equipment.map((eq) => (
                  <Badge key={eq} variant="outline">
                    {eq}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Exercise Sequence */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Exercise Sequence ({workout.exercises?.length || 0})
              </h3>
              <span className="text-xs text-muted-foreground">Follow sequence from top to bottom</span>
            </div>

            <div className="space-y-3">
              {workout.exercises?.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:border-primary/40 transition-colors gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/15 text-primary text-xs font-bold shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-foreground">{item.name}</span>
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                          {item.targetMuscle}
                        </Badge>
                        {item.equipment && (
                          <span className="text-xs text-muted-foreground">({item.equipment})</span>
                        )}
                      </div>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Info className="h-3 w-3 text-primary shrink-0" />
                          <span>{item.notes}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0 text-xs font-medium">
                    <div className="bg-muted px-2.5 py-1 rounded-md text-foreground">
                      <strong className="text-primary">{item.sets}</strong> Sets × {item.repsOrDuration}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground bg-muted/60 px-2 py-1 rounded-md">
                      <Timer className="h-3 w-3 text-amber-500" />
                      <span>{item.restSeconds}s Rest</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 border-t bg-muted/20 flex-row justify-between sm:justify-between items-center gap-2">
          <div className="text-xs text-muted-foreground">
            Created by <span className="font-medium text-foreground">{workout.authorName || "CoreFit Team"}</span>
          </div>

          <div className="flex items-center gap-2">
            {onDuplicate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onDuplicate(workout);
                  onOpenChange(false);
                }}
              >
                <Copy className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
                Duplicate
              </Button>
            )}
            {onEdit && (
              <Button
                size="sm"
                onClick={() => {
                  onEdit(workout);
                  onOpenChange(false);
                }}
              >
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                Edit Routine
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
