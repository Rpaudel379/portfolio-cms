"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const LoginPageClient = () => {
  const router = useRouter();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleLogin = async (body: LoginSchema) => {
    const { data, error } = await authClient.signIn.username(body);
    if (data) {
      toast.success("User authenticated successfully", {
        description: "Redirecting to the Dashboard Page",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }

    if (error) {
      if (error.message?.includes("Invalid username or password")) {
        form.setError("username", { message: error.message });
        form.setError("password", { message: error.message });
      } else {
        toast.error("Something went wrong!", {
          description: "Please Try again after some time",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className={cn("flex flex-col gap-6 w-full max-w-sm sm:max-w-md")}>
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center sm:text-left">
            <CardTitle className="text-2xl font-bold">
              Login to your account
            </CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleLogin)}>
              <FieldGroup>
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="username"
                        className="h-11"
                        type="text"
                        disabled={isSubmitting}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>password</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="password"
                        className="h-11"
                        type="password"
                        disabled={isSubmitting}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Field className="gap-3 pt-2">
                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="animate-spin" />}

                    {isSubmitting ? "Logging in..." : "login"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
