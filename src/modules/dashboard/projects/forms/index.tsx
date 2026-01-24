"use client";

import { saveProjectAction } from "@/app/(dashboard)/dashboard/projects/_actions";
import { Form } from "@/components/ui/form";
import { projectState } from "@/modules/dashboard/projects/state";
import {
  ProjectSchema,
  projectSchema,
  projectSchemaDTO,
  ProjectSchemaDTO,
} from "@/schema/project.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { SkillSchemaDTO } from "@/schema/skill.schema";
import { Links } from "@/modules/dashboard/projects/forms/links";
import Technologies from "@/modules/dashboard/projects/forms/technologies";
import { Thumbnail } from "@/modules/dashboard/projects/forms/thumbnail";
import { FormPreview } from "@/modules/dashboard/projects/forms/form-preview";
import { useRouter } from "next/navigation";
import Features from "@/modules/dashboard/projects/forms/features";
import { Challenges } from "@/modules/dashboard/projects/forms/challenges";
import { useEnhancedAction } from "@/hooks/use-enhanced-action";
import { BasicInformation } from "@/modules/dashboard/projects/forms/basic-information";
import { Tags } from "@/modules/dashboard/projects/forms/tags";
import { useConfirm } from "@/components/confirm-context";

type Props = {
  tags: SkillSchemaDTO[];
  project?: ProjectSchemaDTO;
};

const ProjectForm = ({ project, tags }: Props) => {
  const router = useRouter();
  const stateValues = project ? project : projectState;

  const form = useForm({
    resolver: zodResolver(project ? projectSchemaDTO : projectSchema),
    defaultValues: stateValues,
  });

  const { execute: createProject } = useEnhancedAction(saveProjectAction, {
    onSuccess(message) {
      toast.success(message, { description: "Redirecting to Projects page" });
      setTimeout(() => {
        router.push("/dashboard/projects");
      }, 1500);
    },
    onError(errors) {
      if (errors?.fieldError) {
        Object.entries(errors.fieldError).forEach(([field, message]) => {
          form.setError(field as never, {
            message: message,
          });
        });
      } else {
        toast.error(errors?.message);
      }
    },
  });

  const confirm = useConfirm();

  const handleSubmit = async (data: ProjectSchema | ProjectSchemaDTO) => {
    await confirm({
      title: `Ready to ${project ? "update" : "create"} project?`,
      message: "You can also update this project later.",
      cancelText: "No, Let me change a bit",
      confirmText: "Proceed",
      action: async () => {
        await createProject(data);
      },
    });
  };

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form
            className="space-y-5"
            id="projectForm"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {/* basic information */}
            <BasicInformation />

            {/* tags */}
            <Tags tags={tags} />

            {/* technologies */}
            <Technologies tags={tags} data={project?.technologies} />

            {/* links */}
            <Links />

            <Thumbnail />

            <Features />

            <Challenges />
          </form>
        </div>

        <FormPreview isNew={!project} />
      </div>
    </Form>
  );
};

export default ProjectForm;
