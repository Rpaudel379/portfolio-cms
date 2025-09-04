export const dynamic = "force-static"; // 👈 ensures static generation

import { prisma } from "@/lib/prisma";
import ProjectPageClient from "@/modules/projects/components/main";
import { ProjectSchemaDTO } from "@/schema/project.schema";
import { Suspense } from "react";

const ProjectPage = async () => {
  const getAllProjects = async () => {
    return await prisma.project.findMany({ orderBy: { createdAt: "asc" } });
  };

  const projects = await getAllProjects();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            My{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A showcase of innovative solutions I've built. Each project
            represents a unique challenge solved with modern technologies.
          </p>
        </div>

        {/* client component */}

        <Suspense>
          <ProjectPageClient projects={projects as ProjectSchemaDTO[]} />
        </Suspense>
      </div>
    </div>
  );
};

export default ProjectPage;
