# Setting Up New Airtable Tables

This guide will help you create three additional tables in your Airtable base to capture all user interactions from your Content Connect application.

## Overview

You already have three tables for applications (Creator, Host, Ambassador). Now you'll add three more tables to capture early-stage leads and signups:

1. **Email Subscribers** - Newsletter signups from footer
2. **Host Leads** - Host email captures from interest forms
3. **Initial Signups** - Platform connection data (Instagram/TikTok/YouTube)

## Table 1: Email Subscribers

This table captures email addresses from users who sign up for your newsletter via the footer form.

**Table Name:** `Email Subscribers`

### Fields to Create:

| Field Name | Field Type | Description | Settings |
|------------|------------|-------------|----------|
| Subscriber ID | Single line text | Unique identifier from database | - |
| Email | Email | Email address of subscriber | - |
| Submission Date | Date | When they subscribed | Date format: YYYY-MM-DD |
| Status | Single select | Subscription status | Options: Active, Unsubscribed |

### How to Create:
1. In your Airtable base, click "+ Add or import" to create a new table
2. Name it exactly: `Email Subscribers`
3. Add each field listed above with the specified type
4. For the Status field, add the options: Active, Unsubscribed

---

## Table 2: Host Leads

This table captures email addresses from potential hosts who express interest before completing a full application.

**Table Name:** `Host Leads`

### Fields to Create:

| Field Name | Field Type | Description | Settings |
|------------|------------|-------------|----------|
| Lead ID | Single line text | Unique identifier from database | - |
| Email | Email | Email address of host lead | - |
| Submission Date | Date | When they submitted their email | Date format: YYYY-MM-DD |
| Status | Single select | Lead status | Options: New, Contacted, Converted, Not Interested |

### How to Create:
1. In your Airtable base, click "+ Add or import" to create a new table
2. Name it exactly: `Host Leads`
3. Add each field listed above with the specified type
4. For the Status field, add the options: New, Contacted, Converted, Not Interested

---

## Table 3: Initial Signups

This table captures platform connection data when users first connect their social media accounts during the signup flow.

**Table Name:** `Initial Signups`

### Fields to Create:

| Field Name | Field Type | Description | Settings |
|------------|------------|-------------|----------|
| Signup ID | Single line text | Unique identifier from database | - |
| Platform | Single select | Social media platform | Options: instagram, youtube, tiktok |
| Username | Single line text | Username/handle (without @) | - |
| Profile URL | URL | Full URL to social media profile | - |
| Follower Count | Single line text | Number of followers/subscribers | - |
| Application Type | Single select | Type of application | Options: creator, host |
| Submission Date | Date | When they connected their platform | Date format: YYYY-MM-DD |
| Status | Single select | Signup status | Options: New, Completed Application, Abandoned |

### How to Create:
1. In your Airtable base, click "+ Add or import" to create a new table
2. Name it exactly: `Initial Signups`
3. Add each field listed above with the specified type
4. For Platform field, add options: instagram, youtube, tiktok
5. For Application Type field, add options: creator, host
6. For Status field, add options: New, Completed Application, Abandoned

---

## Verification Checklist

After creating all three tables, verify:

- [ ] Table names match exactly (including spaces and capitalization)
- [ ] All field names match exactly (including spaces and capitalization)
- [ ] Field types are correct (Single line text, Email, Date, URL, Single select)
- [ ] Single select options are added for all dropdown fields
- [ ] Date fields are set to YYYY-MM-DD format

## Environment Variables

After creating these tables, ensure your `.env` file has these values:

```env
AIRTABLE_EMAIL_SUBSCRIBERS_TABLE_NAME="Email Subscribers"
AIRTABLE_HOST_LEADS_TABLE_NAME="Host Leads"
AIRTABLE_INITIAL_SIGNUPS_TABLE_NAME="Initial Signups"
```

**Important:** The table names must match exactly, including quotes if there are spaces.

## What Gets Synced

### Email Subscribers
- Every newsletter signup from the footer form
- Automatically set to "Active" status

### Host Leads
- Every host email submission from interest forms
- Automatically set to "New" status
- Track these leads separately from full host applications

### Initial Signups
- Every platform connection during signup flow
- Captures social media data early in the funnel
- Helps track conversion from initial interest to full application
- Automatically set to "New" status

## Views to Create (Optional)

Consider creating these views for better organization:

### Email Subscribers
- **All Active** - Filter: Status = Active
- **Recent Subscribers** - Sort by Submission Date (newest first)

### Host Leads
- **New Leads** - Filter: Status = New
- **Needs Follow-up** - Filter: Status = Contacted
- **This Week** - Filter: Submission Date is within this week

### Initial Signups
- **Pending Applications** - Filter: Status = New
- **By Platform** - Group by Platform
- **Creators vs Hosts** - Group by Application Type
- **High Follower Count** - Filter: Follower Count > 10000 (adjust as needed)

## Integration Flow

```
User Action → Website Form → Database Save → Airtable Sync
```

1. User submits email/connects platform
2. Data saved to PostgreSQL database (primary)
3. Data immediately synced to Airtable (secondary)
4. If Airtable sync fails, database save still succeeds
5. Errors are logged but don't affect user experience

## Troubleshooting

**Records not appearing in Airtable?**
- Check that table names in `.env` match exactly
- Verify your Airtable Personal Access Token is valid
- Check server logs for sync errors
- Ensure the token has permission to write to these tables

**Wrong data in fields?**
- Verify field names match exactly (case-sensitive)
- Check field types are correct
- Review the field mapping in `src/server/airtable.ts`

## Next Steps

1. Create all three tables as specified above
2. Update your `.env` file if table names differ
3. Test each signup/lead capture form
4. Verify data appears correctly in Airtable
5. Set up views and filters for your workflow
6. Consider setting up Airtable automations for notifications

---

For questions or issues, refer to the main `AIRTABLE_INTEGRATION.md` document or contact your development team.
