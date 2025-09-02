import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useFormContext } from "react-hook-form";

export const Challenges = () => {
  const { control } = useFormContext();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Challanges & Solutions</CardTitle>
      </CardHeader>

      <CardContent>
        <FormField
          control={control}
          name="challenges"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Any technical challenges that you faced which developing this project?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
