import Airtable from "airtable";
import { env } from "~/server/env";

// Initialize Airtable client with Personal Access Token
const airtable = new Airtable({ apiKey: env.AIRTABLE_PERSONAL_ACCESS_TOKEN });
const base = airtable.base(env.AIRTABLE_BASE_ID);

/**
 * Submit a creator application to Airtable
 * Maps database fields to Airtable field names as defined in AIRTABLE_INTEGRATION.md
 */
export async function submitCreatorApplicationToAirtable(data: {
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  country: string;
  primaryPlatform: string;
  creatorType: string;
  platformUsername?: string | null;
  averageViews?: string | null;
  topAudienceLocation?: string | null;
  topAudienceAgeRange?: string | null;
  submissionDate: Date;
}) {
  try {
    await base(env.AIRTABLE_CREATOR_TABLE_NAME).create([
      {
        fields: {
          "Application ID": data.applicationId.toString(),
          "First Name": data.firstName,
          "Last Name": data.lastName,
          "Email": data.email,
          "Age": data.age,
          "Country": data.country,
          "Primary Platform": data.primaryPlatform,
          "Creator Type": data.creatorType,
          "Platform Username": data.platformUsername || "",
          "Average Views": data.averageViews || "",
          "Top Audience Location": data.topAudienceLocation || "",
          "Top Audience Age Range": data.topAudienceAgeRange || "",
          "Submission Date": data.submissionDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
          "Status": "New",
        },
      },
    ]);
    console.log(`✓ Creator application ${data.applicationId} synced to Airtable`);
  } catch (error) {
    console.error(`✗ Failed to sync creator application ${data.applicationId} to Airtable:`, error);
    // Don't throw - we don't want Airtable failures to prevent database saves
  }
}

/**
 * Submit a host application to Airtable
 * Maps database fields to Airtable field names as defined in AIRTABLE_INTEGRATION.md
 */
export async function submitHostApplicationToAirtable(data: {
  applicationId: string;
  businessOrPropertyName: string;
  propertyType: string;
  propertyWebsiteOrListingLink: string;
  country: string;
  contactEmail: string;
  primaryContactFullName: string;
  phoneNumber?: string | null;
  primaryContactRole: string;
  primaryContactOtherRoleDescription?: string | null;
  numberOfRoomsOrUnits?: number | null;
  targetGuestType?: string | null;
  amenities: string[]; // Already parsed from JSON
  peakSeasons?: string | null;
  collaborationObjectives: string;
  additionalNotes?: string | null;
  previousCreatorExperience: boolean;
  submissionDate: Date;
}) {
  try {
    await base(env.AIRTABLE_HOST_TABLE_NAME).create([
      {
        fields: {
          "Application ID": data.applicationId.toString(),
          "Business/Property Name": data.businessOrPropertyName,
          "Property Type": data.propertyType,
          "Website": data.propertyWebsiteOrListingLink,
          "Country": data.country,
          "Email": data.contactEmail,
          "Contact Name": data.primaryContactFullName,
          "Phone": data.phoneNumber || "",
          "Contact Role": data.primaryContactRole,
          "Other Role Description": data.primaryContactOtherRoleDescription || "",
          "Number of Rooms/Units": data.numberOfRoomsOrUnits || 0,
          "Target Guest Type": data.targetGuestType || "",
          "Amenities": data.amenities, // Multiple select - pass as array
          "Peak Seasons": data.peakSeasons || "",
          "Collaboration Objectives": data.collaborationObjectives,
          "Additional Notes": data.additionalNotes || "",
          "Previous Creator Experience": data.previousCreatorExperience ? "Yes" : "No",
          "Submission Date": data.submissionDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
          "Status": "New",
        },
      },
    ]);
    console.log(`✓ Host application ${data.applicationId} synced to Airtable`);
  } catch (error) {
    console.error(`✗ Failed to sync host application ${data.applicationId} to Airtable:`, error);
    // Don't throw - we don't want Airtable failures to prevent database saves
  }
}

/**
 * Submit an ambassador application to Airtable
 * Maps database fields to Airtable field names as defined in AIRTABLE_INTEGRATION.md
 */
export async function submitAmbassadorApplicationToAirtable(data: {
  applicationId: string;
  fullName: string;
  email: string;
  location: string;
  experienceLevel: string;
  submissionDate: Date;
}) {
  try {
    await base(env.AIRTABLE_AMBASSADOR_TABLE_NAME).create([
      {
        fields: {
          "Application ID": data.applicationId.toString(),
          "Full Name": data.fullName,
          "Email": data.email,
          "Location": data.location,
          "Experience Level": data.experienceLevel,
          "Submission Date": data.submissionDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
          "Status": "New",
        },
      },
    ]);
    console.log(`✓ Ambassador application ${data.applicationId} synced to Airtable`);
  } catch (error) {
    console.error(`✗ Failed to sync ambassador application ${data.applicationId} to Airtable:`, error);
    // Don't throw - we don't want Airtable failures to prevent database saves
  }
}

/**
 * Submit an email subscriber to Airtable
 * For newsletter signups from the footer form
 */
export async function submitEmailSubscriberToAirtable(data: {
  subscriberId: string;
  email: string;
  submissionDate: Date;
}) {
  try {
    await base(env.AIRTABLE_EMAIL_SUBSCRIBERS_TABLE_NAME).create([
      {
        fields: {
          "Subscriber ID": data.subscriberId.toString(),
          "Email": data.email,
          "Submission Date": data.submissionDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
          "Status": "Active",
        },
      },
    ]);
    console.log(`✓ Email subscriber ${data.subscriberId} synced to Airtable`);
  } catch (error) {
    console.error(`✗ Failed to sync email subscriber ${data.subscriberId} to Airtable:`, error);
    // Don't throw - we don't want Airtable failures to prevent database saves
  }
}

/**
 * Submit a host lead to Airtable
 * For host email submissions from the host interest form
 */
export async function submitHostLeadToAirtable(data: {
  hostLeadId: string;
  email: string;
  submissionDate: Date;
}) {
  try {
    await base(env.AIRTABLE_HOST_LEADS_TABLE_NAME).create([
      {
        fields: {
          "Lead ID": data.hostLeadId.toString(),
          "Email": data.email,
          "Submission Date": data.submissionDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
          "Status": "New",
        },
      },
    ]);
    console.log(`✓ Host lead ${data.hostLeadId} synced to Airtable`);
  } catch (error) {
    console.error(`✗ Failed to sync host lead ${data.hostLeadId} to Airtable:`, error);
    // Don't throw - we don't want Airtable failures to prevent database saves
  }
}

/**
 * Submit an initial signup to Airtable
 * For platform connection data from the initial signup flow
 */
export async function submitInitialSignupToAirtable(data: {
  signupId: string;
  platform: string;
  username: string;
  profileUrl: string;
  followerCount?: string | null;
  applicationType: string;
  submissionDate: Date;
}) {
  try {
    await base(env.AIRTABLE_INITIAL_SIGNUPS_TABLE_NAME).create([
      {
        fields: {
          "Signup ID": data.signupId.toString(),
          "Platform": data.platform,
          "Username": data.username,
          "Profile URL": data.profileUrl,
          "Follower Count": data.followerCount || "",
          "Application Type": data.applicationType,
          "Submission Date": data.submissionDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
          "Status": "New",
        },
      },
    ]);
    console.log(`✓ Initial signup ${data.signupId} synced to Airtable`);
  } catch (error) {
    console.error(`✗ Failed to sync initial signup ${data.signupId} to Airtable:`, error);
    // Don't throw - we don't want Airtable failures to prevent database saves
  }
}
