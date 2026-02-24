# Airtable Integration Guide

## What is Airtable?

Airtable is a cloud-based platform that combines the simplicity of a spreadsheet with the power of a database. It provides a visual, user-friendly interface for managing data, making it perfect for tracking and reviewing application submissions without needing to access your application's database directly.

**Key Benefits:**
- **Visual Interface**: View and manage applications in a spreadsheet-like format
- **Collaboration**: Multiple team members can review and update applications simultaneously
- **Filtering & Sorting**: Easily filter applications by status, date, platform, etc.
- **Custom Views**: Create different views for different team members or workflows
- **Automation**: Set up automated notifications and workflows based on application status

## What to Create on Airtable

### Step 1: Create an Airtable Account
1. Go to [airtable.com](https://airtable.com)
2. Sign up for a free account (or use an existing account)
3. The free tier includes enough storage and records for most use cases

### Step 2: Create a Base
A "Base" in Airtable is like a database. You'll create one Base for your Content Connect application submissions.

1. Click "Add a base" on your Airtable home screen
2. Choose "Start from scratch"
3. Name it something like "Content Connect Applications"

### Step 3: Create Tables

Within your Base, you'll create three separate tables (like separate spreadsheets) for each application type:

#### Table 1: Creator Applications

Create a table named "Creator Applications" with the following fields:

| Field Name | Field Type | Description |
|------------|------------|-------------|
| Application ID | Single line text | Auto-generated unique identifier |
| First Name | Single line text | Creator's first name |
| Last Name | Single line text | Creator's last name |
| Email | Email | Creator's email address |
| Primary Platform | Single select | Options: Instagram, TikTok, YouTube, Twitter, LinkedIn, Facebook, Other |
| Profile URL | URL | Link to their social media profile |
| Follower Count | Number | Number of followers |
| Content Niche | Multiple select | Categories like Travel, Food, Lifestyle, Fashion, etc. |
| Bio | Long text | Creator's bio/description |
| Previous Collaborations | Long text | Details about past brand collaborations |
| Portfolio URL | URL | Link to portfolio or media kit |
| Submission Date | Date | When the application was submitted |
| Status | Single select | Options: New, Under Review, Approved, Rejected |

#### Table 2: Host Applications

Create a table named "Host Applications" with the following fields:

| Field Name | Field Type | Description |
|------------|------------|-------------|
| Application ID | Single line text | Auto-generated unique identifier |
| First Name | Single line text | Host's first name |
| Last Name | Single line text | Host's last name |
| Email | Email | Host's email address |
| Phone | Phone number | Contact phone number |
| Property Name | Single line text | Name of the property/hotel/venue |
| Property Type | Single select | Hotel, Resort, Vacation Rental, Restaurant, etc. |
| Property Address | Long text | Full address |
| City | Single line text | City |
| State/Province | Single line text | State or province |
| Country | Single line text | Country |
| Website | URL | Property website |
| Property Description | Long text | Description of the property |
| Amenities | Multiple select | Pool, WiFi, Parking, Restaurant, Spa, etc. |
| Target Audience | Long text | Description of ideal creator partnerships |
| Previous Partnerships | Long text | Past influencer collaborations |
| Submission Date | Date | When the application was submitted |
| Status | Single select | Options: New, Under Review, Approved, Rejected |

#### Table 3: Ambassador Applications

Create a table named "Ambassador Applications" with the following fields:

| Field Name | Field Type | Description |
|------------|------------|-------------|
| Application ID | Single line text | Auto-generated unique identifier |
| First Name | Single line text | Ambassador's first name |
| Last Name | Single line text | Ambassador's last name |
| Email | Email | Ambassador's email address |
| Location | Single line text | Geographic location |
| Experience Level | Single select | Options: Beginner, Intermediate, Advanced, Expert |
| Why Join | Long text | Motivation for becoming an ambassador |
| Skills | Multiple select | Marketing, Social Media, Content Creation, etc. |
| Availability | Single line text | Time commitment they can offer |
| Submission Date | Date | When the application was submitted |
| Status | Single select | Options: New, Under Review, Approved, Rejected |

### Step 4: Get Your API Credentials

To connect your website to Airtable, you'll need:

1. **API Key**:
   - Click on your profile icon in the top-right
   - Go to "Account"
   - Navigate to the "API" section
   - Click "Generate API key"
   - Copy and save this key securely (you'll only see it once)

2. **Base ID**:
   - Go to [airtable.com/api](https://airtable.com/api)
   - Select your "Content Connect Applications" base
   - The Base ID is shown in the URL and in the introduction section
   - It starts with "app" (e.g., `appXXXXXXXXXXXXXX`)

3. **Table IDs or Names**:
   - You can use table names (e.g., "Creator Applications") or table IDs
   - Table IDs can be found in the API documentation for your base

## How the Integration Works

### Architecture Overview

```
User Submits Form → Your Website → tRPC Backend → Two Actions:
                                                   1. Save to PostgreSQL Database
                                                   2. Send to Airtable API
```

### Integration Flow

1. **User Submission**: A user fills out an application form on your website
2. **Data Validation**: The form data is validated on the client and server
3. **Database Save**: The application is saved to your PostgreSQL database (primary storage)
4. **Airtable Sync**: Immediately after database save, the same data is sent to Airtable via their REST API
5. **Confirmation**: User receives confirmation that their application was submitted

### Technical Implementation

The integration would be implemented in your tRPC procedures:

**Files to modify:**
- `src/server/trpc/procedures/submitCreatorApplication.ts`
- `src/server/trpc/procedures/submitHostApplication.ts`
- `src/server/trpc/procedures/submitAmbassadorApplication.ts`
- `src/server/env.ts` (to add API credentials as environment variables)

**Environment Variables Needed:**
```env
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_CREATOR_TABLE_NAME=Creator Applications
AIRTABLE_HOST_TABLE_NAME=Host Applications
AIRTABLE_AMBASSADOR_TABLE_NAME=Ambassador Applications
```

### Data Flow Example

When a creator submits an application:

1. Form data is sent to `submitCreatorApplication` tRPC procedure
2. Data is validated using Zod schema
3. Record is created in PostgreSQL database
4. HTTP POST request is made to Airtable API:
   ```
   POST https://api.airtable.com/v0/{BASE_ID}/{TABLE_NAME}
   Headers: Authorization: Bearer {API_KEY}
   Body: { fields: { "First Name": "John", "Last Name": "Doe", ... } }
   ```
5. Airtable creates a new record in the corresponding table
6. Success response is returned to the user

### Benefits of This Approach

- **Redundancy**: Data is stored in both your database and Airtable
- **Accessibility**: Non-technical team members can review applications in Airtable
- **Workflow Management**: Use Airtable's status fields and views to manage application review
- **Real-time Sync**: Applications appear in Airtable immediately after submission
- **Data Ownership**: You maintain full control with your primary database

## Next Steps

1. **Create your Airtable Base** following the structure above
2. **Obtain your API credentials** (API Key and Base ID)
3. **Provide credentials** to your development team to implement the integration
4. **Test the integration** by submitting test applications
5. **Set up Airtable views and workflows** for your team's review process

## Security Notes

- **Never expose your API key** in client-side code or public repositories
- API calls are made server-side only (in tRPC procedures)
- API key is stored as an environment variable
- Consider using Airtable's scoped tokens for additional security

## Support Resources

- [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
- [Airtable REST API Reference](https://airtable.com/developers/web/api/create-records)
- [Airtable Community Forum](https://community.airtable.com/)

## Limitations & Considerations

- **Free Tier Limits**: Airtable's free tier has limits on records and API calls
- **Rate Limiting**: Airtable API has rate limits (5 requests per second)
- **No Real-time Updates**: Changes made in Airtable won't automatically sync back to your database
- **Cost**: May need to upgrade to a paid plan as application volume grows

---

For implementation assistance or questions about this integration, contact your development team.
