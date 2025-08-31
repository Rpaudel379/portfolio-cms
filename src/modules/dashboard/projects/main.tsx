"use client";

import FilterSearch from "@/modules/dashboard/projects/filter-search";
import ProjectList from "@/modules/dashboard/projects/project-list";
import { ProjectStats } from "@/modules/dashboard/projects/project-stats";
import {
  ProjectCategoryEnum,
  ProjectSchemaDTO,
  ProjectStatusEnum,
} from "@/schema/project.schema";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";

type Props = {
  projects: ProjectSchemaDTO[];
};

export const ProjectPageClient = ({ projects }: Props) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    ProjectCategoryEnum | "all"
  >("all");
  const [filterStatus, setFilterStatus] = useState<ProjectStatusEnum | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...projects];

    // search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          project.category.toLowerCase().includes(query) ||
          Object.values(project.technologies || {})
            .flat()
            .some((tech) => tech.toLowerCase().includes(query))
      );
    }

    // category
    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (project) => project.category === filterCategory
      );
    }

    // status
    if (filterStatus !== "all") {
      filtered = filtered.filter((project) => project.status === filterStatus);
    }

    // sort
    filtered.sort((a, b) => {
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

    return filtered;
  }, [projects, searchQuery, filterCategory, filterStatus, sortBy]);

  const stats = {
    total: projects.length,
    live: projects.filter((p) => p.status === "LIVE").length,
    development: projects.filter((p) => p.status === "DEVELOPMENT").length,
  };
  return (
    <div className="space-y-6">
      <ProjectStats stats={stats} />

      <FilterSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterCategory={filterCategory}
        setFilterCategory={
          setFilterCategory as Dispatch<SetStateAction<string>>
        }
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus as Dispatch<SetStateAction<string>>}
        sortBy={sortBy}
        setSortBy={setSortBy as Dispatch<SetStateAction<string>>}
      />

      <ProjectList
        projects={filteredAndSortedProjects}
        searchQuery={searchQuery}
        filterCategory={filterCategory}
        filterStatus={filterStatus}
      />
    </div>
  );
};
