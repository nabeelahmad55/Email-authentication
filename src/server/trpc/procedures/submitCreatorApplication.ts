import { randomUUID } from "crypto";
import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { submitCreatorApplicationToAirtable } from "~/server/airtable";
import { sendCreatorApplicationThankYouEmail } from "~/server/email";

const creatorApplicationInput = z.object({
  // PAGE 1 - Basic Creator Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  age: z.number().min(18, "You must be at least 18 years old"),
  country: z.string().min(1, "Country is required"),
  primaryPlatform: z.enum(["Instagram", "TikTok"], {
    errorMap: () => ({ message: "Please select a platform" }),
  }),
  creatorType: z.enum(["Content Creator", "Influencer", "Photographer/Videographer", "UGC Creator"], {
    errorMap: () => ({ message: "Please select a creator type" }),
  }),

  // PAGE 2 - Platform & Audience Snapshot (conditional)
  platformUsername: z.string().optional(),
  averageViews: z.string().optional(),
  topAudienceLocation: z.string().optional(),
  topAudienceAgeRange: z.string().optional(),

  // PAGE 3 - Declaration
  informationAccurate: z.boolean().refine((val) => val === true, {
    message: "You must confirm your information is accurate",
  }),
});

export const submitCreatorApplication = baseProcedure
  .input(creatorApplicationInput)
  .mutation(async ({ input }) => {
    let applicationId: string;
    let createdAt: Date;

    if (db) {
      // Database is available - use it
      const application = await db.creatorApplication.create({
        data: {
          // PAGE 1 - Basic Creator Information
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          age: input.age,
          country: input.country,
          primaryPlatform: input.primaryPlatform,
          creatorType: input.creatorType,

          // PAGE 2 - Platform & Audience Snapshot
          platformUsername: input.platformUsername,
          averageViews: input.averageViews,
          topAudienceLocation: input.topAudienceLocation,
          topAudienceAgeRange: input.topAudienceAgeRange,

          // PAGE 3 - Declaration
          informationAccurate: input.informationAccurate,

          // Admin
          applicationStatus: "New",
        },
      });
      applicationId = application.id.toString();
      createdAt = application.createdAt;
    } else {
      // Database not available - generate UUID and use current timestamp
      applicationId = randomUUID();
      createdAt = new Date();
    }

    // Sync to Airtable (don't await - fire and forget)
    submitCreatorApplicationToAirtable({
      applicationId: applicationId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      age: input.age,
      country: input.country,
      primaryPlatform: input.primaryPlatform,
      creatorType: input.creatorType,
      platformUsername: input.platformUsername,
      averageViews: input.averageViews,
      topAudienceLocation: input.topAudienceLocation,
      topAudienceAgeRange: input.topAudienceAgeRange,
      submissionDate: createdAt,
    }).catch((error) => {
      // Errors are already logged in the airtable module, but catch here to prevent unhandled promise rejection
      console.error("Unhandled error in Airtable sync:", error);
    });

    // Send thank you email (don't await - fire and forget)
    sendCreatorApplicationThankYouEmail(input.email, input.firstName).catch((error) => {
      // Errors are already logged in the email module, but catch here to prevent unhandled promise rejection
      console.error("Unhandled error sending creator thank you email:", error);
    });

    // Log application received
    console.log(`
    ===== CREATOR APPLICATION RECEIVED =====
    Name: ${input.firstName} ${input.lastName}
    Email: ${input.email}
    Location: ${input.country}
    Platform: ${input.primaryPlatform}
    Creator Type: ${input.creatorType}
    Application ID: ${applicationId}
    ========================================
    `);

    return {
      success: true,
      applicationId: applicationId,
    };
  });
