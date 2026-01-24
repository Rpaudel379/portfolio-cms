import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/modules/dashboard/projects/forms/project-form";
import { ProjectSchemaDTO } from "@/schema/project.schema";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const EditProject = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const getProject = async (id: string) => {
    try {
      return await prisma.project.findFirst({ where: { id } });
    } catch (error) {
      console.log(error);
      throw "something went wrong";
    }
  };

  const project = await getProject(id);
  if (!project) {
    notFound();
  }

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
          <h1 className="text-3xl font-bold tracking-tight">
            {" "}
            Update your Project
          </h1>
          <p className="text-muted-foreground">
            Update an existing project for your portfolio
          </p>
        </div>
      </div>

      <ProjectForm project={project as ProjectSchemaDTO} tags={skills} />
    </div>
  );
};

export default EditProject;
