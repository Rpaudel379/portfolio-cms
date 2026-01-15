import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/modules/projects/components/project-card";
import { ProjectSchemaDTO } from "@/schema/project.schema";
import { Search } from "lucide-react";
import React from "react";

type Props = {
  filteredAndSortedProjects: ProjectSchemaDTO[];
  setSearchQuery: (value: React.SetStateAction<string>) => void;
  setFilterCategory: (value: React.SetStateAction<string>) => void;
  handleProjectSelect: (project: ProjectSchemaDTO) => void;
};

const ProjectGrid = ({
  filteredAndSortedProjects,
  setSearchQuery,
  setFilterCategory,
  handleProjectSelect,
}: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {filteredAndSortedProjects.length > 0 ? (
        filteredAndSortedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project as never}
            onSelect={handleProjectSelect as never}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters to find what you're
            looking for.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setFilterCategory("all");
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectGrid;
