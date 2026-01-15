import { Timeline } from "@/components/ui/timeline";
import { prisma } from "@/lib/prisma";
import { cacheTag } from "next/cache";

const Journey = async () => {
  "use cache";
  cacheTag("timeline");
  const getAllTimelines = async () => {
    return await prisma.timeline.findMany({
      orderBy: { order: "desc" },
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
