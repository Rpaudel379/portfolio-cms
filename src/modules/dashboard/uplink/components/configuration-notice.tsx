import { CloudCog } from "lucide-react";

const UplinkConfigurationNotice = () => (
  <section className="flex items-start gap-4 border-y border-border py-6">
    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground">
      <CloudCog aria-hidden="true" className="size-5" />
    </div>
    <div className="space-y-1 pt-1">
      <h2 className="font-semibold">Storage settings are missing</h2>
      <p className="max-w-xl text-sm leading-6 text-muted-foreground">
        Add the R2 environment settings and public storage domain to enable
        uploads.
      </p>
    </div>
  </section>
);

export { UplinkConfigurationNotice };
