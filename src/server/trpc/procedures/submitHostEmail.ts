import { randomUUID } from "crypto";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { submitHostLeadToAirtable } from "~/server/airtable";

const submitHostEmailInput = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const submitHostEmail = baseProcedure
  .input(submitHostEmailInput)
  .mutation(async ({ input }) => {
    let hostLeadId: string;
    let createdAt: Date;
    
    if (db) {
      // Database is available - check for duplicates and use it
      const existingHost = await db.hostLead.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingHost) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This email has already been submitted",
        });
      }

      const hostLead = await db.hostLead.create({
        data: {
          email: input.email,
        },
      });
      
      hostLeadId = hostLead.id.toString();
      createdAt = hostLead.createdAt;
    } else {
      // Database not available - generate UUID and use current timestamp
      // Note: duplicate checking is not available without database
      hostLeadId = randomUUID();
      createdAt = new Date();
    }

    console.log(`New host lead: ${input.email}`);

    // Sync to Airtable (fire and forget)
    submitHostLeadToAirtable({
      hostLeadId: hostLeadId,
      email: input.email,
      submissionDate: createdAt,
    }).catch((error) => {
      console.error("Error syncing host lead to Airtable:", error);
    });

    return {
      success: true,
      hostLeadId: hostLeadId,
    };
  });
