"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Clock, Flame, Heart, Star, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/widgets/data-table";
import { useWorkoutLogs } from "@/hooks/use-workouts";
import { IWorkoutLog } from "@/types/workout";

export function WorkoutLogsTab() {
  const { data: logs = [], isLoading } = useWorkoutLogs();

  const columns: ColumnDef<IWorkoutLog>[] = [
    {
      accessorKey: "userName",
      header: "Member",
      cell: ({ row }) => {
        const log = row.original;
        const initials = log.userName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <div className="flex items-center gap-3 py-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={log.userAvatar} alt={log.userName} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {initials || <User className="h-3.5 w-3.5" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-sm">{log.userName}</div>
              <div className="text-[11px] text-muted-foreground">{log.completedAt}</div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "workoutTitle",
      header: "Completed Routine",
      cell: ({ row }) => {
        const log = row.original;
        return (
          <div>
            <div className="font-medium text-sm text-foreground">{log.workoutTitle}</div>
            <div className="text-xs text-muted-foreground">{log.category}</div>
          </div>
        );
      }
    },
    {
      accessorKey: "durationMinutes",
      header: "Duration",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <Clock className="h-3.5 w-3.5 text-sky-500" />
          <span>{row.getValue("durationMinutes")} mins</span>
        </div>
      )
    },
    {
      accessorKey: "caloriesBurned",
      header: "Calorie Burn",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs font-bold text-orange-500">
          <Flame className="h-3.5 w-3.5" />
          <span>{row.getValue("caloriesBurned")} kcal</span>
        </div>
      )
    },
    {
      accessorKey: "avgHeartRateBpm",
      header: "Avg Heart Rate",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
          <Heart className="h-3.5 w-3.5 fill-rose-500/20" />
          <span>{row.getValue("avgHeartRateBpm")} BPM</span>
        </div>
      )
    },
    {
      accessorKey: "rating",
      header: "User Rating",
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number;
        return (
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-xs">{rating}.0</span>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-card p-4 rounded-lg border">
        <h3 className="text-base font-semibold">Live Member Activity Feed</h3>
        <p className="text-xs text-muted-foreground">
          Real-time workout completion logs, heart rate averages, and difficulty feedback.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <DataTable
          columns={columns}
          data={logs}
          isLoading={isLoading}
          searchKey="workoutTitle"
          searchPlaceholder="Search by routine name..."
        />
      </div>
    </div>
  );
}
