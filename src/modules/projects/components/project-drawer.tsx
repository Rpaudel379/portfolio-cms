"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  Github,
  X,
  Users,
  Zap,
  Star,
  Calendar,
  Code,
  Lightbulb,
  Wrench,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { ProjectSchemaDTO } from "@/schema/project.schema";

interface ProjectDrawerProps {
  project: ProjectSchemaDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDrawer({
  project,
  open,
  onOpenChange,
}: ProjectDrawerProps) {
  const isMobile = useIsMobile();
  if (!project) return null;

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent
        className={`${
          isMobile ? "h-[90vh]" : "h-full w-[600px] ml-auto"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <DrawerHeader className="flex-shrink-0 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {project.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs border-green-500/30 text-green-600 dark:text-green-400"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                    {project.status}
                  </Badge>
                </div>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Project Image */}
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={project.thumbnail || "/placeholder.svg"}
                alt={project.title}
                width={600}
                height={300}
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Project Details */}
            <div className="space-y-4">
              <DrawerTitle className="text-2xl font-bold leading-tight pr-4">
                {project.title}
              </DrawerTitle>

              <VisuallyHidden>
                <DrawerDescription className="text-base mt-2">
                  {project.description}
                </DrawerDescription>
              </VisuallyHidden>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-medium">Year:</span>
                <span className="text-muted-foreground">{project.year}</span>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  About This Project
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Features */}
            {project.features && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Key Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges */}
            {project.challenges && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-primary" />
                  Technical Challenges & Solutions
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project.challenges}
                </p>
              </div>
            )}

            <Separator />

            {/* All Technologies */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                All Technologies Used
              </h4>
              {project.technologies ? (
                <div className="space-y-4">
                  {Object.entries(project.technologies).map(
                    ([category, techs]) => (
                      <div key={category}>
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">
                          {category}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {techs.map((tech, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Additional spacing at bottom for mobile */}
            <div className="h-4" />
          </div>

          <DrawerFooter>
            {/* Action Buttons */}
            <div className={cn("flex gap-3", isMobile && "mb-5")}>
              {project.demo && (
                <Button asChild className="flex-1">
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.github && (
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 bg-transparent"
                >
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View Code
                  </a>
                </Button>
              )}
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
