type Props = {
  title: string;
  description: string;
};

const UploadLinkUnavailable = ({ title, description }: Props) => (
  <main className="mx-auto flex min-h-[65svh] max-w-3xl items-center px-4 py-16">
    <section
      aria-labelledby="upload-link-unavailable-title"
      className="w-full"
    >
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
        Uplink / Shared upload
      </p>
      <div
        role="alert"
        className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-6 sm:p-8"
      >
        <h1
          id="upload-link-unavailable-title"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          {title}
        </h1>
        <p className="mt-3 text-muted-foreground">{description}</p>
      </div>
    </section>
  </main>
);

export default UploadLinkUnavailable;
