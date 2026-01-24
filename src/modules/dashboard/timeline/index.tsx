"use client";

import { useState } from "react";

import { bulkUpdateTimelineAction } from "@/app/(dashboard)/dashboard/timeline/_actions";
import { TimelineSchemaDTO } from "@/schema/timeline.schema";
import { TimelineForm } from "@/modules/dashboard/timeline/forms/timeline-form";
import { TimelinesDnd } from "@/modules/dashboard/timeline/components/dnd/timelines-dnd";
import { TimelineItem } from "@/modules/dashboard/timeline/components/dnd/timeline-item";
import { toast } from "sonner";
import { ToggleForm } from "@/modules/dashboard/timeline/components/toggle-form";
import { useEnhancedAction } from "@/hooks/use-enhanced-action";

type Props = {
  timelineItems: TimelineSchemaDTO[];
};

const TimelinePageClient = ({ timelineItems }: Props) => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedTimeline, setSelectedTimeline] =
    useState<TimelineSchemaDTO | null>(null);

  const onTimelineSelect = (selectedTimeline: TimelineSchemaDTO) => {
    setSelectedTimeline(selectedTimeline);
    setOpenForm(true);
  };

  const onFormToggle = () => {
    setOpenForm((prevState) => !prevState);
    setSelectedTimeline(null);
  };

  const { execute: bulkUpdate, isLoading: isBulkUpdating } = useEnhancedAction(
    bulkUpdateTimelineAction,
    {
      onLoading(loading) {
        if (loading) {
          toast.loading("updating timeline...", { description: "Please wait" });
        }
      },
      onSuccess(message) {
        toast.dismiss();
        toast.success(message);
      },
      onError() {
        toast.dismiss();
        toast.error("Failed to update timeline", {
          description: "Please try again after refreshing page",
        });
      },
    },
  );

  const onTimelineChange = async (newTimeline: TimelineSchemaDTO[]) => {
    const orderedTimelines = newTimeline.map((timeline, index) => ({
      ...timeline,
      order: newTimeline.length - index,
    }));

    await bulkUpdate(orderedTimelines);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-5 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Timeline/Journey
          </h1>
          <p className="text-muted-foreground">
            Manage your professional and educational journey
          </p>
        </div>
        <ToggleForm open={openForm} onToggle={onFormToggle} />
      </div>

      {openForm && (
        <TimelineForm onFormClose={onFormToggle} timeline={selectedTimeline} />
      )}

      <div suppressHydrationWarning className="space-y-6 relative">
        {isBulkUpdating && (
          <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-xs" />
        )}
        <TimelinesDnd
          timelines={timelineItems}
          onTimelineChange={onTimelineChange}
          renderItem={(timeline) => (
            <TimelineItem item={timeline} onTimelineSelect={onTimelineSelect} />
          )}
        />
      </div>
    </div>
  );
};

export default TimelinePageClient;
