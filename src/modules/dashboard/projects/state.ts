import { CategoryEnum, StatusEmum } from "@/const";
import { ProjectSchema } from "@/schema/project.schema";

export const projectState = {
  title: "",
  description: "",
  tags: [],
  category: CategoryEnum["Full-Stack"],
  status: StatusEmum.DEVELOPMENT,
  year: new Date().getFullYear().toString(),
  github: "",
  demo: "",
  features: [],
  challenges: "",
  thumbnail: "",
  technologies: {},
  imageFile: null,
} as ProjectSchema;
