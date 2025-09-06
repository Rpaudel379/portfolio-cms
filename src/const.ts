export enum StatusEmum {
  LIVE = "LIVE",
  COMPLETE = "COMPLETE",
  INPROGRESS = "INPROGRESS",
  ARCHIVED = "ARCHIVED",
  DEVELOPMENT = "DEVELOPMENT",
  MAINTENANCE = "MAINTENANCE",
}

export enum CategoryEnum {
  "Full-Stack" = "Full-Stack",
  Frontend = "Frontend",
  Backend = "Backend",
  DevOps = "DevOps",
  "AI/ML" = "AI/ML",
  "Other" = "Other",
}

export const sortOptions = ["newest", "oldest", "title"] as const;
