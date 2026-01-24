import SkillsPageClient from "@/modules/dashboard/skills";
import { prisma } from "@/lib/prisma";
import { cacheTag } from "next/cache";

const SkillsPage = async () => {
  const getAllSkills = async () => {
    "use cache";
    cacheTag("skills");

    return await prisma.skill.findMany({ orderBy: { updatedAt: "desc" } });
  };

  const skills = await getAllSkills();
  return (
    <div className="space-y-6 mx-auto container">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Technical Skills</h1>
        <p className="text-muted-foreground">
          Manage the technical skills displayed on your about page
        </p>
      </div>

      <SkillsPageClient skills={skills} />
    </div>
  );
};

export default SkillsPage;
