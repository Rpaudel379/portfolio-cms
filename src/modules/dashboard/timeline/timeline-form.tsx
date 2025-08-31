import React, { useActionState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { serverActionState, ServerActionState } from "@/types/common.types";
import {
  timelineInitialState,
  timelineTypeEnums,
} from "@/modules/dashboard/timeline/state";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TimelineSchema,
  timelineSchema,
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
import { ChevronDownIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  timeline: TimelineSchemaDTO | null;
  onFormCancel: () => void;
  saveTimeline: (
    prevState: any,
    data: FormData
  ) => Promise<ServerActionState<void>>;
};

export const TimelineForm = ({
  timeline,
  saveTimeline,
  onFormCancel,
}: Props) => {
  const stateValues = timeline ? { values: timeline } : timelineInitialState;

  const [state, action, isPending] = useActionState(saveTimeline, {
    ...serverActionState,
    ...stateValues,
  });

  const form = useForm<TimelineSchema | TimelineSchemaDTO>({
    resolver: zodResolver(timelineSchema),
    defaultValues: state.values as TimelineSchema | TimelineSchemaDTO,
    errors: state.errors!,
    mode: "onBlur",
  });

  useEffect(() => {
    if (state.status) {
      if (state.status === "success") {
        toast.success(state.message);
        setTimeout(() => {
          onFormCancel();
        }, 1000);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Add Timeline Item</CardTitle>
          <CardDescription>Add a new milestone to your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={action} className="space-y-5">
              {timeline && (
                <>
                  <input type="hidden" {...form.register("id")} />
                  <input type="hidden" {...form.register("createdAt")} />
                  <input type="hidden" {...form.register("updatedAt")} />
                </>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year *</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} className="w-fit" />
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
                            {timelineTypeEnums.map((type) => (
                              <SelectItem value={type} key={type}>
                                <span className="capitalize">{type}</span>
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

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Senior Full-Stack Developer"
                          {...field}
                        />
                      </FormControl>
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
                          placeholder="TechCorp Solutions"
                          {...field}
                          value={field.value!}
                        />
                      </FormControl>
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
                          placeholder="Brief description of your role and achievements..."
                          {...field}
                        />
                      </FormControl>
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
                          placeholder="Enter comma separated skills  node.js, php"
                          {...field}
                          value={field.value!}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isPending}>
                  Add Timeline
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  onClick={() => onFormCancel()}
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
