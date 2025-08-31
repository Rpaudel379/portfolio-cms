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

type Props = {
  skills: Skill[];
  saveSkill: (data: SaveSkill) => Promise<ServerActionState<null>>;
  deleteSkill: (id: string) => Promise<ServerActionState<null>>;
};

const SkillsPageClient = ({ skills, saveSkill, deleteSkill }: Props) => {
  const [newSkill, setNewSkill] = useState("");
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

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

  return (
    <div className="max-w-4xl space-y-5">
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
              onKeyDown={(e) => e.key === "Enter" && save(newSkill)}
              disabled={isCreating}
            />
            <Button onClick={() => save(newSkill)} disabled={isCreating}>
              <IconPlus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Current Skills ({skills.length})</CardTitle>
          <CardDescription>
            These skills are displayed on your about page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div key={skill.id} className="group relative">
                {editingSkill?.id === skill.id ? (
                  <div className="flex gap-1">
                    <Input
                      value={editingSkill.name}
                      onChange={(e) =>
                        setEditingSkill({
                          ...editingSkill,
                          name: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          save(editingSkill);
                        }
                        if (e.key === "Escape") {
                          setEditingSkill(null);
                        }
                      }}
                      className="h-8 text-sm"
                      autoFocus
                    />
                    <Button size="sm" onClick={() => save(editingSkill)}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingSkill(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Badge
                    variant="secondary"
                    className="text-sm py-1 px-3 pr-8 relative group-hover:pr-16 transition-all"
                  >
                    {skill.name}
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0"
                        onClick={() => setEditingSkill(skill)}
                      >
                        <IconEdit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                        onClick={() =>
                          confirmAction(
                            () => removeSkill(skill.id),
                            "Are you sure you want to delete?"
                          )
                        }
                      >
                        <IconTrash className="h-3 w-3" />
                      </Button>
                    </div>
                  </Badge>
                )}
              </div>
            ))}
          </div>
          {skills.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No skills added yet. Add your first skill above.
            </p>
          )}
        </CardContent>
      </Card>{" "}
    </div>
  );
};

export default SkillsPageClient;
