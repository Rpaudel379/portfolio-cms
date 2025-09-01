import { Timeline } from "@/components/ui/timeline";
import { prisma } from "@/lib/prisma";
import React from "react";

const Journey = async () => {
  const getAllTimelines = async () => {
    return await prisma.timeline.findMany({
      orderBy: { order: "asc" },
    });
  };

  const timelines = await getAllTimelines();
  return (
    <div className="relative pt-10 w-full overflow-clip">
      <Timeline items={timelines} />
    </div>
  );
};

export default Journey;
