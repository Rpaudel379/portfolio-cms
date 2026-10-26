"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Copy, LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";

import type { UploadLinkDTO } from "../types";
import { formatDateTime } from "../utils";

const STATUS_PRESENTATION = {
  ACTIVE: {
    label: "Active",
    className:
      "border-emerald-700/30 bg-emerald-700/10 text-emerald-800 dark:text-emerald-300",
  },
  EXPIRED: {
    label: "Expired",
    className: "border-border bg-muted text-muted-foreground",
  },
  USED: {
    label: "Used",
    className: "border-border bg-muted text-muted-foreground",
  },
} as const;

type Props = {
  link: UploadLinkDTO;
  onCopy: (url: string) => Promise<void>;
  onDelete: () => Promise<void>;
};

const UploadLinkItem = ({ link, onCopy, onDelete }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  const status = STATUS_PRESENTATION[link.status];

  return (
    <Item
      variant="outline"
      size="sm"
      role="listitem"
      className="gap-3 sm:flex-nowrap"
    >
      <ItemContent className="min-w-0">
        <ItemTitle className="max-w-full break-words">{link.name}</ItemTitle>
        <ItemDescription className="flex flex-wrap gap-x-4 gap-y-1">
          <span>Issued {formatDateTime(link.createdAt)}</span>
          <span>Expires {formatDateTime(link.expiresAt)}</span>
          {link.usedAt && <span>Used {formatDateTime(link.usedAt)}</span>}
        </ItemDescription>
      </ItemContent>
      <Badge variant="outline" className={status.className}>
        {status.label}
      </Badge>
      <ItemActions className="ml-auto">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={`Copy upload link for ${link.name}`}
          onClick={() => onCopy(link.url)}
        >
          <Copy aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Copy</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
          aria-label={`Delete upload link ${link.name}`}
          disabled={isDeleting}
          onClick={handleDelete}
        >
          {isDeleting ? (
            <LoaderCircle
              aria-hidden="true"
              className="animate-spin motion-reduce:animate-none"
            />
          ) : (
            <Trash2 aria-hidden="true" />
          )}
          <span className="sr-only sm:not-sr-only">Delete</span>
        </Button>
      </ItemActions>
    </Item>
  );
};

export { UploadLinkItem };
