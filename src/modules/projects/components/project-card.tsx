"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Eye } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ProjectSchemaDTO } from "@/schema/project.schema";
import { Tags } from "@/modules/projects/components/tags";
import { StatusEmum } from "@/const";
import { getStatusColor, getStatusDot } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectSchemaDTO;
  onSelect: (project: ProjectSchemaDTO) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <Card
      className="group pt-0 relative overflow-hidden bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/10 cursor-pointer"
      onClick={() => onSelect(project)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-purple-500/5">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={project.thumbnail || "/placeholder.svg"}
            alt={project.title}
            width={400}
            height={300}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </AspectRatio>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant="outline"
            className={`backdrop-blur-sm ${getStatusColor(project.status)}`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 animate-pulse ${getStatusDot(
                project.status
              )}`}
            />
            {project.status}
          </Badge>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {project.title}
        </h3>

        <Tags tags={project.tags} technologies={project.technologies} />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent hover:bg-primary/10 hover:border-primary/30"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(project);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>

          {project.github && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="bg-transparent hover:bg-primary/10 hover:border-primary/30"
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
              </a>
            </Button>
          )}

          {project.demo && (
            <Button size="sm" asChild onClick={(e) => e.stopPropagation()}>
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
