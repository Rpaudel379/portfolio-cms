import { Button } from "@/components/ui/button";
import { projects } from "@/const";
import { ProjectCard } from "@/modules/projects/components/project-card";
import { Search } from "lucide-react";
import React from "react";

type Props = {
  filteredAndSortedProjects: typeof projects;
  setSearchQuery: (value: React.SetStateAction<string>) => void;
  setSelectedCategory: (value: React.SetStateAction<string>) => void;
  handleProjectSelect: (project: (typeof projects)[0]) => void;
};

const ProjectGrid = ({
  filteredAndSortedProjects,
  setSearchQuery,
  setSelectedCategory,
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
              setSelectedCategory("All");
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
