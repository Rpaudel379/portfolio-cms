"use client";

import Link from "next/link";

// Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="h-[90vh] flex items-center justify-center">
      <div className="flex flex-col gap-10">
        <h1>Something went wrong</h1>
        {error.message}

        <Link
          href={"/dashboard"}
          className="bg-accent w-fit p-2 rounded-lg hover:bg-primary-foreground"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
