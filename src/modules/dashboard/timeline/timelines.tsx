import { TimelineSchemaDTO } from "@/schema/timeline.schema";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { typeIcons } from "@/app/(dashboard)/_const";
import { Button } from "@/components/ui/button";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useConfirmModal } from "@/hooks/use-confirm";
import { ServerActionState } from "@/types/common.types";
import { useCustomAction } from "@/hooks/use-custom-action";
import { toast } from "sonner";
import LimitedBadge from "@/components/limited-badge";
type Props = {
  timelineItems: TimelineSchemaDTO[];
  onTimelineSelect: (data: TimelineSchemaDTO) => void;
  deleteTimeline: (data: string) => Promise<ServerActionState<void>>;
};

const Timelines = ({
  timelineItems,
  onTimelineSelect,
  deleteTimeline,
}: Props) => {
  const { execute: removeTimeline, isLoading: isDeleting } = useCustomAction(
    deleteTimeline,
    {
      onSuccess(message) {
        toast.success(message);
      },
      onError(message) {
        toast.error(message);
      },
    }
  );

  const { confirmAction } = useConfirmModal();

  return (
    <div className="space-y-4">
      {timelineItems
        .sort((a, b) => Number.parseInt(b.year) - Number.parseInt(a.year))
        .map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <span className="text-xl sm:text-2xl">
                      {typeIcons[item.work_type as never]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                        {item.year}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {item.work_type}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-primary font-medium mb-2">
                      {item.company}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>

                    <div className="mt-3">
                      {item.skills && item.skills.length > 0 && (
                        <LimitedBadge
                          variant="outline"
                          className="text-xs bg-secondary hover:bg-primary-foreground transition-colors border-border dark:border-border"
                          items={item.skills.split(",")}
                          maxVisibleItems={6}
                          parentClassName="flex flex-wrap gap-1.5 sm:gap-2 "
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onTimelineSelect(item)}
                  >
                    <IconEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      confirmAction(
                        () => removeTimeline(item.id),
                        "Are you sure you want to delete?"
                      )
                    }
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

      {timelineItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              No timeline items yet. Add your first milestone above.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Timelines;
