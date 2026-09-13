"use client";

import { FileCheck } from "lucide-react";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { LegalPageListItem } from "@/types";

interface LegalStatsProps {
  items: LegalPageListItem[];
}

export function LegalStats({ items = [] }: LegalStatsProps) {
  const safeItems = Array.isArray(items) ? items : [];
  const total = safeItems.length;

  return (
    <div className="flex items-center justify-start">
      {/* Compact Total Documents Card aligned to left */}
      <Card className="w-full sm:w-64 border-border/60 shadow-xs transition-all hover:shadow-md">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground">Total Documents</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">{total}</p>
            <p className="text-[11px] text-muted-foreground">Published legal policies</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileCheck className="size-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
