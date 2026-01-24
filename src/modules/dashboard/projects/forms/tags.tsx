import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { useEnhancedAction } from "@/hooks/use-enhanced-action";
import { saveSkillAction } from "@/app/(dashboard)/dashboard/skills/_actions";
import { toast } from "sonner";
import { SkillSchemaDTO } from "@/schema/skill.schema";

type Props = {
  tags: SkillSchemaDTO[];
};

export const Tags = ({ tags }: Props) => {
  const { control } = useFormContext();

  const { execute: saveTag, isLoading: isCreatingTag } = useEnhancedAction(
    saveSkillAction,
    {
      onLoading(loading) {
        if (loading) {
          toast.loading("creating tag");
        }
      },
      onSuccess(message) {
        toast.dismiss();
        toast.success(message);
      },
      onError(message) {
        toast.dismiss();
        toast.error(message?.message);
      },
    },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
        <CardDescription>Add tags to categorize your project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <MultiSelect onValuesChange={field.onChange} values={field.value}>
                <FormControl>
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select tags..." />
                  </MultiSelectTrigger>
                </FormControl>
                <MultiSelectContent
                  isCreatingTag={isCreatingTag}
                  search={{
                    placeholder: "Search or create...",
                    emptyMessage: "No results found.",
                  }}
                  onCreate={(value: string) => {
                    saveTag({ name: value, visible: false });
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
  );
};
