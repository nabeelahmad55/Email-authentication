import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { submitInitialSignupToAirtable } from "~/server/airtable";

const platformConnectionInput = z.object({
  platform: z.enum(["instagram", "youtube", "tiktok"]),
  username: z.string().min(1, "Username is required"),
  profileUrl: z.string().min(1, "Profile URL is required"),
  followerCount: z.string().optional(),
  applicationType: z.enum(["creator", "host"]),
});

export const platformConnection = baseProcedure
  .input(platformConnectionInput)
  .mutation(async ({ input }) => {
    let signupId: string;
    let createdAt: Date;
    
    if (db) {
      // Database is available - use it
      const signup = await db.initialApplicationSignup.create({
        data: {
          platform: input.platform,
          username: input.username,
          profileUrl: input.profileUrl,
          followerCount: input.followerCount,
          applicationType: input.applicationType,
        },
      });
      signupId = signup.id.toString();
      createdAt = signup.createdAt;
    } else {
      // Database not available - generate UUID and use current timestamp
      const { randomUUID } = await import("crypto");
      signupId = randomUUID();
      createdAt = new Date();
    }
    
    console.log(`
    ===== PLATFORM CONNECTION RECEIVED =====
    Platform: ${input.platform}
    Username: ${input.username}
    Profile URL: ${input.profileUrl}
    Follower Count: ${input.followerCount || "Not provided"}
    Type: ${input.applicationType}
    Signup ID: ${signupId}
    =========================================
    `);

    // Sync to Airtable (fire and forget)
    submitInitialSignupToAirtable({
      signupId: signupId,
      platform: input.platform,
      username: input.username,
      profileUrl: input.profileUrl,
      followerCount: input.followerCount,
      applicationType: input.applicationType,
      submissionDate: createdAt,
    }).catch((error) => {
      console.error("Error syncing initial signup to Airtable:", error);
    });
    
    return {
      success: true,
      platform: input.platform as "instagram" | "youtube" | "tiktok",
      username: input.username,
      profileUrl: input.profileUrl,
      followerCount: input.followerCount,
      signupId: signupId,
    };
  });
