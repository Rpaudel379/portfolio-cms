"use client";

import { projects } from "@/const";
import FilterSort from "@/modules/projects/components/filter-sort";
import { ProjectDrawer } from "@/modules/projects/components/project-drawer";
import ProjectGrid from "@/modules/projects/components/project-grid";
import ResultsInfo from "@/modules/projects/components/results-info";
import SearchBar from "@/modules/projects/components/search";
import { ProjectCategoryEnum, ProjectSchemaDTO } from "@/schema/project.schema";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

type Props = {
  projects: ProjectSchemaDTO[];
};

const ProjectPageClient = ({ projects }: Props) => {
  const [selectedProject, setSelectedProject] =
    useState<ProjectSchemaDTO | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [filterCategory, setFilterCategory] = useState<
    ProjectCategoryEnum | "all"
  >("all");

  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle URL query parameter for project
  useLayoutEffect(() => {
    const projectId = searchParams.get("project");
    if (projectId) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setSelectedProject(project);
        setIsDrawerOpen(true);
      }
    }
  }, [searchParams]);

  const handleProjectSelect = (project: (typeof projects)[0]) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
    // Update URL with project ID
    const url = new URL(window.location.href);
    url.searchParams.set("project", project.id.toString());
    router.push(url.pathname + url.search, { scroll: false });
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    // Remove project query parameter
    const url = new URL(window.location.href);
    url.searchParams.delete("project");
    router.push(url.pathname + (url.search ? url.search : ""), {
      scroll: false,
    });
    setTimeout(() => {
      setSelectedProject(null);
    }, 150);
  };

  // Filter and sort projects based on search and filters
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          project.category.toLowerCase().includes(query) ||
          project.status.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (project) => project.category === filterCategory
      );
    }

    // Sort projects
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, filterCategory, sortBy]);

  return (
    <div>
      <div className="flex flex-col gap-6 mb-12 p-6 bg-card/70 rounded-2xl border">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <FilterSort
          filterCategory={filterCategory}
          setFilterCategory={
            setFilterCategory as Dispatch<SetStateAction<string>>
          }
          sortBy={sortBy}
          setSortBy={setSortBy as Dispatch<SetStateAction<string>>}
        />
      </div>
      <ResultsInfo
        filteredAndSortedProjects={filteredAndSortedProjects}
        searchQuery={searchQuery}
        filterCategory={filterCategory}
        setSearchQuery={setSearchQuery}
        setFilterCategory={
          setFilterCategory as Dispatch<SetStateAction<string>>
        }
      />

      <ProjectGrid
        filteredAndSortedProjects={filteredAndSortedProjects}
        setSearchQuery={setSearchQuery}
        setFilterCategory={
          setFilterCategory as Dispatch<SetStateAction<string>>
        }
        handleProjectSelect={handleProjectSelect}
      />

      <ProjectDrawer
        project={selectedProject as never}
        open={isDrawerOpen}
        onOpenChange={handleDrawerClose}
      />
    </div>
  );
};

export default ProjectPageClient;
