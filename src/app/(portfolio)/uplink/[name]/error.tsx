"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

const UplinkAssetError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => (
  <main className="flex min-h-[65svh] items-center justify-center py-16">
    <section
      aria-labelledby="uplink-error-title"
      className="w-full max-w-3xl"
    >
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
        <span>Uplink</span>
        <span aria-hidden="true" className="h-px w-8 bg-border" />
        <span>Storage / unavailable</span>
      </div>

      <p
        aria-hidden="true"
        className="mt-8 text-[clamp(6rem,20vw,12rem)] font-semibold leading-[0.8] tracking-[-0.1em] text-destructive"
      >
        !
      </p>
      <div className="mt-8">
        <h1
          id="uplink-error-title"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.08]"
        >
          This file could not be served.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          {error.message ||
            "A temporary problem prevented this file from loading."}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="link" className="px-0">
            <Link href="/">Return to portfolio</Link>
          </Button>
        </div>
      </div>
    </section>
  </main>
);

export default UplinkAssetError;
