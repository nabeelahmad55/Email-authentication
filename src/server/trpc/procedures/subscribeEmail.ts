import { randomUUID } from "crypto";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { env } from "~/server/env";
import { baseProcedure } from "~/server/trpc/main";
import { submitEmailSubscriberToAirtable } from "~/server/airtable";

const subscribeEmailInput = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const subscribeEmail = baseProcedure
  .input(subscribeEmailInput)
  .mutation(async ({ input }) => {
    let subscriberId: string;
    let createdAt: Date;
    
    if (env.DATABASE_URL) {
      try {
        // Database is available - check for duplicates and use it
        const existingSubscriber = await db.emailSubscriber.findUnique({
          where: {
            email: input.email,
          },
        });

        if (existingSubscriber) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This email is already subscribed",
          });
        }

        const subscriber = await db.emailSubscriber.create({
          data: {
            email: input.email,
          },
        });
        
        subscriberId = subscriber.id.toString();
        createdAt = subscriber.createdAt;
      } catch (dbError) {
        if (dbError instanceof TRPCError) throw dbError;
        console.error("Database error in subscribeEmail:", dbError);
        subscriberId = randomUUID();
        createdAt = new Date();
      }
    } else {
      // Database not available - generate UUID and use current timestamp
      // Note: duplicate checking is not available without database
      subscriberId = randomUUID();
      createdAt = new Date();
    }

    console.log(`New email subscription: ${input.email}`);

    // Sync to Airtable (fire and forget)
    submitEmailSubscriberToAirtable({
      subscriberId: subscriberId,
      email: input.email,
      submissionDate: createdAt,
    }).catch((error) => {
      console.error("Error syncing email subscriber to Airtable:", error);
    });

    return {
      success: true,
      subscriberId: subscriberId,
    };
  });
