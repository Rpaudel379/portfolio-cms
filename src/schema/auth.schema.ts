import z from "zod";

export const loginSchema = z.object(
  {
    username: z
      .string()
      .min(3, "Username is very short")
      .max(20, "Username is very long"),
    password: z
      .string()
      .min(3, "Password is very short")
      .max(20, "Password is very long"),
  },
  {
    error: "Login form is invalid",
  },
);

export type LoginSchema = z.infer<typeof loginSchema>;
