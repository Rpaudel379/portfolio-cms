import { ProjectSchema } from "@/schema/project.schema";

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
