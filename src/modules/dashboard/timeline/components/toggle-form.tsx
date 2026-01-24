import { Button } from "@/components/ui/button";
import { IconPlus, IconX } from "@tabler/icons-react";
import React from "react";

type Props = {
  open: boolean;
  onToggle: () => void;
};

export const ToggleForm = ({ open, onToggle }: Props) => {
  return (
    <Button onClick={onToggle}>
      {open ? (
        <>
          <IconX className="h-4 w-4 mr-2" />
          Close
        </>
      ) : (
        <>
          <IconPlus className="h-4 w-4 mr-2" />
          Add Timeline Item
        </>
      )}
    </Button>
  );
};
