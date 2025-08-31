"use client";

import { Button } from "@/components/ui/button";
import { IconPlus, IconX } from "@tabler/icons-react";
import React, { useState } from "react";

import { deleteTimeline } from "@/app/(dashboard)/dashboard/timeline/_actions";
import { ServerActionState, serverActionState } from "@/types/common.types";
import { TimelineSchemaDTO } from "@/schema/timeline.schema";
import Timelines from "@/modules/dashboard/timeline/timelines";
import { TimelineForm } from "@/modules/dashboard/timeline/timeline-form";

type Props = {
  timelineItems: TimelineSchemaDTO[];
  saveTimeline: (
    prevState: any,
    data: FormData
  ) => Promise<ServerActionState<void>>;
};

const TimelinePageClient = ({ timelineItems, saveTimeline }: Props) => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedTimeline, setSelectedTimeline] =
    useState<TimelineSchemaDTO | null>(null);

  const onTimelineSelect = (selectedTimeline: TimelineSchemaDTO) => {
    setSelectedTimeline(selectedTimeline);
    setOpenForm(true);
  };

  const onFormClose = () => {
    setOpenForm(false);
    setSelectedTimeline(null);
  };

  const onFormToggle = () => {
    setOpenForm((prevState) => !prevState);
    setSelectedTimeline(null);
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
        <Button onClick={onFormToggle}>
          {!openForm ? (
            <>
              <IconPlus className="h-4 w-4 mr-2" />
              Add Timeline Item
            </>
          ) : (
            <>
              <IconX className="h-4 w-4 mr-2" />
              Close
            </>
          )}
        </Button>
      </div>

      {openForm && (
        <TimelineForm
          onFormCancel={onFormToggle}
          saveTimeline={saveTimeline}
          timeline={selectedTimeline}
        />
      )}

      <Timelines
        timelineItems={timelineItems}
        onTimelineSelect={onTimelineSelect}
        deleteTimeline={deleteTimeline}
      />
    </div>
  );
};

export default TimelinePageClient;
