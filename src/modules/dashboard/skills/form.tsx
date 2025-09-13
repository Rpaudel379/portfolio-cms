"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { skillSchemaDTO, SkillSchemaDTO } from "@/schema/skill.schema";
import { ServerActionState } from "@/types/common.types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  skill: SkillSchemaDTO;
  updateSkill: (data: SkillSchemaDTO) => Promise<ServerActionState<null>>;
  onClose?: () => void;
};

const UpdateSkill = ({ skill, updateSkill, onClose }: Props) => {
  const form = useForm({
    resolver: zodResolver(skillSchemaDTO),
    defaultValues: skill,
    mode: "onSubmit",
  });

  const handleSubmit = async (data: SkillSchemaDTO) => {
    try {
      const res = await updateSkill(data);
      if (res.status === "success") {
        toast.success(res.message);
        onClose?.();
      } else {
        toast.error(res.message);
        if (res.errors) {
          Object.entries(res.errors).forEach(([field, message]) => {
            form.setError(field as never, {
              message: message[0],
              type: "manual",
            });
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visible"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Visible</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="flex flex-col md:flex-row space-y-4 space-x-4">
            <Button type="button" variant="outline" onClick={() => onClose?.()}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateSkill;
