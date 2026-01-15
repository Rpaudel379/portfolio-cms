import { saveTimeline } from "@/app/(dashboard)/dashboard/timeline/_actions";
import { prisma } from "@/lib/prisma";
import TimelinePageClient from "@/modules/dashboard/timeline/main";
import { cacheTag } from "next/cache";

const TimelinePage = async () => {
  "use cache";
  cacheTag("timeline");
  const getAllTimelines = async () => {
    return await prisma.timeline.findMany({
      orderBy: { order: "desc" },
    });
  };

  const timelines = await getAllTimelines();
  return (
    <>
      <TimelinePageClient
        timelineItems={timelines}
        saveTimeline={saveTimeline}
      />
    </>
  );
};

export default TimelinePage;
