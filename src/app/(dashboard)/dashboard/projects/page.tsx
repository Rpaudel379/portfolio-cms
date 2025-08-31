import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { ProjectPageClient } from "@/modules/dashboard/projects/main";
import { ProjectSchemaDTO } from "@/schema/project.schema";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const ProjectsPage = async () => {
  const getAllProjects = async () => {
    return await prisma.project.findMany({ orderBy: { createdAt: "asc" } });
  };

  const projects = await getAllProjects();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Project
          </Link>
        </Button>
      </div>

      <ProjectPageClient projects={projects as ProjectSchemaDTO[]} />
    </div>
  );
};

export default ProjectsPage;
