import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { toast } from "sonner";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

type Props = {};

export const Thumbnail = ({}: Props) => {
  const { control, setValue, getValues } = useFormContext();

  const [files, setFiles] = useState<File[] | undefined>();
  const [filePreview, setFilePreview] = useState<string | undefined>();

  const handleDrop = (files: File[]) => {
    setFiles(files);
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setFilePreview(url);
      setImage(files[0]);
    }
  };

  const displayError = (e: Error) => {
    toast.error(e.message);
  };

  const handleCancel = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setFiles(undefined);
    setFilePreview(undefined);
    setImage(null);
  };

  const setImage = (file: File | null) => {
    setValue("imageFile", file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Thumbnail</CardTitle>
        <CardDescription>
          Your project image will appear in the card
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="imageFile"
          render={() => (
            <FormItem>
              <FormMessage />
              <Dropzone
                accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
                onDrop={handleDrop}
                onError={displayError}
                src={files}
                className={cn(filePreview && "p-0")}
              >
                <DropzoneEmptyState />
                <DropzoneContent>
                  {filePreview && (
                    <AspectRatio ratio={16 / 9}>
                      <div className="relative h-full w-full">
                        <Image
                          src={filePreview}
                          fill
                          alt="Thumbnail"
                          style={{ objectFit: "cover" }}
                        />
                        <div
                          className="absolute right-2 top-2 group"
                          onClick={handleCancel}
                        >
                          <X className="size-10 text-secondary group-hover:text-primary" />
                        </div>
                      </div>
                    </AspectRatio>
                  )}
                </DropzoneContent>
              </Dropzone>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
