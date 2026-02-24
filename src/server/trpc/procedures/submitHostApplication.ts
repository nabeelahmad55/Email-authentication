import { randomUUID } from "crypto";
import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { submitHostApplicationToAirtable } from "~/server/airtable";
import { sendHostApplicationThankYouEmail } from "~/server/email";

const hostApplicationInput = z.object({
  // Step 1 - Business Information
  businessOrPropertyName: z.string().min(1, "Business or property name is required"),
  propertyType: z.string().min(1, "Property type is required"),
  propertyWebsiteOrListingLink: z.string().min(1, "Website or listing link is required"),
  country: z.string().min(1, "Country is required"),

  // Step 2 - Contact Information
  contactEmail: z.string().email("Valid email is required"),
  primaryContactFullName: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().optional(),
  primaryContactRole: z.string().min(1, "Role is required"),
  otherRoleDescription: z.string().optional(),

  // Step 3 - Property Details
  numberOfRoomsOrUnits: z.number().optional(),
  targetGuestType: z.string().optional(),
  amenities: z.array(z.string()).min(1, "Select at least one amenity"),
  peakSeasons: z.string().optional(),

  // Step 4 - Collaboration Goals
  collaborationObjectives: z.string().min(1, "Collaboration objectives are required"),
  additionalNotes: z.string().optional(),
  previousCreatorExperience: z.boolean(),

  // Confirmations
  informationAccurate: z.boolean().refine((val) => val === true, {
    message: "You must confirm the information is accurate",
  }),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms & Privacy Policy",
  }),
});

export const submitHostApplication = baseProcedure
  .input(hostApplicationInput)
  .mutation(async ({ input }) => {
    let applicationId: string;
    let createdAt: Date;

    if (db) {
      // Database is available - use it
      const application = await db.hostApplication.create({
        data: {
          // Step 1 - Business Information
          businessOrPropertyName: input.businessOrPropertyName,
          propertyType: input.propertyType,
          propertyWebsiteOrListingLink: input.propertyWebsiteOrListingLink,
          country: input.country,

          // Step 2 - Contact Information
          contactEmail: input.contactEmail,
          primaryContactFullName: input.primaryContactFullName,
          phoneNumber: input.phoneNumber,
          primaryContactRole: input.primaryContactRole,
          primaryContactOtherRoleDescription: input.otherRoleDescription,

          // Step 3 - Property Details
          numberOfRoomsOrUnits: input.numberOfRoomsOrUnits,
          targetGuestType: input.targetGuestType,
          amenities: input.amenities,
          peakSeasons: input.peakSeasons,

          // Step 4 - Collaboration Goals
          collaborationObjectives: input.collaborationObjectives,
          additionalNotes: input.additionalNotes,
          previousCreatorExperience: input.previousCreatorExperience,

          // Confirmations
          informationAccurate: input.informationAccurate,
          agreedToTerms: input.agreedToTerms,

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
    submitHostApplicationToAirtable({
      applicationId: applicationId,
      businessOrPropertyName: input.businessOrPropertyName,
      propertyType: input.propertyType,
      propertyWebsiteOrListingLink: input.propertyWebsiteOrListingLink,
      country: input.country,
      contactEmail: input.contactEmail,
      primaryContactFullName: input.primaryContactFullName,
      phoneNumber: input.phoneNumber,
      primaryContactRole: input.primaryContactRole,
      primaryContactOtherRoleDescription: input.otherRoleDescription,
      numberOfRoomsOrUnits: input.numberOfRoomsOrUnits,
      targetGuestType: input.targetGuestType,
      amenities: input.amenities, // Already an array from the input
      peakSeasons: input.peakSeasons,
      collaborationObjectives: input.collaborationObjectives,
      additionalNotes: input.additionalNotes,
      previousCreatorExperience: input.previousCreatorExperience,
      submissionDate: createdAt,
    }).catch((error) => {
      // Errors are already logged in the airtable module, but catch here to prevent unhandled promise rejection
      console.error("Unhandled error in Airtable sync:", error);
    });

    // Send thank you email (don't await - fire and forget)
    sendHostApplicationThankYouEmail(input.contactEmail, input.primaryContactFullName).catch((error: unknown) => {
      // Errors are already logged in the email module, but catch here to prevent unhandled promise rejection
      console.error("Unhandled error sending host thank you email:", error);
    });

    // Log application received
    console.log(`
    ===== HOST APPLICATION RECEIVED =====
    Property: ${input.businessOrPropertyName}
    Location: ${input.country}
    Contact: ${input.contactEmail}
    Application ID: ${applicationId}
    =====================================
    `);

    return {
      success: true,
      applicationId: applicationId,
    };
  });
