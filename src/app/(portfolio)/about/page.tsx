import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import Journey from "@/modules/about/journey";
import { JourneyLoading } from "@/modules/about/journey-fallback";
import Skills from "@/modules/about/skills";
import { SkillsLoading } from "@/modules/about/skills-fallback";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
import { Download, Mail } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";

const AboutPage = () => {
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
                    <Link href={"/resume.pdf"} target="_blank">
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
        <Suspense fallback={<SkillsLoading />}>
          <Skills />
        </Suspense>

        {/* Timeline Section */}
        <Suspense fallback={<JourneyLoading />}>
          <Journey />
        </Suspense>
      </div>
    </div>
  );
};

export default AboutPage;
