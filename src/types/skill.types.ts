import { Skill } from "@prisma/client";

export type SaveSkill = { name: string; visible: boolean } | Skill;
