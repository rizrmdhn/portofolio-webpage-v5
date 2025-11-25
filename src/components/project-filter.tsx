import type { Project } from "@/types/project.types";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface ProjectFilterProps {
  tech: string[];
  onFilterChange?: (selectedTech: string[]) => void;
}

export default function ProjectFilter({
  tech,
  onFilterChange,
}: ProjectFilterProps) {
  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  if (tech.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm">
        No technologies available for filtering.
      </div>
    );
  }

  return (
    <ScrollArea className="w-96 whitespace-nowrap rounded-lg bg-secondary/30 px-3 py-2">
      <div className="flex gap-2">
        {tech.map((techItem) => (
          <Badge
            key={techItem}
            variant="secondary"
            className={cn(
              "cursor-pointer bg-muted transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground",
              selectedTech.includes(techItem)
                ? "bg-primary text-primary-foreground"
                : ""
            )}
            onClick={() => {
              if (selectedTech.includes(techItem)) {
                const newSelection = selectedTech.filter((t) => t !== techItem);
                setSelectedTech(newSelection);
                onFilterChange?.(newSelection);
              } else {
                const newSelection = [...selectedTech, techItem];
                setSelectedTech(newSelection);
                onFilterChange?.(newSelection);
              }
            }}
          >
            {techItem}
          </Badge>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
