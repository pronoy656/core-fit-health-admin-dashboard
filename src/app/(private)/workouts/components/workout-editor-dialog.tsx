"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Dumbbell, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ICreateWorkoutPayload,
  IWorkout,
  WorkoutCategory,
  WorkoutDifficulty,
  WorkoutExerciseItem,
  WorkoutStatus
} from "@/types/workout";
import { useExercises } from "@/hooks/use-exercises";

interface WorkoutEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutToEdit?: IWorkout | null;
  onSave: (payload: ICreateWorkoutPayload) => Promise<void> | void;
  isSaving?: boolean;
}

const CATEGORIES: WorkoutCategory[] = [
  "Strength & Hypertrophy",
  "Cardio & HIIT",
  "Fat Loss",
  "Flexibility & Mobility",
  "Calisthenics",
  "Rehab & Recovery"
];

const DIFFICULTIES: WorkoutDifficulty[] = ["Beginner", "Intermediate", "Advanced", "Elite"];

const AVAILABLE_MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Full Body",
  "Glutes",
  "Hamstrings",
  "Quads"
];

const SAMPLE_COVERS = [
  { label: "Gym & Weights", url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80" },
  { label: "Deadlift & Power", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80" },
  { label: "Squat & Legs", url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80" },
  { label: "HIIT & Sprints", url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80" },
  { label: "Mobility & Yoga", url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80" },
  { label: "Calisthenics Bar", url: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80" }
];

export function WorkoutEditorDialog({
  open,
  onOpenChange,
  workoutToEdit,
  onSave,
  isSaving = false
}: WorkoutEditorDialogProps) {
  const { data: exercisesResponse } = useExercises({ limit: 100 });
  const exerciseCatalog = exercisesResponse?.data || [];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<WorkoutCategory>("Strength & Hypertrophy");
  const [difficulty, setDifficulty] = useState<WorkoutDifficulty>("Intermediate");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [estimatedCalories, setEstimatedCalories] = useState(350);
  const [equipmentInput, setEquipmentInput] = useState("Dumbbells, Barbell");
  const [status, setStatus] = useState<WorkoutStatus>("active");
  const [coverImage, setCoverImage] = useState(SAMPLE_COVERS[0].url);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(["Chest", "Shoulders"]);
  const [exercises, setExercises] = useState<WorkoutExerciseItem[]>([]);

  // Selected exercise to add
  const [selectedExerciseIdToAdd, setSelectedExerciseIdToAdd] = useState<string>("");

  useEffect(() => {
    if (workoutToEdit) {
      setTitle(workoutToEdit.title);
      setDescription(workoutToEdit.description);
      setCategory(workoutToEdit.category);
      setDifficulty(workoutToEdit.difficulty);
      setDurationMinutes(workoutToEdit.durationMinutes);
      setEstimatedCalories(workoutToEdit.estimatedCalories);
      setEquipmentInput(workoutToEdit.equipment?.join(", ") || "");
      setStatus(workoutToEdit.status);
      setCoverImage(workoutToEdit.coverImage || SAMPLE_COVERS[0].url);
      setSelectedMuscles(workoutToEdit.muscleGroups || []);
      setExercises(workoutToEdit.exercises ? [...workoutToEdit.exercises] : []);
    } else {
      // Defaults for new
      setTitle("");
      setDescription("");
      setCategory("Strength & Hypertrophy");
      setDifficulty("Intermediate");
      setDurationMinutes(45);
      setEstimatedCalories(350);
      setEquipmentInput("Dumbbells, Bench");
      setStatus("active");
      setCoverImage(SAMPLE_COVERS[0].url);
      setSelectedMuscles(["Chest", "Arms"]);
      setExercises([
        {
          id: `we_${Date.now()}_1`,
          exerciseId: "ex_02",
          name: "Flat Barbell Bench Press",
          sets: 4,
          repsOrDuration: "8-10 reps",
          restSeconds: 90,
          targetMuscle: "Chest",
          equipment: "Barbell & Bench",
          notes: "Focus on controlled 2s eccentric descent."
        }
      ]);
    }
  }, [workoutToEdit, open]);

  const toggleMuscle = (muscle: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );
  };

  const handleAddExercise = () => {
    if (!selectedExerciseIdToAdd) {
      toast.error("Please select an exercise from the library");
      return;
    }

    const foundEx = exerciseCatalog.find(
      (e) => (e._id || (e as any).id) === selectedExerciseIdToAdd
    );
    if (!foundEx) return;

    const newItem: WorkoutExerciseItem = {
      id: `we_${Date.now()}`,
      exerciseId: foundEx._id || (foundEx as any).id,
      name: foundEx.name,
      sets: 3,
      repsOrDuration: "10-12 reps",
      restSeconds: 60,
      targetMuscle: foundEx.muscleGroup,
      equipment: foundEx.equipment,
      notes: ""
    };

    setExercises((prev) => [...prev, newItem]);
    setSelectedExerciseIdToAdd("");
    toast.success(`Added ${foundEx.name}`);
  };

  const handleUpdateExercise = <K extends keyof WorkoutExerciseItem>(
    index: number,
    field: K,
    value: WorkoutExerciseItem[K]
  ) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveExercise = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === exercises.length - 1) return;

    setExercises((prev) => {
      const copy = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a routine title");
      return;
    }

    if (!selectedMuscles.length) {
      toast.error("Please select at least one target muscle group");
      return;
    }

    if (!exercises.length) {
      toast.error("Please add at least one exercise to the routine");
      return;
    }

    const equipment = equipmentInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      title,
      description,
      category,
      difficulty,
      durationMinutes: Number(durationMinutes) || 30,
      estimatedCalories: Number(estimatedCalories) || 250,
      equipment: equipment.length ? equipment : ["Bodyweight"],
      muscleGroups: selectedMuscles,
      coverImage,
      status,
      exercises
    };

    await onSave(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-6 pb-4 border-b bg-muted/20">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {workoutToEdit ? "Edit Workout Routine" : "Create New Workout Routine"}
                </DialogTitle>
                <DialogDescription>
                  Configure routine details, target muscles, equipment, and exercise sequence.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Basic Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="routine-title">Routine Title *</Label>
                <Input
                  id="routine-title"
                  placeholder="e.g. Chest & Tricep Hypertrophy Blast"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="routine-desc">Description & Objective</Label>
                <Textarea
                  id="routine-desc"
                  placeholder="Provide an overview of the routine, training method, and rest instructions..."
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Primary Category</Label>
                <Select value={category} onValueChange={(val) => setCategory(val as WorkoutCategory)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select
                  value={difficulty}
                  onValueChange={(val) => setDifficulty(val as WorkoutDifficulty)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((diff) => (
                      <SelectItem key={diff} value={diff}>
                        {diff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="routine-duration">Estimated Duration (Minutes)</Label>
                <Input
                  id="routine-duration"
                  type="number"
                  min={5}
                  max={240}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="routine-calories">Estimated Calorie Burn (kcal)</Label>
                <Input
                  id="routine-calories"
                  type="number"
                  min={20}
                  max={2000}
                  value={estimatedCalories}
                  onChange={(e) => setEstimatedCalories(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="routine-equip">Required Equipment (comma-separated)</Label>
                <Input
                  id="routine-equip"
                  placeholder="e.g. Dumbbells, Bench, Cable Machine"
                  value={equipmentInput}
                  onChange={(e) => setEquipmentInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Publishing Status</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as WorkoutStatus)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active (Visible to users)</SelectItem>
                    <SelectItem value="draft">Draft (Admin only)</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Target Muscle Groups */}
            <div className="space-y-2">
              <Label>Target Muscle Groups *</Label>
              <div className="flex flex-wrap gap-2 pt-1">
                {AVAILABLE_MUSCLE_GROUPS.map((muscle) => {
                  const isSelected = selectedMuscles.includes(muscle);
                  return (
                    <button
                      type="button"
                      key={muscle}
                      onClick={() => toggleMuscle(muscle)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {muscle} {isSelected && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cover Image Preset Selector */}
            <div className="space-y-2">
              <Label>Cover Artwork</Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                {SAMPLE_COVERS.map((cover) => (
                  <div
                    key={cover.url}
                    onClick={() => setCoverImage(cover.url)}
                    className={`relative h-16 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                      coverImage === cover.url
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={cover.url} alt={cover.label} fill className="object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate px-1">
                      {cover.label}
                    </span>
                  </div>
                ))}
              </div>
              <Input
                placeholder="Or paste custom image URL..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Exercise Builder */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Exercise Sequence ({exercises.length})
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Add and customize sets, target reps, rest timers, and form cues for each movement.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={selectedExerciseIdToAdd}
                    onValueChange={setSelectedExerciseIdToAdd}
                  >
                    <SelectTrigger className="w-[200px] text-xs h-9">
                      <SelectValue placeholder="Pick from library..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {exerciseCatalog.map((ex) => {
                        const exId = ex._id || (ex as any).id;
                        return (
                          <SelectItem key={exId} value={exId} className="text-xs">
                            {ex.name} ({ex.muscleGroup})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddExercise}
                    className="h-9 gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Exercises List */}
              <div className="space-y-2.5">
                {exercises.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-lg border bg-card/60 hover:bg-card transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-sm">{item.name}</span>
                        <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                          {item.targetMuscle}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleMoveExercise(idx, "up")}
                          disabled={idx === 0}
                          title="Move up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleMoveExercise(idx, "down")}
                          disabled={idx === exercises.length - 1}
                          title="Move down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveExercise(idx)}
                          title="Remove from routine"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-[11px] text-muted-foreground">Sets Count</Label>
                        <Input
                          type="number"
                          min={1}
                          max={20}
                          value={item.sets}
                          onChange={(e) =>
                            handleUpdateExercise(idx, "sets", Number(e.target.value))
                          }
                          className="h-8 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground">Reps / Duration</Label>
                        <Input
                          placeholder="e.g. 10-12 reps or 45s"
                          value={item.repsOrDuration}
                          onChange={(e) =>
                            handleUpdateExercise(idx, "repsOrDuration", e.target.value)
                          }
                          className="h-8 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground">Rest Interval (sec)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={300}
                          step={15}
                          value={item.restSeconds}
                          onChange={(e) =>
                            handleUpdateExercise(idx, "restSeconds", Number(e.target.value))
                          }
                          className="h-8 text-xs mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-[11px] text-muted-foreground">Technique / Coaching Cue</Label>
                      <Input
                        placeholder="e.g. Keep chest high, pause 1s at bottom stretch"
                        value={item.notes || ""}
                        onChange={(e) => handleUpdateExercise(idx, "notes", e.target.value)}
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 border-t bg-muted/20 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="gap-1.5">
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : workoutToEdit ? "Update Routine" : "Create Routine"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
