"use client";

import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TimelineSchemaDTO } from "@/schema/timeline.schema";
import { SortableItem } from "@/modules/dashboard/timeline/dnd/sortableItem";

type Props = {
  timelines: TimelineSchemaDTO[];
  onTimelineChange: (timelines: TimelineSchemaDTO[]) => void;
  renderItem: (item: TimelineSchemaDTO) => React.ReactNode;
};

export const TimelinesDnd = ({
  timelines,
  onTimelineChange,
  renderItem,
}: Props) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = timelines.findIndex((elm) => elm.id === active.id);
      const newIndex = timelines.findIndex((elem) => elem.id === over?.id);
      onTimelineChange(arrayMove(timelines, oldIndex, newIndex));
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={timelines} strategy={verticalListSortingStrategy}>
        {timelines?.map((timeline) => (
          <SortableItem key={timeline.id} id={timeline.id}>
            {renderItem(timeline)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
};
