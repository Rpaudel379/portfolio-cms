import { saveSkillAction } from "@/app/(dashboard)/dashboard/skills/_actions";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEnhancedAction } from "@/hooks/use-enhanced-action";
import { skillSchema } from "@/schema/skill.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export const AddSkill = () => {
  const form = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      visible: true,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const { execute: save } = useEnhancedAction(saveSkillAction, {
    onSuccess(message) {
      toast.success(message);
      form.reset();
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
      <form onSubmit={form.handleSubmit(save)}>
        <FieldGroup>
          <div className="flex flex-row gap-2">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter skill name (e.g., React, Node.js)"
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {!isSubmitting ? (
                <IconPlus className="h-4 w-4 mr-2" />
              ) : (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Add
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
};
