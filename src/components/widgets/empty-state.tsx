import { InboxIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  description = "No items found.", 
  icon = <InboxIcon className="h-10 w-10 text-muted-foreground/50" /> 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-up">
      <div className="bg-muted/30 p-4 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>}
    </div>
  );
}
