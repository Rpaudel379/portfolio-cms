"use client"; // Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <h1 className="text-2xl">Global Error</h1>
        <pre>{JSON.stringify(error)}</pre>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
