import { useFormContext } from "react-hook-form";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const Links = () => {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Links & Media</CardTitle>
        <CardDescription>Project links and media</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormField
              control={control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Repository</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username/project"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={control}
              name="demo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live Demo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://project-demo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
