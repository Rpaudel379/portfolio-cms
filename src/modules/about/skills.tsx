import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import React from "react";

const Skills = async () => {
  const getAllSkills = async () => {
    return await prisma.skill.findMany({
      orderBy: { updatedAt: "desc" },
      where: { visible: true },
    });
  };

  const skills = await getAllSkills();

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold mb-6">Technical Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills?.map((skill, index) => (
          <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
            {skill.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default Skills;
