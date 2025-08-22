import { AnimatedBackground } from "@/components/animations/animated-background";
// import { FloatingElements } from "@/components/animations/floating-elements";
import { TypewriterText } from "@/components/animations/typewritter-text";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cover } from "@/components/ui/cover";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
import { ArrowRight, Code, Database, Download, Mail, Star } from "lucide-react";
import Link from "next/link";
import React from "react";

const HomePage = () => {
  const roles = [
    "Software Engineer",
    "Full-Stack Developer",
    "Backend Specialist",
    "Frontend Developer",
    "Problem Solver",
  ];

  return (
    <div className="relative overflow-hidden">
      <AnimatedBackground />
      {/* <FloatingElements /> */}

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-14 md:pt-20  relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side - Name and Introduction */}
            <div className="lg:col-span-7 space-y-8">
              {/* Greeting */}
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="w-fit bg-primary/10 border-primary/20 text-primary animate-pulse"
                >
                  <Star className="w-3 h-3 mr-1" />
                  Available for new opportunities
                </Badge>
                <p className="text-lg text-muted-foreground bg-transparent-home">
                  Hello there! I'm
                </p>
              </div>

              <BackgroundLines className="pointer-events-none">
                {" "}
              </BackgroundLines>

              {/* Name - The Star of the Show */}
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tight">
                  <Cover>
                    <span className="block bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent animate-gradient">
                      ANISH
                    </span>
                    <span className="block text-foreground/80 -mt-2">
                      PAUDEL
                    </span>
                  </Cover>
                </h1>

                {/* Dynamic Role */}
                <div className="flex items-center gap-3 text-xl md:text-2xl bg-transparent-home">
                  <span className="text-muted-foreground">I'm a</span>
                  <TypewriterText
                    text={roles}
                    className="text-primary font-semibold"
                  />
                </div>
              </div>

              {/* Personal Tagline */}
              <div className="space-y-2 bg-transparent-home">
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                  Crafting digital experiences with{" "}
                  <span className="text-primary font-semibold">
                    reliable backend systems
                  </span>{" "}
                  and{" "}
                  <span className="text-primary font-semibold">
                    modern web technologies
                  </span>
                  .
                </p>
                <p className="text-sm md:text-lg text-muted-foreground/80 italic">
                  "I write code that speaks to both machines and the humans who
                  maintain it. " - My development philosophy
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="group relative overflow-hidden"
                >
                  <Link href="/about">
                    <span className="relative z-10">View My Journey</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="group bg-transparent"
                >
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Let's Connect</span>
                  </Link>
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 pt-4">
                <p className="text-sm text-muted-foreground">Find me on:</p>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
                  >
                    <Link href={"http://github.com/rpaudel379"} target="_blank">
                      <IconBrandGithub className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
                  >
                    <Link
                      href={"http://linkedin.com/in/rpaudel379"}
                      target="_blank"
                    >
                      <IconBrandLinkedin className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
                  >
                    <Link href={"/resume"}>
                      <Download className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right side - Profile and Visual Elements */}
            <div className="hidden lg:block lg:col-span-5 relative">
              <div className="relative w-full h-96 lg:h-[600px]">
                {/* Profile Image/Avatar - enhanced for dark mode */}
                <div className="absolute top-8 right-8 z-20">
                  <div className="relative group">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-1 animate-pulse">
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-4xl md:text-5xl font-bold text-primary"></div>
                    </div>
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary to-purple-600 rounded-full opacity-20 dark:opacity-40 blur-xl group-hover:opacity-40 dark:group-hover:opacity-60 transition-opacity" />
                  </div>
                </div>

                {/* Floating Name Elements - enhanced for dark mode */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg animate-float opacity-90 shadow-lg dark:shadow-blue-500/20"></div>
                <div className="absolute bottom-20 left-8 w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg animate-float-delayed opacity-90 shadow-lg dark:shadow-green-500/20"></div>

                {/* Skill Cards - enhanced for dark mode */}
                <Card className="absolute top-16 left-4 w-64 h-48 bg-gradient-to-br from-primary/10 to-purple-600/10 dark:from-primary/20 dark:to-purple-600/20 border-primary/20 dark:border-primary/30 rotate-3 hover:rotate-6 transition-transform duration-500 shadow-xl dark:shadow-primary/10">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <Code className="w-8 h-8 text-primary mb-4" />
                      <h3 className="text-lg font-semibold">
                        Software Engineer
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Node.js • React.js • Java
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Decorative Elements - enhanced for dark mode */}
                <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-bounce opacity-60 dark:opacity-80 shadow-lg dark:shadow-purple-500/20" />
                <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg animate-pulse opacity-50 dark:opacity-70 shadow-lg dark:shadow-yellow-500/20" />
                <div className="absolute top-2/3 right-1/3 w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full animate-ping opacity-40 dark:opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
