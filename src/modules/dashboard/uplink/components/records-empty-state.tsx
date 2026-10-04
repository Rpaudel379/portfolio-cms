import { File } from "lucide-react";

const UplinkRecordsEmptyState = () => (
  <div className="flex items-start gap-4 border-b border-dashed border-border py-8">
    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
      <File aria-hidden="true" className="size-5" />
    </div>
    <div className="space-y-1 pt-1">
      <p className="font-medium">Nothing published yet</p>
      <p className="text-sm text-muted-foreground">
        Choose a file above to create your first public route.
      </p>
    </div>
  </div>
);

export { UplinkRecordsEmptyState };
