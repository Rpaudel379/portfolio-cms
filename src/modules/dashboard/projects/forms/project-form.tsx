"use client";

import { saveProject } from "@/app/(dashboard)/dashboard/projects/_actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { projectInitialState } from "@/modules/dashboard/projects/state";
import {
  projectSchema,
  ProjectSchema,
  projectSchemaDTO,
  ProjectSchemaDTO,
} from "@/schema/project.schema";
import { ServerActionState, serverActionState } from "@/types/common.types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SkillSchemaDTO } from "@/schema/skill.schema";
import { useCustomAction } from "@/hooks/use-custom-action";
import { Links } from "@/modules/dashboard/projects/forms/links";
import Technologies from "@/modules/dashboard/projects/forms/technologies";
import { Thumbnail } from "@/modules/dashboard/projects/forms/thumbnail";
import { FormPreview } from "@/modules/dashboard/projects/forms/form-preview";
import { useRouter } from "next/navigation";
import { CategoryEnum, StatusEmum } from "@/const";
import Features from "@/modules/dashboard/projects/forms/features";
import { Challenges } from "@/modules/dashboard/projects/forms/challenges";

type Props = {
  project: ProjectSchemaDTO | null;
  tags: SkillSchemaDTO[] | null;
  saveSkill: (data: string) => Promise<ServerActionState<null>>;
};

const ProjectForm = ({ project, tags, saveSkill }: Props) => {
  const router = useRouter();
  const stateValues = project ? project : projectInitialState.values;

  const form = useForm({
    resolver: zodResolver(project ? projectSchemaDTO : projectSchema),
    defaultValues: stateValues,
    mode: "onSubmit",
  });

  const { execute: saveTag, isLoading: isCreatingSkill } = useCustomAction(
    saveSkill,
    {
      onSuccess(message) {
        toast.success(message);
      },
      onError(message) {
        toast.error(message);
      },
    }
  );

  const handleSubmit = async (data: ProjectSchemaDTO | ProjectSchema) => {
    try {
      const res = await saveProject(data);
      if (res.status === "success") {
        toast.success(res.message, {
          description: "Redirecting to Projects page",
        });

        setTimeout(() => {
          router.push("/dashboard/projects");
        }, 2000);
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
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form
            className="space-y-5"
            id="projectForm"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Essential details about your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title*</FormLabel>

                        <FormControl>
                          <Input placeholder="Your Project title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description *</FormLabel>

                        <FormControl>
                          <Textarea
                            placeholder="Detailed description with technical details, challenges, and solutions..."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger defaultValue={field.value}>
                                <SelectValue placeholder="Select category to display" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(CategoryEnum).map((category) => (
                                <SelectItem value={category} key={category}>
                                  <span className="capitalize">{category}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>{" "}
                          <input
                            type="hidden"
                            name={field.name}
                            value={field.value ?? ""}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger defaultValue={field.value}>
                                <SelectValue placeholder="Select project status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(StatusEmum).map((status) => (
                                <SelectItem
                                  value={status.toString()}
                                  key={status.toString()}
                                >
                                  <span className="capitalize">{status}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>{" "}
                          <input
                            type="hidden"
                            name={field.name}
                            value={field.value ?? ""}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="w-fit">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Year</FormLabel>

                        <FormControl>
                          <Input placeholder="Year" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Add tags to categorize your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <MultiSelect
                        onValuesChange={field.onChange}
                        values={field.value}
                      >
                        <FormControl>
                          <MultiSelectTrigger className="w-full">
                            <MultiSelectValue placeholder="Select tags..." />
                          </MultiSelectTrigger>
                        </FormControl>
                        <MultiSelectContent
                          search={{
                            placeholder: "Search or create...",
                            emptyMessage: "No results found.",
                          }}
                          onCreate={(value: string) => {
                            saveTag(value);
                            field.onChange([...(field.value || []), value]);
                          }}
                        >
                          <MultiSelectGroup>
                            {tags?.map((tag) => (
                              <MultiSelectItem key={tag.id} value={tag.name}>
                                {tag.name}
                              </MultiSelectItem>
                            ))}
                          </MultiSelectGroup>
                        </MultiSelectContent>
                      </MultiSelect>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* technologies */}
            <Technologies tags={tags} data={project?.technologies} />

            {/* links */}
            <Links />

            <Thumbnail />

            <Features />

            <Challenges />
          </form>
        </div>

        <FormPreview loading={false} />
      </div>
    </Form>
  );
};

export default ProjectForm;
