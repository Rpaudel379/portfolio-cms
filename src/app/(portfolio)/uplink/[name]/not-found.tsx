import Link from "next/link";

import { Button } from "@/components/ui/button";

const UplinkObjectNotFound = () => (
  <main className="flex min-h-[65svh] items-center justify-center py-16">
    <section
      aria-labelledby="uplink-not-found-title"
      className="w-full max-w-3xl"
    >
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
        <span>Uplink</span>
        <span aria-hidden="true" className="h-px w-8 bg-border" />
        <span>404 / missing</span>
      </div>

      <p
        aria-hidden="true"
        className="mt-8 text-[clamp(6rem,20vw,12rem)] font-semibold leading-[0.8] tracking-[-0.1em] text-foreground"
      >
        404
      </p>
      <div className="mt-8">
        <h1
          id="uplink-not-found-title"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.08]"
        >
          No file is registered at this address.
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
          Check the link for a typo, or return to the portfolio.
        </p>
        <Button asChild className="mt-7">
          <Link href="/">Return to portfolio</Link>
        </Button>
      </div>
    </section>
  </main>
);

export default UplinkObjectNotFound;
