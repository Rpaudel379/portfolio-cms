import { deleteProject } from "@/app/(dashboard)/dashboard/projects/_actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProjectCard from "@/modules/dashboard/projects/project-card";
import { ProjectSchemaDTO } from "@/schema/project.schema";
import { BarChart3Icon, PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  projects: ProjectSchemaDTO[];
  searchQuery: string;
  filterCategory: string;
  filterStatus: string;
};

const ProjectList = ({
  projects,
  searchQuery,
  filterCategory,
  filterStatus,
}: Props) => {
  if (!projects.length) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
            <BarChart3Icon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || filterCategory !== "all" || filterStatus !== "all"
              ? "Try adjusting your search terms or filters."
              : "Get started by adding your first project."}
          </p>
          <Button asChild>
            <Link href="/dashboard/projects/new">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Your First Project
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          deleteProject={deleteProject}
        />
      ))}
    </div>
  );
};

export default ProjectList;
