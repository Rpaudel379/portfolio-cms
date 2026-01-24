import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/modules/dashboard/projects/forms/project-form";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

const NewProject = async () => {
  const getAllSkills = async () => {
    return await prisma.skill.findMany({ orderBy: { updatedAt: "desc" } });
  };

  const skills = await getAllSkills();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/projects">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Project</h1>
          <p className="text-muted-foreground">
            Create a new project for your portfolio
          </p>
        </div>
      </div>

      <ProjectForm tags={skills} />
    </div>
  );
};

export default NewProject;
