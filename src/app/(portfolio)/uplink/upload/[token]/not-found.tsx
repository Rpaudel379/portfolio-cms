const UplinkUploadLinkNotFound = () => (
  <main className="mx-auto flex min-h-[65svh] max-w-3xl items-center px-4 py-16">
    <section aria-labelledby="upload-link-not-found-title">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
        Uplink / Shared upload
      </p>
      <h1
        id="upload-link-not-found-title"
        className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl"
      >
        Upload link not found
      </h1>
      <p className="mt-3 text-muted-foreground">
        Check that the link is correct, or ask the sender for a new one.
      </p>
    </section>
  </main>
);

export default UplinkUploadLinkNotFound;
