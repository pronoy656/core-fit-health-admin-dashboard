"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Users,
  Flame,
  CheckCircle2,
  Dumbbell,
  ArrowRight,
  Clock,
  Zap,
  BedDouble
} from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useWorkoutPrograms } from "@/hooks/use-workouts";
import { IWorkoutProgram, WorkoutDifficulty } from "@/types/workout";

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

export function ProgramsTab() {
  const { data: programs = [], isLoading } = useWorkoutPrograms();
  const [selectedProgram, setSelectedProgram] = useState<IWorkoutProgram | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="h-96 animate-pulse bg-muted/40" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Structured Training Programs</h3>
          <p className="text-xs text-muted-foreground">
            Multi-week progressive overload and conditioning schedules available to app members.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((prog) => (
          <Card
            key={prog.id}
            className="overflow-hidden border-border/60 hover:border-primary/50 transition-all duration-300 flex flex-col group"
          >
            {/* Cover Header */}
            <div className="relative h-44 w-full bg-muted overflow-hidden">
              <Image
                src={prog.coverImage}
                alt={prog.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

              <div className="absolute top-3 left-3 flex gap-1.5">
                <Badge
                  variant="outline"
                  className={`backdrop-blur-md border ${getDifficultyBadge(prog.difficulty)}`}
                >
                  {prog.difficulty}
                </Badge>
                <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-md">
                  {prog.category}
                </Badge>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {prog.durationWeeks} Weeks Split
                </span>
                <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  {prog.daysPerWeek} Days / Week
                </span>
              </div>
            </div>

            {/* Content */}
            <CardHeader className="p-4 pb-2">
              <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {prog.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                {prog.description}
              </p>
            </CardHeader>

            <CardContent className="p-4 pt-1 flex-1 space-y-4">
              {/* Engagement Stats */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-sky-500" />
                    Enrolled Users:
                  </span>
                  <span className="font-bold text-foreground">
                    {prog.enrolledUsersCount.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {prog.completionRatePercent}%
                    </span>
                  </div>
                  <Progress value={prog.completionRatePercent} className="h-1.5" />
                </div>
              </div>

              {/* Schedule Preview */}
              <div className="flex items-center gap-1 overflow-hidden">
                {prog.schedule.map((day) => (
                  <div
                    key={day.dayNumber}
                    className={`flex-1 text-center py-1 rounded text-[10px] font-semibold ${
                      day.isRestDay
                        ? "bg-muted/40 text-muted-foreground"
                        : "bg-primary/15 text-primary"
                    }`}
                    title={`${day.dayName}: ${day.isRestDay ? "Rest" : day.workoutTitle}`}
                  >
                    {day.dayName.slice(0, 2)}
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs gap-1.5"
                onClick={() => setSelectedProgram(prog)}
              >
                View Full Weekly Split
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Program Split Detail Dialog */}
      <Dialog open={!!selectedProgram} onOpenChange={(open) => !open && setSelectedProgram(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedProgram && (
            <div>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getDifficultyBadge(selectedProgram.difficulty)}>
                    {selectedProgram.difficulty}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {selectedProgram.durationWeeks} Weeks • {selectedProgram.daysPerWeek} Active Days
                  </span>
                </div>
                <DialogTitle className="text-xl mt-1">{selectedProgram.title}</DialogTitle>
                <DialogDescription>{selectedProgram.description}</DialogDescription>
              </DialogHeader>

              <div className="py-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Weekly Schedule Breakdown
                </h4>

                <div className="space-y-2.5">
                  {selectedProgram.schedule.map((day) => (
                    <div
                      key={day.dayNumber}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        day.isRestDay
                          ? "bg-muted/30 border-dashed border-border"
                          : "bg-card border-primary/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-md flex items-center justify-center font-bold text-xs ${
                            day.isRestDay
                              ? "bg-muted text-muted-foreground"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {day.dayName.slice(0, 3)}
                        </div>

                        <div>
                          <div className="font-semibold text-sm flex items-center gap-2">
                            <span>{day.workoutTitle || (day.isRestDay ? "Active Rest & Recovery" : "Workout")}</span>
                            {day.isRestDay && (
                              <Badge variant="secondary" className="text-[10px] py-0">
                                Rest
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{day.focusArea}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {day.isRestDay ? (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <BedDouble className="h-3.5 w-3.5" />
                            Full Recovery
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-medium text-foreground bg-muted px-2 py-1 rounded">
                            <Clock className="h-3 w-3 text-sky-500" />
                            {day.durationMinutes} min
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
