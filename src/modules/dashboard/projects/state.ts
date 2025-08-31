import {
  ProjectCategoryEnum,
  ProjectSchema,
  ProjectStatusEnum,
} from "@/schema/project.schema";

export const projectInitialState = {
  errors: null,
  values: {
    title: "",
    description: "",
    tags: [],
    category: "Frontend",
    status: "INPROGRESS",
    year: "",
    github: "",
    demo: "",
    features: [],
    challenges: "",
    thumbnail: "",
    imageId: "",
    imageFile: null,
    technologies: {},
  } as ProjectSchema,
};

export const projectStatusEnums: ProjectStatusEnum[] = [
  "LIVE",
  "INPROGRESS",
  "ARCHIVED",
  "DEVELOPMENT",
  "MAINTENANCE",
];

export const projectCategoryEnums: ProjectCategoryEnum[] = [
  "Full-Stack",
  "Frontend",
  "Backend",
  "DevOps",
  "AI/ML",
];

export const sortOptions = ["newest", "oldest", "title"] as const;
export type SortOptions = typeof sortOptions;
