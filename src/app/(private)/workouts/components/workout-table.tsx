"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Clock, Flame, MoreHorizontal, Eye, Edit, Copy, Trash2, Dumbbell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/widgets/data-table";
import { IWorkout, WorkoutDifficulty } from "@/types/workout";

interface WorkoutTableProps {
  workouts: IWorkout[];
  isLoading?: boolean;
  onPreview: (workout: IWorkout) => void;
  onEdit: (workout: IWorkout) => void;
  onDuplicate: (workout: IWorkout) => void;
  onDelete: (workout: IWorkout) => void;
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

export function WorkoutTable({
  workouts,
  isLoading,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete
}: WorkoutTableProps) {
  const columns: ColumnDef<IWorkout>[] = [
    {
      accessorKey: "title",
      header: "Routine",
      cell: ({ row }) => {
        const workout = row.original;
        return (
          <div className="flex items-center gap-3 py-1">
            <div className="relative h-12 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border/50">
              <Image
                src={workout.coverImage || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80"}
                alt={workout.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div
                onClick={() => onPreview(workout)}
                className="font-semibold text-sm hover:text-primary cursor-pointer transition-colors truncate max-w-xs md:max-w-sm"
              >
                {workout.title}
              </div>
              <div className="text-xs text-muted-foreground truncate max-w-xs md:max-w-sm">
                {workout.category}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "difficulty",
      header: "Level",
      cell: ({ row }) => {
        const diff = row.getValue("difficulty") as WorkoutDifficulty;
        return (
          <Badge variant="outline" className={`font-medium ${getDifficultyBadge(diff)}`}>
            {diff}
          </Badge>
        );
      }
    },
    {
      accessorKey: "muscleGroups",
      header: "Target Muscles",
      cell: ({ row }) => {
        const muscles = row.original.muscleGroups || [];
        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {muscles.slice(0, 2).map((m) => (
              <span
                key={m}
                className="text-[11px] bg-primary/10 text-primary font-medium px-2 py-0.5 rounded"
              >
                {m}
              </span>
            ))}
            {muscles.length > 2 && (
              <span className="text-[11px] text-muted-foreground">+{muscles.length - 2}</span>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: "durationMinutes",
      header: "Duration & Burn",
      cell: ({ row }) => {
        const workout = row.original;
        return (
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1 font-medium">
              <Clock className="h-3.5 w-3.5 text-sky-500" />
              <span>{workout.durationMinutes} mins</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <span>~{workout.estimatedCalories} kcal</span>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "exercises",
      header: "Exercises",
      cell: ({ row }) => {
        const count = row.original.exercises?.length || 0;
        return (
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <Dumbbell className="h-4 w-4 text-primary/70" />
            <span>{count}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant="outline"
            className={`capitalize text-xs font-semibold ${
              status === "active"
                ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                : status === "draft"
                ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {status}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const workout = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => onPreview(workout)}
              title="Preview details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(workout)}
              title="Edit routine"
            >
              <Edit className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDuplicate(workout)} className="cursor-pointer">
                  <Copy className="mr-2 h-4 w-4 text-emerald-500" />
                  Duplicate
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
        );
      }
    }
  ];

  return (
    <div className="rounded-lg border bg-card p-4">
      <DataTable
        columns={columns}
        data={workouts}
        isLoading={isLoading}
        searchKey="title"
        searchPlaceholder="Filter workouts in table..."
      />
    </div>
  );
}
