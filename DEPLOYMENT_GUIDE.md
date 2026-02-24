# Deployment Guide: Airtable Integration & Hosting on Vercel

This guide walks you through connecting your application forms to Airtable and deploying to Vercel.

## ✅ What's Been Implemented

The Airtable integration is now **fully coded and ready to use**. Here's what was added:

### Code Changes Made:
1. **`src/server/airtable.ts`** - New module that handles all Airtable API calls
2. **`src/server/env.ts`** - Updated to validate Airtable environment variables
3. **`.env`** - Added Airtable configuration variables (you need to update these)
4. **Application Procedures** - All three procedures now sync to Airtable:
   - `submitCreatorApplication.ts`
   - `submitHostApplication.ts`
   - `submitAmbassadorApplication.ts`

### How It Works:
- When a user submits an application form, the data is saved to **both**:
  1. Your PostgreSQL database (primary storage)
  2. Your Airtable base (for easy viewing and management)
- If Airtable is down or fails, the application still saves to the database
- All syncs happen automatically in the background

---

## 📋 Step 1: Set Up Airtable

### 1.1 Create Your Airtable Account & Base

1. Go to [airtable.com](https://airtable.com) and sign up (free tier is fine)
2. Click **"Add a base"** → **"Start from scratch"**
3. Name it: **"Content Connect Applications"**

### 1.2 Create Three Tables

You need to create three separate tables within your base. For each table, follow these instructions:

#### Table 1: Creator Applications

1. Click **"Add or import"** → **"Create empty table"**
2. Name it: **"Creator Applications"**
3. Add these fields (click **"+"** to add each field):

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| Application ID | Single line text | - |
| First Name | Single line text | - |
| Last Name | Single line text | - |
| Email | Email | - |
| Age | Number | Integer, no decimals |
| Country | Single line text | - |
| Primary Platform | Single select | Options: Instagram, TikTok |
| Creator Type | Single select | Options: Content Creator, Influencer, Photographer/Videographer, UGC Creator |
| Platform Username | Single line text | - |
| Average Views | Single line text | - |
| Top Audience Location | Single line text | - |
| Top Audience Age Range | Single select | Options: 18-24, 25-34, 35-44, 45+ |
| Submission Date | Date | Format: Local (M/D/YYYY) |
| Status | Single select | Options: New, Under Review, Approved, Rejected |

#### Table 2: Host Applications

1. Create a new table named: **"Host Applications"**
2. Add these fields:

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| Application ID | Single line text | - |
| Business/Property Name | Single line text | - |
| Property Type | Single select | Options: Hotel, Resort, Vacation Rental, Restaurant, Boutique Stay, Other |
| Website | URL | - |
| Country | Single line text | - |
| Email | Email | - |
| Contact Name | Single line text | - |
| Phone | Phone number | - |
| Contact Role | Single select | Options: Owner, Manager, Marketing, Other |
| Other Role Description | Single line text | - |
| Number of Rooms/Units | Number | Integer, no decimals |
| Target Guest Type | Single line text | - |
| Amenities | Multiple select | Options: Pool, WiFi, Parking, Restaurant, Spa, Gym, Beach Access, Pet Friendly, Family Friendly |
| Peak Seasons | Long text | - |
| Collaboration Objectives | Long text | - |
| Additional Notes | Long text | - |
| Previous Creator Experience | Single select | Options: Yes, No |
| Submission Date | Date | Format: Local (M/D/YYYY) |
| Status | Single select | Options: New, Under Review, Approved, Rejected |

#### Table 3: Ambassador Applications

1. Create a new table named: **"Ambassador Applications"**
2. Add these fields:

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| Application ID | Single line text | - |
| Full Name | Single line text | - |
| Email | Email | - |
| Location | Single line text | - |
| Experience Level | Single select | Options: Beginner, Intermediate, Advanced, Expert |
| Submission Date | Date | Format: Local (M/D/YYYY) |
| Status | Single select | Options: New, Under Review, Approved, Rejected |

### 1.3 Get Your API Credentials

#### Get Your API Key:
1. Click your **profile icon** (top-right corner)
2. Go to **"Account"**
3. Click on **"Developer hub"** in the left sidebar
4. Click **"Create token"**
5. Name it: "Content Connect Integration"
6. Set scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
7. Add access to your "Content Connect Applications" base
8. Click **"Create token"**
9. **Copy the token** and save it securely (you'll only see it once!)

**Note:** This is your Personal Access Token that will be used as `AIRTABLE_PERSONAL_ACCESS_TOKEN` in your environment variables.

#### Get Your Base ID:
1. Go to [airtable.com/api](https://airtable.com/api)
2. Click on your **"Content Connect Applications"** base
3. In the introduction section, you'll see: "The ID of this base is `appXXXXXXXXXXXXXX`"
4. **Copy this Base ID**

---

## 🔧 Step 2: Configure Environment Variables

Open your `.env` file and update the Airtable section with your actual credentials:

```env
# Airtable Integration
AIRTABLE_PERSONAL_ACCESS_TOKEN=patXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  # Replace with your actual token
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX                                   # Replace with your actual Base ID
AIRTABLE_CREATOR_TABLE_NAME=Creator Applications
AIRTABLE_HOST_TABLE_NAME=Host Applications
AIRTABLE_AMBASSADOR_TABLE_NAME=Ambassador Applications
```

**Important Notes:**
- The Personal Access Token will start with `pat`
- The Base ID will start with `app`
- Table names must **exactly match** what you named them in Airtable (case-sensitive!)
- If you named your tables differently, update the table name values accordingly

---

## 🧪 Step 3: Test the Integration Locally

### 3.1 Start Your Application

```bash
./scripts/run
```

The application will start and validate your environment variables. If any Airtable credentials are missing or invalid, you'll see an error.

### 3.2 Submit Test Applications

1. Open your browser to `http://localhost:5173` (or whatever port is shown)
2. Navigate to the Creator application form
3. Fill out and submit a test application
4. Check your Airtable base - you should see a new record appear!
5. Repeat for Host and Ambassador applications

### 3.3 Verify Success

**In your terminal**, you should see logs like:
```
✓ Creator application 1 synced to Airtable
```

**In Airtable**, you should see:
- New records appearing in real-time
- All fields populated correctly
- Status set to "New"

**If you see errors:**
- Check that your Personal Access Token and Base ID are correct
- Verify table names match exactly (case-sensitive)
- Ensure all required fields exist in your Airtable tables
- Check that your API token has the correct permissions

---

## 🚀 Step 4: Deploy to Vercel

### 4.1 Prepare for Deployment

Your application is now configured for Vercel deployment with the following setup:
- **Vinxi** with Vercel preset for serverless functions
- **vercel.json** configuration for proper SPA routing
- **Environment variables** for Airtable integration
- **Automated build process** via `vinxi build`

### 4.2 Deploy to Vercel

#### Option A: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account/team
   - Link to existing project? **N** (for first deployment)
   - Project name? Accept default or customize
   - Directory? Accept default (`.`)
   - Override settings? **N**

4. **Set Environment Variables**:
   ```bash
   vercel env add DATABASE_URL
   vercel env add AIRTABLE_PERSONAL_ACCESS_TOKEN
   vercel env add AIRTABLE_BASE_ID
   vercel env add AIRTABLE_CREATOR_TABLE_NAME
   vercel env add AIRTABLE_HOST_TABLE_NAME
   vercel env add AIRTABLE_AMBASSADOR_TABLE_NAME
   vercel env add ADMIN_PASSWORD
   vercel env add NODE_ENV
   ```
   
   For each command, paste the value when prompted and select which environments (Production, Preview, Development).
   
   **Important:** For DATABASE_URL, you'll need to set up a production database first (see Step 4.2.1 below).

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

#### Step 4.2.1: Set Up Production Database (Required)

Before deploying, you need a production PostgreSQL database. The local Docker database won't work on Vercel.

**Option 1: Vercel Postgres (Recommended)**

1. Go to your Vercel project dashboard
2. Click on the **"Storage"** tab
3. Click **"Create Database"** → **"Postgres"**
4. Choose a name (e.g., "content-connect-db")
5. Select a region close to your users
6. Click **"Create"**
7. Vercel will automatically add the `DATABASE_URL` environment variable to your project

**Option 2: External Database Provider**

You can use any PostgreSQL provider:
- **Neon** (neon.tech) - Free tier available
- **Supabase** (supabase.com) - Free tier available
- **Railway** (railway.app) - Free tier available
- **PlanetScale** - MySQL alternative
- **AWS RDS**, **Google Cloud SQL**, **Azure Database**

After setting up with an external provider:
1. Copy the connection string (DATABASE_URL)
2. Add it to Vercel environment variables (see Step 4.2 above)

#### Option B: Deploy via Vercel Dashboard

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign in

3. **Click "Add New Project"**

4. **Import your Git repository**:
   - Select your repository
   - Click "Import"

5. **Configure Project**:
   - Framework Preset: **Other**
   - Build Command: `vinxi build` (should be auto-detected)
   - Output Directory: `.output` (should be auto-detected)
   - Install Command: `npm install` or `pnpm install`

6. **Add Environment Variables** (click "Environment Variables"):
   
   **Required Variables:**
   ```
   NODE_ENV=production
   ADMIN_PASSWORD=<your-secure-password>
   DATABASE_URL=<your-production-database-url>
   AIRTABLE_PERSONAL_ACCESS_TOKEN=<your-airtable-token>
   AIRTABLE_BASE_ID=<your-base-id>
   AIRTABLE_CREATOR_TABLE_NAME=Creator Applications
   AIRTABLE_HOST_TABLE_NAME=Host Applications
   AIRTABLE_AMBASSADOR_TABLE_NAME=Ambassador Applications
   ```
   
   **Note:** If using Vercel Postgres, the DATABASE_URL will be automatically added when you create the database in the Storage tab.
   
   **Optional but Recommended:**
   ```
   BASE_URL=https://your-domain.vercel.app
   ```

7. **Click "Deploy"**

### 4.3 Configure Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click on **"Settings"** → **"Domains"**
3. Add your custom domain
4. Update your DNS records as instructed
5. Update `BASE_URL` environment variable to your custom domain

### 4.4 Verify Production Deployment

1. Visit your deployed URL (e.g., `https://your-project.vercel.app`)
2. Submit a test application through each form
3. Check your Airtable base to confirm the sync is working
4. Monitor Vercel logs for any errors:
   - Go to your project → **"Deployments"** → Click on latest deployment → **"Functions"**

### 4.5 Troubleshooting Vercel Deployment

#### 404 Error on Routes
- **Cause**: The `vercel.json` configuration is missing or incorrect
- **Fix**: Ensure `vercel.json` exists in your project root with the correct rewrite rules

#### Build Fails
- **Cause**: Missing dependencies or build errors
- **Fix**: Check the build logs in Vercel dashboard, ensure all dependencies are in `package.json`

#### Environment Variables Not Working
- **Cause**: Variables not set or set for wrong environment
- **Fix**: Go to Project Settings → Environment Variables, ensure they're set for "Production"

#### API Endpoints Return 500
- **Cause**: Missing environment variables or database connection issues
- **Fix**: 
  - Verify all required environment variables are set
  - Check function logs in Vercel dashboard
  - Ensure `AIRTABLE_PERSONAL_ACCESS_TOKEN` is valid

#### Database Connection Issues
- **Cause**: No PostgreSQL database configured or invalid DATABASE_URL
- **Fix**: 
  - Add a Vercel Postgres database from the "Storage" tab, OR
  - Set up an external PostgreSQL database (Neon, Supabase, Railway, etc.)
  - Ensure the `DATABASE_URL` environment variable is set correctly
  - The DATABASE_URL should be in the format: `postgresql://user:password@host:port/database`
  - Redeploy the application after setting the DATABASE_URL

### 4.6 Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to your main/master branch
- **Preview**: When you create a pull request or push to other branches

To manually trigger a deployment:
```bash
vercel --prod
```

### 4.7 Monitoring and Logs

View logs in real-time:
1. Go to your project in Vercel Dashboard
2. Click **"Deployments"** → Select deployment
3. Click **"Functions"** to see serverless function logs
4. Click **"Build Logs"** to see build output

Or use the CLI:
```bash
vercel logs <deployment-url>
```

---

## 📊 Using Airtable to Manage Applications

### Viewing Applications

Your Airtable base now serves as a visual dashboard for all applications:
- **Creator Applications** tab - See all creator submissions
- **Host Applications** tab - See all host/property submissions
- **Ambassador Applications** tab - See all ambassador submissions

### Managing Application Status

1. Click on any record to open it
2. Change the **Status** field:
   - **New** - Just submitted
   - **Under Review** - Currently being reviewed
   - **Approved** - Accepted
   - **Rejected** - Declined
3. Changes in Airtable won't sync back to your database (one-way sync only)

### Creating Custom Views

Create filtered views for your workflow:
1. Click **"Grid view"** dropdown → **"Create new view"**
2. Examples:
   - **Pending Review**: Filter where Status = "New"
   - **Approved Creators**: Filter where Status = "Approved"
   - **This Week**: Filter by Submission Date = this week
3. Share views with team members

### Setting Up Automations

Airtable can automate workflows:
1. Click **"Automations"** in the top-right
2. Create automations like:
   - Send email when Status changes to "Approved"
   - Notify Slack channel when new application arrives
   - Create calendar events for follow-ups

---

## 🔒 Security Best Practices

### Protect Your API Key
- ✅ **DO**: Store in environment variables
- ✅ **DO**: Use different keys for development and production
- ❌ **DON'T**: Commit API keys to Git
- ❌ **DON'T**: Share API keys in screenshots or documentation

### Use Scoped Tokens
- Only grant the minimum required permissions
- Create separate tokens for different environments
- Rotate tokens periodically

### Monitor API Usage
- Check Airtable's usage dashboard regularly
- Set up alerts for unusual activity
- Review API logs in Airtable

---

## 🐛 Troubleshooting

### "AIRTABLE_PERSONAL_ACCESS_TOKEN is required" Error
- **Cause**: Environment variable not set or empty
- **Fix**: Update `.env` locally or add to Vercel environment variables with your actual Personal Access Token

### "AIRTABLE_BASE_ID must start with 'app'" Error
- **Cause**: Invalid Base ID format
- **Fix**: Double-check you copied the full Base ID from Airtable

### "Table not found" Error
- **Cause**: Table name doesn't match exactly
- **Fix**: Verify table names in Airtable match your environment variables exactly (case-sensitive)

### "Invalid permissions" Error
- **Cause**: Personal Access Token lacks required scopes
- **Fix**: Recreate token with `data.records:read` and `data.records:write` scopes

### Applications Save but Don't Appear in Airtable
- **Cause**: Airtable sync failing silently
- **Fix**: Check server logs for error messages (look for "✗ Failed to sync")
- **Check**: Field names in Airtable match the integration code

### Rate Limit Errors
- **Cause**: Too many API calls (Airtable limit: 5 requests/second)
- **Fix**: This is unlikely with normal usage, but if it happens, the application will still save to the database

### 404 Error After Deployment
- **Cause**: Vercel not configured correctly for SPA routing
- **Fix**: 
  - Ensure `vercel.json` exists in project root
  - Verify `app.config.ts` has `preset: "vercel"`
  - Redeploy the application

### Build Timeout on Vercel
- **Cause**: Build taking too long
- **Fix**: 
  - Upgrade to a paid Vercel plan for longer build times
  - Optimize build process by removing unnecessary dependencies

---

## 📈 Next Steps

### Enhance Your Airtable Workspace
- Add custom fields for internal notes
- Create linked records between tables
- Set up dashboards with charts and metrics
- Integrate with other tools (Zapier, Make, etc.)

### Monitor and Optimize
- Review application trends in Airtable
- Track conversion rates by source
- Identify common rejection reasons
- Optimize your forms based on data

### Scale Your Process
- Add team members to Airtable workspace
- Create SOPs for application review
- Set up automated email responses
- Build a CRM workflow around applications

---

## 📚 Additional Resources

- **Airtable API Docs**: [airtable.com/developers/web/api](https://airtable.com/developers/web/api/introduction)
- **Airtable University**: Free courses on using Airtable effectively
- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Your Integration Guide**: See `AIRTABLE_INTEGRATION.md` for technical details

---

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review server logs for error messages
3. Verify all environment variables are set correctly
4. Test with a fresh Airtable base to isolate the issue
5. Check Airtable's status page for service issues
6. Review Vercel deployment logs in the dashboard

---

**Congratulations!** 🎉 Your application forms are now connected to Airtable, and you're ready to deploy to Vercel!
