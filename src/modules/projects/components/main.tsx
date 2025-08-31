"use client";

import { projects } from "@/const";
import FilterSort from "@/modules/projects/components/filter-sort";
import { ProjectDrawer } from "@/modules/projects/components/project-drawer";
import ProjectGrid from "@/modules/projects/components/project-grid";
import ResultsInfo from "@/modules/projects/components/results-info";
import SearchBar from "@/modules/projects/components/search";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";

type Props = {
  projects: typeof projects;
  categories: string[];
  sortOptions: string[];
};

const ProjectPageClient = ({ projects, categories, sortOptions }: Props) => {
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Latest");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle URL query parameter for project
  useLayoutEffect(() => {
    const projectId = searchParams.get("project");
    if (projectId) {
      const project = projects.find((p) => p.id === Number.parseInt(projectId));
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
          project.longDescription?.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          project.category.toLowerCase().includes(query) ||
          project.status.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (project) => project.category === selectedCategory
      );
    }
    alert("refine filter case - createdAt");
    // Sort projects
    const sorted = [...filtered].sort((a, b) => {
      switch (selectedSort) {
        case "Latest":
          return Number.parseInt(b.year) - Number.parseInt(a.year);
        case "Popular":
          return (b.stats?.rating || 0) - (a.stats?.rating || 0);
        case "A-Z":
          return a.title.localeCompare(b.title);
        case "Rating":
          return (b.stats?.rating || 0) - (a.stats?.rating || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, selectedCategory, selectedSort]);

  return (
    <div>
      <div className="flex flex-col gap-6 mb-12 p-6 bg-card/70 rounded-2xl border">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <FilterSort
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          sortOptions={sortOptions}
        />
      </div>
      <ResultsInfo
        filteredAndSortedProjects={filteredAndSortedProjects}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        setSearchQuery={setSearchQuery}
        setSelectedCategory={setSelectedCategory}
      />

      <ProjectGrid
        filteredAndSortedProjects={filteredAndSortedProjects}
        setSearchQuery={setSearchQuery}
        setSelectedCategory={setSelectedCategory}
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
