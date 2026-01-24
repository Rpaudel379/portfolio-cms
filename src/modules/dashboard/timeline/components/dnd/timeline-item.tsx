import { deleteTimelineAction } from "@/app/(dashboard)/dashboard/timeline/_actions";
import { useConfirm } from "@/components/confirm-context";
import LimitedBadge from "@/components/limited-badge";
import { Button } from "@/components/ui/button";
import { typeIcons } from "@/const";
import { useEnhancedAction } from "@/hooks/use-enhanced-action";

import { TimelineSchemaDTO } from "@/schema/timeline.schema";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  item: TimelineSchemaDTO;
  onTimelineSelect: (data: TimelineSchemaDTO) => void;
};

export const TimelineItem = ({ item, onTimelineSelect }: Props) => {
  const { execute: removeTimeline, isLoading: isDeleting } = useEnhancedAction(
    deleteTimelineAction,
    {
      onLoading(loading) {
        if (loading) {
          toast.loading("deleting timeline");
        }
      },
      onSuccess(message) {
        toast.dismiss();
        toast.success(message);
      },
      onError(error) {
        toast.error(error?.message);
      },
    },
  );

  const confirm = useConfirm();

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Do you want to delete this timeline?",
      message: "If you delete this it cannot be undone. Are you sure?",
      confirmText: "Yes, I am",
      cancelText: "No, I am not",
    });

    if (ok) {
      await removeTimeline(item.id);
    }
  };

  return (
    <div className="flex items-start justify-between relative">
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
          <p className="text-primary font-medium mb-2">{item.company}</p>
          <p className="text-muted-foreground text-sm">{item.description}</p>

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
        <Button size="sm" variant="outline" onClick={handleDelete}>
          {isDeleting ? <Loader2 className="animate-spin" /> : <IconTrash />}
        </Button>
      </div>
    </div>
  );
};
