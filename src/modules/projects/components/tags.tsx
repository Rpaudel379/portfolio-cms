import { Badge } from "@/components/ui/badge";
import React from "react";

type Props = {
  tags: string[];
  technologies?: Record<string, string[]> | null | undefined;
};

export const Tags = ({ tags, technologies }: Props) => {
  let displayTags: string[] = [];

  if (tags.length > 2) {
    displayTags = tags;
  } else {
    const t = technologies ? Object.values(technologies ?? {}).flat() : [];
    displayTags = [...tags, ...t];
  }

  const maxVisibleTags = 7;
  const visibleTags = displayTags.slice(0, maxVisibleTags);
  const remainingCount = displayTags.length - visibleTags.length;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleTags.map((tag, index) => (
        <Badge
          key={index}
          variant="outline"
          className="text-xs bg-secondary/50 hover:bg-primary/10 hover:border-primary/30 transition-colors"
        >
          {tag}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-xs bg-muted/50">
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
};
