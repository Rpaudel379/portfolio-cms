"use client";

import { saveSkillAction } from "@/app/(dashboard)/dashboard/skills/_actions";
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
import { useEnhancedAction } from "@/hooks/use-enhanced-action";
import { skillSchemaDTO, SkillSchemaDTO } from "@/schema/skill.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  skill: SkillSchemaDTO;
  onClose?: () => void;
};

export const UpdateSkill = ({ skill, onClose }: Props) => {
  const form = useForm({
    resolver: zodResolver(skillSchemaDTO),
    defaultValues: skill,
  });

  const isSubmitting = form.formState.isSubmitting;

  const { execute: update } = useEnhancedAction(saveSkillAction, {
    onSuccess(message) {
      onClose?.();
      toast.success(message);
    },
    onError(errors) {
      if (errors?.fieldError) {
        Object.entries(errors.fieldError).forEach(([field, message]) => {
          form.setError(field as never, {
            message: message,
          });
        });
      } else {
        form.setError("name", {
          message: errors?.message,
        });
      }
    },
  });

  return (
    <div>
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(update)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter name"
                    disabled={isSubmitting}
                  />
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
                    disabled={isSubmitting}
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
            <Button type="submit" disabled={isSubmitting}>
              {!isSubmitting ? (
                <IconPlus className="h-4 w-4 mr-2" />
              ) : (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {!isSubmitting ? "Save changes" : "Saving..."}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
