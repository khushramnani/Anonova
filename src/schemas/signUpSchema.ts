import { z } from "zod";

export const usernameValidation = z.string()
  .min(3, "Username must be at least 3 characters long")
  .max(15, "Username cannot exceed 15 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid Email Address" }), // ✅ fixed
  password: z.string().min(5, { message: "Password must be at least 5 characters long" }) // ✅ typo fixed
});
