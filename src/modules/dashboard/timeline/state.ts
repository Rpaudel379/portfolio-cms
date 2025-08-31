import { TimelineSchema, TimelineTypeEnum } from "@/schema/timeline.schema";

export const timelineInitialState = {
  errors: null,
  values: {
    year: "",
    title: "",
    company: "",
    description: "",
    work_type: "WORK",
    skills: "",
  } as TimelineSchema,
};

export const timelineTypeEnums: TimelineTypeEnum[] = [
  "WORK",
  "EDUCATION",
  "FREELANCE",
  "PROJECT",
  "ACHIEVEMENT",
];
