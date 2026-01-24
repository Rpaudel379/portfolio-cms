"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skill } from "@prisma/client";

import { toast } from "sonner";
import { getSkillColumns } from "@/app/(dashboard)/dashboard/skills/_columns";
import { DataTable } from "@/components/table/data-table";
import { SkillSchemaDTO } from "@/schema/skill.schema";
import Modal from "@/components/modal";
import { UpdateSkill } from "@/modules/dashboard/skills/form/update-skill";
import {
  deleteSkillAction,
  saveSkillAction,
} from "@/app/(dashboard)/dashboard/skills/_actions";
import { useEnhancedAction } from "@/hooks/use-enhanced-action";
import { useConfirm } from "@/components/confirm-context";
import { AddSkill } from "@/modules/dashboard/skills/form/add-skill";

type Props = {
  skills: Skill[];
};

const SkillsPageClient = ({ skills }: Props) => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const isOpen = Boolean(selectedSkill);

  const { execute: handleVisibility } = useEnhancedAction(saveSkillAction, {
    onLoading(loading) {
      if (loading) {
        toast.loading("updating visibility");
      }
    },
    onSuccess() {
      toast.dismiss();
      toast.success("visibility updated");
    },
    onError(errors) {
      toast.error(errors?.message || "Request Failed");
    },
  });

  const { execute: remove } = useEnhancedAction(deleteSkillAction, {
    onSuccess(message) {
      toast.success(message);
    },
    onError(errors) {
      toast.error(errors?.message || "Request Failed");
    },
  });

  const confirm = useConfirm();

  const handleDelete = async (id: string) => {
    await confirm({
      message: "Are you sure you want to delete this skill tag?",
      title: "Delete Skill",
      cancelText: "No",
      confirmText: "Yes",
      action: async () => {
        await remove(id);
      },
    });
  };

  const handleEdit = (skill: SkillSchemaDTO) => {
    setSelectedSkill(skill);
  };

  const columns = getSkillColumns({
    onDelete: handleDelete,
    onEdit: handleEdit,
    onVisibilityChange: handleVisibility,
  });

  return (
    <div className="max-w-7xl space-y-5 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Skill</CardTitle>
          <CardDescription>
            Add a new technical skill to your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddSkill />
        </CardContent>
      </Card>
      {/* list of skills */}
      <DataTable columns={columns} data={skills ?? []} />
      <Modal
        open={isOpen}
        onOpenChange={(open) => !open && setSelectedSkill(null)}
        title="Edit skill"
        content={
          <UpdateSkill
            skill={selectedSkill!}
            onClose={() => {
              setSelectedSkill(null);
            }}
          />
        }
      />
    </div>
  );
};

export default SkillsPageClient;
