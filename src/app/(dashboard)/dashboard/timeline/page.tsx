import { saveTimeline } from "@/app/(dashboard)/dashboard/timeline/_actions";
import { prisma } from "@/lib/prisma";
import TimelinePageClient from "@/modules/dashboard/timeline/main";
import React from "react";

type Props = {};

const defaultTimeline = [
  {
    id: "1",
    year: "2024",
    title: "Senior Full-Stack Developer",
    company: "TechCorp Solutions",
    description:
      "Leading backend architecture for enterprise applications. Implemented microservices using Node.js and AWS, resulting in 40% improved performance.",
    type: "work",
  },
  {
    id: "2",
    year: "2023",
    title: "Full-Stack Developer",
    company: "StartupXYZ",
    description:
      "Developed and maintained multiple web applications using React, Node.js, and PostgreSQL. Built RESTful APIs serving 10k+ daily active users.",
    type: "work",
  },
  {
    id: "3",
    year: "2021",
    title: "Bachelor's in Computer Science",
    company: "University of Technology",
    description:
      "Graduated with honors. Focused on software engineering, algorithms, and database systems. Completed capstone project on distributed systems.",
    type: "education",
  },
];

const TimelinePage = async () => {
  const getAllTimelines = async () => {
    return await prisma.timeline.findMany({
      orderBy: { createdAt: "asc" },
    });
  };

  const timelines = await getAllTimelines();
  return (
    <>
      <TimelinePageClient
        timelineItems={timelines}
        saveTimeline={saveTimeline}
      />
    </>
  );
};

export default TimelinePage;
