import "dotenv/config";

import { z } from "zod";

const emptyStringToUndefined = (value: unknown) =>
  value === "" ? undefined : value;

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default("*"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  GEMINI_API_KEY: z.preprocess(
    emptyStringToUndefined,
    z.string().min(1).optional(),
  ),
});

console.log("REDIS_URL:", process.env.REDIS_URL);
export const env = envSchema.parse(process.env);
