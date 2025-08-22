import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Timeline } from "@/components/ui/timeline";
import { TimelineItem } from "@/modules/about/types";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
import { Download, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

const AboutPage = () => {
  const skills = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Node.js",
    "React",
    "Next.js",
    "Express",
    "FastAPI",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "AWS",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "REST APIs",
    "Git",
    "Linux",
  ];

  const timelineData: TimelineItem[] = [
    {
      id: "1",
      year: "2023",
      title: "Computer Science Degree",
      company: "University of Technology",
      description:
        "Graduated with honors, specializing in software engineering and web development. Built strong foundations in algorithms, data structures, and modern programming paradigms.",
      type: "education" as const,
      skills: [
        "JavaScript",
        "Python",
        "Java",
        "Database Design",
        "JavaScript",
        "Python",
        "Java",
        "Database Design",
        "JavaScript",
        "Python",
        "Java",
        "Database Design",
      ],
    },
    {
      id: "2",
      year: "2021",
      title: "Frontend Developer",
      company: "TechStart Inc.",
      description:
        "Joined as a junior developer and quickly advanced to building complex user interfaces. Led the redesign of the company's main product, improving user engagement by 40%.",
      type: "work" as const,
      skills: ["React", "TypeScript", "Tailwind CSS", "Figma"],
    },
    {
      id: "3",
      year: "2022",
      title: "E-commerce Platform",
      description:
        "Built a full-stack e-commerce platform from scratch using Next.js and Stripe. The project gained 10k+ users within the first month and was featured in several tech blogs.",
      type: "project" as const,
      skills: ["Next.js", "Stripe", "PostgreSQL", "Vercel"],
    },
    {
      id: "4",
      year: "2023",
      title: "Senior Full-Stack Developer",
      company: "Innovation Labs",
      description:
        "Promoted to senior role, leading a team of 5 developers. Architected microservices infrastructure and mentored junior developers while delivering high-impact features.",
      type: "work" as const,
      skills: ["Node.js", "AWS", "Docker", "Team Leadership"],
    },
    {
      id: "5",
      year: "2024",
      title: "Open Source Contributor",
      description:
        "Became a core contributor to several popular open source projects. My contributions have been used by thousands of developers worldwide, with over 2k GitHub stars.",
      type: "achievement" as const,
      skills: ["Open Source", "Community Building", "Documentation"],
    },
    {
      id: "6",
      year: "2025",
      title: "Tech Lead & Consultant",
      company: "Freelance",
      description:
        "Transitioned to consulting and technical leadership roles. Currently helping startups build scalable web applications and establishing engineering best practices.",
      type: "work" as const,
      skills: ["System Architecture", "Consulting", "Mentoring", "Strategy"],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Me</h1>
          <p className="text-xl text-muted-foreground">
            Get to know more about my journey, skills, and passion for software
            development.
          </p>
        </div>

        {/* Profile Section */}
        <Card className="mb-12 bg-card/50">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-4xl font-bold text-primary-foreground">
                JS
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-4">Anish Paudel</h2>
                <p className="text-muted-foreground mb-6">
                  I'm a passionate software engineer with experience building
                  reliable and robust backend systems. I love solving complex
                  problems and turning ideas into reality through clean,
                  efficient code.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={"/contact"}>
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Me
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={"http://github.com/rpaudel379/"}
                      target="_blank"
                    >
                      <IconBrandGithub className="mr-2 h-4 w-4" />
                      GitHub
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={"https://www.linkedin.com/in/rpaudel379/"}
                      target="_blank"
                    >
                      <IconBrandLinkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={"/resume"} target="_blank">
                      <Download className="mr-2 h-4 w-4" />
                      Resume
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Technical Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm py-1 px-3"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="relative pt-10 w-full overflow-clip">
          <Timeline items={timelineData} />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
