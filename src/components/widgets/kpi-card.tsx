import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  delta?: number;
  deltaDirection?: "up" | "down" | "flat";
  icon?: React.ReactNode;
  description?: string;
}

export function KpiCard({ title, value, delta, deltaDirection, icon, description }: KpiCardProps) {
  return (
    <Card className="relative overflow-hidden border-t-4 border-t-primary/80 shadow-sm animate-fade-up">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-sans">{value}</div>
        {(delta !== undefined || description) && (
          <div className="mt-2 flex items-center text-xs">
            {delta !== undefined && deltaDirection && (
              <Badge 
                variant="outline" 
                className={`mr-2 gap-1 rounded-sm px-1.5 py-0 border-0 ${
                  deltaDirection === "up" ? "bg-success/15 text-success" : 
                  deltaDirection === "down" ? "bg-destructive/15 text-destructive" : 
                  "bg-muted text-muted-foreground"
                }`}
              >
                {deltaDirection === "up" ? <ArrowUpIcon className="h-3 w-3" /> : 
                 deltaDirection === "down" ? <ArrowDownIcon className="h-3 w-3" /> : 
                 <MinusIcon className="h-3 w-3" />}
                {delta}%
              </Badge>
            )}
            {description && <span className="text-muted-foreground">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
