import {
  saveSkill,
  deleteSkill,
} from "@/app/(dashboard)/dashboard/skills/_actions";
import SkillsPageClient from "@/modules/dashboard/skills/main";
import { prisma } from "@/lib/prisma";
import React from "react";

const SkillsPage = async () => {
  const getAllSkills = async () => {
    return await prisma.skill.findMany({ orderBy: { updatedAt: "desc" } });
  };

  const skills = await getAllSkills();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Technical Skills</h1>
        <p className="text-muted-foreground">
          Manage the technical skills displayed on your about page
        </p>
      </div>

      <SkillsPageClient
        skills={skills}
        saveSkill={saveSkill}
        deleteSkill={deleteSkill}
      />
    </div>
  );
};

export default SkillsPage;
