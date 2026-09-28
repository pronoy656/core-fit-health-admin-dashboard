"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  Edit,
  Trash2,
  Dumbbell,
  Sparkles,
  Calendar,
  Layers,
  Wrench
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { PageHeader } from "@/components/widgets/page-header";
import { KpiCard } from "@/components/widgets/kpi-card";
import { DataTable } from "@/components/widgets/data-table";

import { IExercise, TEquipmentType, TMuscleGroup } from "@/types/exercise";
import {
  useExercises,
  useCreateExercise,
  useUpdateExercise,
  useDeleteExercise
} from "@/hooks/use-exercises";

const MUSCLE_GROUP_OPTIONS: { value: TMuscleGroup; label: string }[] = [
  { value: "CHEST", label: "Chest" },
  { value: "BACK", label: "Back" },
  { value: "LEGS", label: "Legs" },
  { value: "SHOULDERS", label: "Shoulders" },
  { value: "BICEPS", label: "Biceps" },
  { value: "TRICEPS", label: "Triceps" },
  { value: "CORE", label: "Core" },
  { value: "CARDIO", label: "Cardio" },
  { value: "FULL_BODY", label: "Full Body" }
];

const EQUIPMENT_OPTIONS: { value: TEquipmentType; label: string }[] = [
  { value: "BARBELL", label: "Barbell" },
  { value: "DUMBBELL", label: "Dumbbell" },
  { value: "MACHINE", label: "Machine" },
  { value: "CABLE", label: "Cable" },
  { value: "BODYWEIGHT", label: "Bodyweight" },
  { value: "KETTLEBELL", label: "Kettlebell" },
  { value: "BAND", label: "Band" },
  { value: "CARDIO_MACHINE", label: "Cardio Machine" },
  { value: "OTHER", label: "Other" }
];

const MUSCLE_COLORS: Record<TMuscleGroup, string> = {
  CHEST: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  BACK: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  LEGS: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
  SHOULDERS: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  BICEPS: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  TRICEPS: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  CORE: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
  CARDIO: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
  FULL_BODY: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30"
};

const getMuscleGroupLabel = (val: string) => {
  const found = MUSCLE_GROUP_OPTIONS.find((m) => m.value === val);
  return found ? found.label : val;
};

const getEquipmentLabel = (val: string) => {
  const found = EQUIPMENT_OPTIONS.find((e) => e.value === val);
  return found ? found.label : val;
};

