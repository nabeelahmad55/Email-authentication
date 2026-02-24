import { randomUUID } from "crypto";
import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";

const initialSignupInput = z.object({
  platform: z.enum(["instagram", "tiktok"]),
  profileHandle: z.string().min(1, "Profile handle is required"),
  applicationType: z.enum(["creator", "host"]),
});

export const initialSignup = baseProcedure
  .input(initialSignupInput)
  .mutation(async ({ input }) => {
    let signupId: string;
    
    if (db) {
      // Database is available - use it
      const signup = await db.initialApplicationSignup.create({
        data: {
          platform: input.platform,
          profileHandle: input.profileHandle,
          applicationType: input.applicationType,
        },
      });
      signupId = signup.id;
    } else {
      // Database not available - generate UUID for logging
      signupId = randomUUID();
    }
    
    console.log(`
    ===== INITIAL SIGNUP RECEIVED =====
    Platform: ${input.platform}
    Handle: ${input.profileHandle}
    Type: ${input.applicationType}
    Signup ID: ${signupId}
    ====================================
    `);
    
    return {
      success: true,
      platform: input.platform,
      profileHandle: input.profileHandle,
      signupId: signupId,
    };
  });
