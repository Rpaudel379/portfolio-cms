import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfirmModal } from "@/hooks/use-confirm";
import { useCustomAction } from "@/hooks/use-custom-action";
import { ProjectSchemaDTO } from "@/schema/project.schema";
import { ServerActionState } from "@/types/common.types";
import {
  ExternalLinkIcon,
  GithubIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

type Props = {
  project: ProjectSchemaDTO;
  deleteProject: (data: string) => Promise<ServerActionState<void>>;
};

const ProjectCard = ({ project, deleteProject }: Props) => {
  const { execute: removeProject, isLoading: isDeleting } = useCustomAction(
    deleteProject,
    {
      onSuccess(message) {
        toast.success(message);
      },
      onError(message) {
        toast.error(message);
      },
    }
  );

  const { confirmAction } = useConfirmModal();
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Project Image */}
          <div className="w-32 h-24 relative rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={project.thumbnail || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Project Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold truncate">
                    {project.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{project.category}</Badge>
                  <Badge variant="outline">
                    <div className={`w-2 h-2 rounded-full mr-1 `} />
                    {project.status}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-4">
                {project.github && (
                  <Button size="sm" variant="outline" asChild>
                    <Link
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GithubIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {project.demo && (
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/dashboard/projects/${project.id}/edit`}>
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    confirmAction(
                      () => removeProject(project.id),
                      "Are you sure you want to delete this project"
                    )
                  }
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {project.description}
            </p>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {project.tags.slice(0, 4).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.tags.length - 4}
                  </Badge>
                )}
              </div>
            )}

            {/* Technologies */}
            {project.technologies &&
              Object.keys(project.technologies).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {Object.entries(project.technologies)
                    .slice(0, 3)
                    .map(([category, techs]) => (
                      <div key={category} className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {category}
                        </Badge>
                        {techs?.slice(0, 2).map((tech, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    ))}
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
