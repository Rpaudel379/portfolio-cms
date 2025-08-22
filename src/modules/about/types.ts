export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  company?: string;
  description: string;
  type: "education" | "work" | "project" | "achievement" | "freelance";
  skills?: string[];
  icon?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
}
