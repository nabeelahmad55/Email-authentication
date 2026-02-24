import { randomUUID } from "crypto";
import { z } from "zod";
import { db } from "~/server/db";
import { env } from "~/server/env";
import { baseProcedure } from "~/server/trpc/main";
import { submitAmbassadorApplicationToAirtable } from "~/server/airtable";
import { sendAmbassadorApplicationThankYouEmail } from "~/server/email";

const ambassadorApplicationInput = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  location: z.string().min(1, "Location is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
});

export const submitAmbassadorApplication = baseProcedure
  .input(ambassadorApplicationInput)
  .mutation(async ({ input }) => {
    let applicationId: string;
    let createdAt: Date;

    if (env.DATABASE_URL) {
      try {
        // Database is available - use it
        const application = await db.ambassadorApplication.create({
          data: {
            fullName: input.fullName,
            email: input.email,
            location: input.location,
            experienceLevel: input.experienceLevel,
            applicationStatus: "New",
          },
        });
        applicationId = application.id.toString();
        createdAt = application.createdAt;
      } catch (dbError) {
        console.error("Database error in submitAmbassadorApplication:", dbError);
        applicationId = randomUUID();
        createdAt = new Date();
      }
    } else {
      // Database not available - generate UUID and use current timestamp
      applicationId = randomUUID();
      createdAt = new Date();
    }

    // Sync to Airtable (don't await - fire and forget)
    submitAmbassadorApplicationToAirtable({
      applicationId: applicationId,
      fullName: input.fullName,
      email: input.email,
      location: input.location,
      experienceLevel: input.experienceLevel,
      submissionDate: createdAt,
    }).catch((error) => {
      // Errors are already logged in the airtable module, but catch here to prevent unhandled promise rejection
      console.error("Unhandled error in Airtable sync:", error);
    });

    // Send thank you email (don't await - fire and forget)
    sendAmbassadorApplicationThankYouEmail(input.email, input.fullName).catch((error) => {
      // Errors are already logged in the email module, but catch here to prevent unhandled promise rejection
      console.error("Unhandled error sending ambassador thank you email:", error);
    });

    console.log(`Ambassador application received from ${input.email}`);

    return {
      success: true,
      applicationId: applicationId,
    };
  });
