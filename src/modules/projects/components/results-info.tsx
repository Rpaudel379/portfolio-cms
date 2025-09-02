import { Button } from "@/components/ui/button";
import { ProjectSchemaDTO } from "@/schema/project.schema";
import { Search } from "lucide-react";
import React from "react";

type Props = {
  searchQuery: string;
  filteredAndSortedProjects: ProjectSchemaDTO[];
  filterCategory: string;
  setSearchQuery: (value: React.SetStateAction<string>) => void;
  setFilterCategory: (value: React.SetStateAction<string>) => void;
};

const ResultsInfo = ({
  filteredAndSortedProjects,
  searchQuery,
  filterCategory,
  setSearchQuery,
  setFilterCategory,
}: Props) => {
  return (
    <>
      {searchQuery && (
        <div className="flex items-center justify-between px-6 py-4 bg-muted/30 rounded-xl border border-border/50 mb-8">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            <span className="text-sm">
              Found <strong>{filteredAndSortedProjects.length}</strong> project
              {filteredAndSortedProjects.length !== 1 ? "s" : ""}
              {searchQuery && ` matching "${searchQuery}"`}
              {filterCategory !== "All" && ` in ${filterCategory}`}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setFilterCategory("All");
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </Button>
        </div>
      )}
    </>
  );
};

export default ResultsInfo;
