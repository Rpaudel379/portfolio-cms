import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProjectSchema, ProjectSchemaDTO } from "@/schema/project.schema";
import { Badge } from "@/components/ui/badge";

type Props = {
  loading: boolean;
};

export const FormPreview = ({ loading }: Props) => {
  const { watch } = useFormContext<ProjectSchemaDTO>();
  const values = watch();

  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Create object URL for uploaded file
  useEffect(() => {
    if (values.imageFile) {
      const url = URL.createObjectURL(values.imageFile);
      setFilePreview(url);

      return () => URL.revokeObjectURL(url); // cleanup
    } else {
      setFilePreview(null);
    }
  }, [values.imageFile]);

  const imageHref = useMemo(() => {
    if (filePreview) return filePreview; // uploaded file preview
    if (values?.thumbnail) return values.thumbnail; // existing project thumbnail
    return null; // nothing
  }, [filePreview, values?.thumbnail]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>How your project will appear</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image Preview */}
          <div className="w-full h-32 relative rounded-lg overflow-hidden bg-muted">
            <Image
              src={
                imageHref ||
                `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(
                  values.title || "Project"
                )}`
              }
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg">
            {values.title || "Project Title"}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {values.description || "Project description will appear here..."}
          </p>

          {/* Tags */}
          {values.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {values.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {values.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{values.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Technologies */}
          {values.technologies &&
            Object.keys(values.technologies).length > 0 && (
              <div className="space-y-2">
                {Object.entries(values.technologies)
                  .slice(0, 2)
                  .map(([category, skills]) => (
                    <div key={category} className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {category}
                      </Badge>
                      {skills.slice(0, 2).map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ))}
              </div>
            )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button
          disabled={loading}
          className="w-full"
          type="submit"
          form="projectForm"
        >
          {loading ? "Adding Project..." : "Add Project"}
        </Button>
        <Button
          variant="outline"
          asChild
          className="w-full bg-transparent"
          type="button"
        >
          <Link href="/dashboard/projects">Cancel</Link>
        </Button>
      </div>
    </div>
  );
};
