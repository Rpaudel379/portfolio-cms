import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  timelineSchema,
  timelineSchemaDTO,
  TimelineSchemaDTO,
} from "@/schema/timeline.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEnhancedAction } from "@/hooks/use-enhanced-action";
import { saveTimelineAction } from "@/app/(dashboard)/dashboard/timeline/_actions";
import { TimelineTypeEnum } from "@/const";
import { Loader2 } from "lucide-react";

type Props = {
  timeline: TimelineSchemaDTO | null;
  onFormClose: () => void;
};

export const TimelineForm = ({ timeline, onFormClose }: Props) => {
  const form = useForm({
    resolver: zodResolver(timeline ? timelineSchemaDTO : timelineSchema),
    defaultValues: timeline
      ? timeline
      : {
          year: new Date().getFullYear().toString(),
          title: "",
          company: "",
          description: "",
          work_type: TimelineTypeEnum.WORK,
          skills: "",
        },
  });

  const isSubmitting = form.formState.isSubmitting;

  const { execute: save } = useEnhancedAction(saveTimelineAction, {
    onSuccess(message) {
      toast.success(message);
      onFormClose();
    },
    onError(errors) {
      console.log(errors);
      if (errors?.fieldError) {
        Object.entries(errors.fieldError).map(([field, message]) => {
          form.setError(field as never, {
            message: message,
          });
        });
      } else {
        toast.error(errors?.message);
      }
    },
  });

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Add Timeline Item</CardTitle>
          <CardDescription>Add a new milestone to your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit(save)}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="XXXX"
                            disabled={isSubmitting}
                            className="w-fit"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="work_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className="border rounded-lg p-1">
                            <SelectTrigger defaultValue={field.value}>
                              <SelectValue placeholder="Select type to display" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(TimelineTypeEnum).map((type) => (
                              <SelectItem value={type} key={type}>
                                <span>{type}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Senior Full-Stack Developer"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          placeholder="TechCorp Solutions"
                          disabled={isSubmitting}
                        />
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
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={10}
                          placeholder="Brief description of your role and achievements..."
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          placeholder="Enter comma separated skills  node.js, php"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="animate-spin" />}
                  {timeline ? "Update" : "Create"}
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  onClick={onFormClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
