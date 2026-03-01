import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  BASE_URL: z.string().optional(),
  BASE_URL_OTHER_PORT: z.string().optional(),
  ADMIN_PASSWORD: z.string(),
  DATABASE_URL: z.string().optional(), // Made optional - using Airtable as primary persistence
  // Airtable Integration
  AIRTABLE_PERSONAL_ACCESS_TOKEN: z.string().min(1, "AIRTABLE_PERSONAL_ACCESS_TOKEN is required"),
  AIRTABLE_BASE_ID: z.string().startsWith("app", "AIRTABLE_BASE_ID must start with 'app'"),
  AIRTABLE_CREATOR_TABLE_NAME: z.string().min(1, "AIRTABLE_CREATOR_TABLE_NAME is required"),
  AIRTABLE_HOST_TABLE_NAME: z.string().min(1, "AIRTABLE_HOST_TABLE_NAME is required"),
  AIRTABLE_AMBASSADOR_TABLE_NAME: z.string().min(1, "AIRTABLE_AMBASSADOR_TABLE_NAME is required"),
  AIRTABLE_EMAIL_SUBSCRIBERS_TABLE_NAME: z.string().min(1, "AIRTABLE_EMAIL_SUBSCRIBERS_TABLE_NAME is required"),
  AIRTABLE_HOST_LEADS_TABLE_NAME: z.string().min(1, "AIRTABLE_HOST_LEADS_TABLE_NAME is required"),
  AIRTABLE_INITIAL_SIGNUPS_TABLE_NAME: z.string().min(1, "AIRTABLE_INITIAL_SIGNUPS_TABLE_NAME is required"),
});

export const env = envSchema.parse(process.env);