export default function WorkoutManagementPage() {
  const [selectedMuscle, setSelectedMuscle] = useState<TMuscleGroup | "All">("All");
  const [selectedEquipment, setSelectedEquipment] = useState<TEquipmentType | "All">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(50);

  // Fetch Exercises from Backend API
  const { data: response, isLoading } = useExercises({
    page,
    limit,
    searchTerm: searchTerm || undefined,
    muscleGroup: selectedMuscle === "All" ? undefined : selectedMuscle,
    equipment: selectedEquipment === "All" ? undefined : selectedEquipment
  });

  const exercises = response?.data || [];
  const totalCount = response?.meta?.total ?? exercises.length;

  // Mutations
  const { mutateAsync: createExercise, isPending: isCreating } = useCreateExercise();
  const { mutateAsync: updateExercise, isPending: isUpdating } = useUpdateExercise();
  const { mutateAsync: deleteExercise } = useDeleteExercise();

  // Form & Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<IExercise | null>(null);

  // Delete Confirm State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<IExercise | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<TMuscleGroup>("CHEST");
  const [equipment, setEquipment] = useState<TEquipmentType>("BARBELL");

  const handleOpenCreate = () => {
    setEditingExercise(null);
    setName("");
    setMuscleGroup("CHEST");
    setEquipment("BARBELL");
    setDialogOpen(true);
  };

  const handleOpenEdit = (exercise: IExercise) => {
    setEditingExercise(exercise);
    setName(exercise.name);
    setMuscleGroup(exercise.muscleGroup || "CHEST");
    setEquipment(exercise.equipment || "BARBELL");
    setDialogOpen(true);
  };

  const handleOpenDelete = (exercise: IExercise) => {
    setExerciseToDelete(exercise);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter an exercise name");
      return;
    }

    const payload = {
      name: name.trim(),
      muscleGroup,
      equipment
    };

    try {
      const exerciseId = editingExercise?._id || (editingExercise as any)?.id;
      if (editingExercise && exerciseId) {
        await updateExercise({ id: exerciseId, payload });
      } else {
        await createExercise(payload);
      }
      setDialogOpen(false);
    } catch {
      // Error handled by mutation hook
    }
  };

  const handleConfirmDelete = async () => {
    const targetId = exerciseToDelete?._id || (exerciseToDelete as any)?.id;
    if (targetId) {
      await deleteExercise(targetId);
      setDeleteDialogOpen(false);
      setExerciseToDelete(null);
    }
  };

  const columns: ColumnDef<IExercise>[] = [
    {
      accessorKey: "name",
      header: "Exercise Name",
      cell: ({ row }) => {
        const ex = row.original;
        return (
          <div className="flex items-center gap-2.5 py-1">
            <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
              <Dumbbell className="h-4 w-4" />
            </div>
            <div>
              <div className="font-semibold text-sm text-foreground hover:text-primary transition-colors">
                {ex.name}
              </div>
              <div className="text-[11px] text-muted-foreground">
                ID: {ex._id || (ex as any).id}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "muscleGroup",
      header: "Target Muscle Group",
      cell: ({ row }) => {
        const muscle = row.getValue("muscleGroup") as TMuscleGroup;
        const colorClass = MUSCLE_COLORS[muscle] || "bg-muted text-muted-foreground";
        return (
          <Badge variant="outline" className={`font-semibold border ${colorClass}`}>
            <Layers className="h-3 w-3 mr-1" />
            {getMuscleGroupLabel(muscle)}
          </Badge>
        );
      }
    },
    {
      accessorKey: "equipment",
      header: "Required Equipment",
      cell: ({ row }) => {
        const eq = row.getValue("equipment") as TEquipmentType;
        return (
          <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
            <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{getEquipmentLabel(eq)}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => {
        const dateStr = row.getValue("createdAt") as string;
        if (!dateStr) return <span className="text-xs text-muted-foreground">-</span>;
        try {
          return (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(dateStr), "MMM dd, yyyy")}</span>
            </div>
          );
        } catch {
          return <span className="text-xs text-muted-foreground">{dateStr}</span>;
        }
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const ex = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-amber-500"
              onClick={() => handleOpenEdit(ex)}
              title="Edit exercise"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => handleOpenDelete(ex)}
              title="Delete exercise"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 pt-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Exercise Management"
          subtitle="Manage the global exercise database for user workouts and routines."
        />

        <Button onClick={handleOpenCreate} className="gap-2 shadow-sm self-start sm:self-center">
          <Plus className="h-4 w-4" />
          Add Exercise
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          title="Total Exercises"
          value={totalCount}
          description="available in database"
          icon={<Dumbbell className="h-4 w-4 text-primary" />}
        />
        <KpiCard
          title="Muscle Groups"
          value={`${MUSCLE_GROUP_OPTIONS.length} Categories`}
          description="Chest, Back, Legs, Shoulders, Biceps, Triceps, Core, Cardio, Full Body"
          icon={<Layers className="h-4 w-4 text-sky-500" />}
        />
        <KpiCard
          title="Equipment Types"
          value={`${EQUIPMENT_OPTIONS.length} Types`}
          description="Barbell, Dumbbell, Machine, Cable, Bodyweight, Kettlebell, Band, Cardio Machine, Other"
          icon={<Wrench className="h-4 w-4 text-emerald-500" />}
        />
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-card p-4 rounded-lg border shadow-xs">
        {/* Muscle group pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Muscle:</span>
          <Button
            variant={selectedMuscle === "All" ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs px-2.5"
            onClick={() => {
              setSelectedMuscle("All");
              setPage(1);
            }}
          >
            All
          </Button>
          {MUSCLE_GROUP_OPTIONS.map((group) => (
            <Button
              key={group.value}
              variant={selectedMuscle === group.value ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => {
                setSelectedMuscle(group.value);
                setPage(1);
              }}
            >
              {group.label}
            </Button>
          ))}
        </div>

        {/* Equipment Filter */}
        <div className="flex items-center gap-2 self-start lg:self-center">
          <Select
            value={selectedEquipment}
            onValueChange={(val) => {
              setSelectedEquipment(val as TEquipmentType | "All");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[170px] text-xs h-9">
              <SelectValue placeholder="Equipment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="text-xs">
                All Equipment
              </SelectItem>
              {EQUIPMENT_OPTIONS.map((eq) => (
                <SelectItem key={eq.value} value={eq.value} className="text-xs">
                  {eq.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* DataTable */}
      <div className="rounded-lg border bg-card p-4">
        <DataTable
          columns={columns}
          data={exercises}
          isLoading={isLoading}
          searchKey="name"
          searchPlaceholder="Search exercises by name..."
          onSearchChange={(val) => {
            setSearchTerm(val);
            setPage(1);
          }}
        />
      </div>

      {/* Create / Edit Modal Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Dumbbell className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle>
                    {editingExercise ? "Update Exercise" : "Add New Exercise"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingExercise
                      ? "Modify exercise name, target muscle group, or equipment."
                      : "Create a new exercise in the global CoreFit database."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="ex-name">Exercise Name *</Label>
                <Input
                  id="ex-name"
                  placeholder="e.g. Barbell Bench Press"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Primary Muscle Group *</Label>
                <Select
                  value={muscleGroup}
                  onValueChange={(val) => setMuscleGroup(val as TMuscleGroup)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select muscle group" />
                  </SelectTrigger>
                  <SelectContent>
                    {MUSCLE_GROUP_OPTIONS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Equipment Required *</Label>
                <Select
                  value={equipment}
                  onValueChange={(val) => setEquipment(val as TEquipmentType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select equipment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_OPTIONS.map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {e.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating} className="gap-1.5">
                <Sparkles className="h-4 w-4" />
                {isCreating || isUpdating
                  ? "Saving..."
                  : editingExercise
                  ? "Update Exercise"
                  : "Create Exercise"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Exercise</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong className="text-foreground">"{exerciseToDelete?.name}"</strong> from the
              database? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
