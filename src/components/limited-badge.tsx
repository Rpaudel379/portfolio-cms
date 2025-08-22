import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { div } from "motion/react-client";
import React, { useState } from "react";

type Props<T> = {
  variant: "default" | "secondary" | "destructive" | "outline";
  className: string;
  items: T;
  parentClassName?: string;
  maxVisibleItems?: number;
};

const LimitedBadge = ({
  variant,
  className,
  items,
  maxVisibleItems = 6,
  parentClassName,
}: Props<string[]>) => {
  const [showAllItems, setshowAllItems] = useState(false);

  const visibleItems = showAllItems ? items : items.slice(0, maxVisibleItems);

  const hasMoreItems = items.length > maxVisibleItems;

  return (
    <div
      className={cn(parentClassName)}
      onMouseEnter={() => setshowAllItems(true)}
      onMouseLeave={() => setshowAllItems(false)}
    >
      {visibleItems.map((item, index) => (
        <Badge key={index} variant={variant} className={className}>
          {item}
        </Badge>
      ))}

      {hasMoreItems && !showAllItems && (
        <Badge variant={variant} className={cn(className)}>
          +{items.length - visibleItems.length} more
        </Badge>
      )}
    </div>
  );
};

export default LimitedBadge;
