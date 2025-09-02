import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const Features = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Features</CardTitle>
        <CardDescription>
          Mention few key features about your project
        </CardDescription>
      </CardHeader>
      <CardContent className=" space-y-5">
        {fields.map((_, index) => (
          <FormField
            control={control}
            key={index}
            name={`features.${index}`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex gap-2 items-center">
                    <Input {...field} placeholder="Add a key feature" />
                    <Trash
                      className="cursor-pointer text-red-700 hover:text-red-500"
                      onClick={() => remove(index)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="button" variant={"outline"} onClick={() => append("")}>
          Add Feature
        </Button>
      </CardContent>
    </Card>
  );
};

export default Features;
