import { DndContext } from "@dnd-kit/core";
import React from "react";

export const DragContext = ({ children }: { children: React.ReactElement }) => {
  return <DndContext>{children}</DndContext>;
};
