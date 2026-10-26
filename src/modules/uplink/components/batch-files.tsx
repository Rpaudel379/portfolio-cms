import { File, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type FileItem = {
  id: string;
  originalName: string;
  contentType: string;
  storageUrl: string;
};

type Props = {
  publicName: string;
  files: FileItem[];
};

const UplinkBatchFiles = ({ publicName, files }: Props) => (
  <main className="mx-auto max-w-6xl px-6 py-14">
    <header className="mb-8 space-y-3">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
        Uplink / File batch
      </p>
      <h1 className="break-all text-3xl font-semibold tracking-tight sm:text-4xl">
        {publicName}
      </h1>
      <p className="text-sm text-muted-foreground">
        {files.length} {files.length === 1 ? "file" : "files"} in this upload.
      </p>
    </header>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {files.map((file) => (
        <article
          key={file.id}
          className="overflow-hidden rounded-xl border bg-card"
        >
          {file.contentType.startsWith("image/") ? (
            <Link
              href={file.storageUrl}
              target="_blank"
              rel="noreferrer"
              className="relative flex aspect-[4/3] items-center justify-center bg-muted/30"
              aria-label={`Open image ${file.originalName}`}
            >
              <Image
                src={file.storageUrl}
                alt={file.originalName}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
                loading="lazy"
                className="size-full object-contain"
              />
            </Link>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center bg-muted/30 text-muted-foreground">
              <File aria-hidden="true" className="size-10" />
            </div>
          )}

          <div className="space-y-2 p-4">
            <h2 className="break-all text-sm font-medium">
              {file.originalName}
            </h2>
            <p className="text-xs text-muted-foreground">{file.contentType}</p>
            <Link
              href={file.storageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Open file
              <ExternalLink aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  </main>
);

export { UplinkBatchFiles };
