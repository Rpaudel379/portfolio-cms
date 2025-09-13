"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { Skill } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { ServerActionState } from "@/types/common.types";
import { useCustomAction } from "@/hooks/use-custom-action";
import { toast } from "sonner";
import { SaveSkill } from "@/types/skill.types";
import { useConfirmModal } from "@/hooks/use-confirm";
import { getSkillColumns } from "@/app/(dashboard)/dashboard/skills/_columns";
import { DataTable } from "@/components/table/data-table";
import { SkillSchema, SkillSchemaDTO } from "@/schema/skill.schema";
import Modal from "@/components/modal";
import UpdateSkill from "@/modules/dashboard/skills/form";

type Props = {
  skills: Skill[];
  saveSkill: (
    data: SkillSchema | SkillSchemaDTO
  ) => Promise<ServerActionState<null>>;
  deleteSkill: (id: string) => Promise<ServerActionState<null>>;
};

const SkillsPageClient = ({ skills, saveSkill, deleteSkill }: Props) => {
  const [newSkill, setNewSkill] = useState("");
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const { execute: save, isLoading: isCreating } = useCustomAction(saveSkill, {
    onSuccess(message) {
      toast.success(message);
      setNewSkill("");
      setEditingSkill(null);
    },
    onError(message) {
      toast.error(message);
    },
  });

  const { execute: removeSkill, isLoading: isDeleting } = useCustomAction(
    deleteSkill,
    {
      onSuccess(message) {
        toast.success(message);
      },
      onError(message) {
        toast.error(message);
      },
    }
  );

  const { confirmAction } = useConfirmModal();

  const handleDelete = (id: string) => {
    confirmAction(() => removeSkill(id), "Are you sure you want to delete?");
  };

  const onEdit = (skill: SkillSchemaDTO) => {
    setEditingSkill(skill);
    setOpenModal(true);
  };

  const columns = getSkillColumns({
    onDelete: handleDelete,
    onEdit: onEdit,
    onVisibilityChange: save,
  });

  return (
    <div className="max-wxl space-y-5 mx-auto">
      {" "}
      <Card>
        <CardHeader>
          <CardTitle>Add New Skill</CardTitle>
          <CardDescription>
            Add a new technical skill to your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter skill name (e.g., React, Node.js)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && save({ name: newSkill, visible: true })
              }
              disabled={isCreating}
            />
            <Button
              onClick={() => save({ name: newSkill, visible: true })}
              disabled={isCreating}
            >
              <IconPlus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
      <DataTable columns={columns} data={skills ?? []} />
      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title="Edit skill"
        content={
          <UpdateSkill
            skill={editingSkill!}
            updateSkill={saveSkill}
            onClose={() => {
              setOpenModal(false);
              setEditingSkill(null);
            }}
          />
        }
      />
    </div>
  );
};

export default SkillsPageClient;
