import { Button } from "@/components/ui/button";
import { projects } from "@/const";
import { Search } from "lucide-react";
import React from "react";

type Props = {
  searchQuery: string;
  filteredAndSortedProjects: typeof projects;
  selectedCategory: string;
  setSearchQuery: (value: React.SetStateAction<string>) => void;
  setSelectedCategory: (value: React.SetStateAction<string>) => void;
};

const ResultsInfo = ({
  filteredAndSortedProjects,
  searchQuery,
  selectedCategory,
  setSearchQuery,
  setSelectedCategory,
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
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
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
