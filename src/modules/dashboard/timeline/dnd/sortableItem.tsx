"use client";

import React, { PropsWithChildren } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { GripVertical } from "lucide-react";

type Props = {
  id: string;
};

export function SortableItem({ id, children }: PropsWithChildren<Props>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    setActivatorNodeRef,
    transition,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} role="application">
      <Card>
        <CardHeader>
          <CardTitle ref={setActivatorNodeRef} {...attributes} {...listeners}>
            <GripVertical className="cursor-pointer text-primary hover:text-primary/70 active:text-blue-400" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </div>
  );
}
