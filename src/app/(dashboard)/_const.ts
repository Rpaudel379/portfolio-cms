import {
  IconBriefcase,
  IconCode,
  IconDashboard,
  IconMail,
  IconSettings,
  IconTimeline,
  IconUser,
} from "@tabler/icons-react";

export const dashboardItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: IconDashboard,
  },
];

export const contentItems = [
  {
    title: "Technical Skills",
    url: "/dashboard/skills",
    icon: IconCode,
  },
  {
    title: "Timeline/Journey",
    url: "/dashboard/timeline",
    icon: IconTimeline,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: IconBriefcase,
  },
  {
    title: "Contact Info",
    url: "/dashboard/contact",
    icon: IconMail,
  },
];

export const settingsItems = [
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: IconUser,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: IconSettings,
  },
];
