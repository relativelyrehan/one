import { z } from "zod";

export const emailSchema = z.string().email().min(5).max(255);
export const passwordSchema = z
  .string()
  .min(8)
  .max(255)
  .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/);

export const linkSchema = z.string().url().min(5).max(500);
