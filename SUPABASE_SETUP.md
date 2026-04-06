# SUPABASE SETUP GUIDE FOR IPTV STREAM

This guide will walk you through setting up Supabase for authentication and data storage.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign In"
3. Sign up using GitHub, GitLab, Bitbucket, or email
4. Verify your email address

## Step 2: Create a New Project

1. After logging in, click **"New Project"**
2. Choose your organization (or create one)
3. Fill in project details:
   - **Project name**: `iptv-stream` (or your preferred name)
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose the closest region to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be provisioned

## Step 3: Get Your Project Credentials

1. In your Supabase project dashboard, click the **Settings** icon (⚙️) in the sidebar
2. Click **API** under Project Settings
3. You'll see two important values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **API Keys**:
     - `anon` / `public` key (safe for browser)
     - `service_role` key (NEVER expose this!)

## Step 4: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. **Email** provider should be enabled by default
3. Click on **Email** to configure:
   - Toggle **"Enable Email Provider"** to ON
   - Toggle **"Confirm email"** to ON (recommended for production)
   - Customize email templates if desired
4. Click **Save**

### Optional: Configure Social Providers

For Google, GitHub, etc.:
1. Go to **Authentication** → **Providers**
2. Enable your desired provider
3. Follow the setup instructions for each provider

## Step 5: Run the Database Setup Script

1. In your Supabase dashboard, go to **SQL Editor** (in the sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `supabase-setup.sql` from this project
4. Paste it into the SQL editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. You should see "Success. No rows returned"

This script creates:
- `profiles` table - User profile information
- `playlists` table - User's IPTV playlists
- `favorites` table - User's favorite channels
- `recently_watched` table - User's viewing history
- Row Level Security (RLS) policies - Ensures users can only access their own data
- Triggers - Auto-create profile on signup, auto-update timestamps

## Step 6: Configure Your Environment Variables

1. In the `iptv-app` project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and update with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **IMPORTANT**: Never commit `.env` to Git (it's already in `.gitignore`)

## Step 7: Test Your Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:5173` in your browser

3. Try to sign up with a test account:
   - Use a real email address (you'll receive a confirmation email)
   - Click the confirmation link in the email
   - Sign in with your credentials

4. Check Supabase dashboard:
   - Go to **Authentication** → **Users**
   - You should see your newly created user
   - Go to **Table Editor** → **profiles**
   - You should see your user's profile

## Step 8: Configure Custom SMTP (Optional but Recommended)

For production, you'll want to send custom emails from your own domain:

1. Go to **Project Settings** → **Authentication** → **SMTP Settings**
2. Choose your email provider (SendGrid, AWS SES, Resend, etc.)
3. Enter your SMTP credentials
4. Click **Save**
5. Update email templates under **Email Templates**

### Free Email Services:
- **Resend**: 100 emails/day free (recommended)
- **SendGrid**: 100 emails/day free
- **AWS SES**: 62,000 emails/month free (when sending from EC2)

## Step 9: Deploy to Production

See `DEPLOYMENT.md` for detailed deployment instructions.

When deploying, make sure to:
1. Add environment variables to your hosting platform (Vercel, Netlify, etc.)
2. Add your production URL to Supabase CORS settings:
   - Go to **Project Settings** → **API**
   - Under **CORS Configuration**, add your production URL
   - Example: `https://iptv-stream.vercel.app`

## Troubleshooting

### Can't Sign Up
- Check browser console for errors
- Verify environment variables are correct
- Check Supabase dashboard for error logs

### Not Receiving Confirmation Email
- Check spam folder
- Verify SMTP is configured (or use Supabase's default)
- Check **Authentication** → **Logs** in Supabase

### "Invalid API key" Error
- Double-check your `.env` values
- Make sure you're using the `anon` key, not `service_role`
- Restart your dev server after changing `.env`

### CORS Errors
- Add your localhost/production URL to CORS settings
- Go to **Project Settings** → **API** → **CORS Configuration**

## Database Schema Overview

### Tables Created:

1. **profiles**
   - `id` (UUID, primary key) - Links to auth.users
   - `email` (text)
   - `full_name` (text)
   - `avatar_url` (text)
   - `theme` (text) - 'dark' or 'light'
   - `channel_view` (text) - 'grid' or 'list'
   - `player_autoplay` (boolean)
   - `player_volume` (numeric)
   - `created_at`, `updated_at` (timestamps)

2. **playlists**
   - `id` (UUID, primary key)
   - `user_id` (UUID) - Owner
   - `name` (text)
   - `url` (text)
   - `channels` (JSONB) - Channel data
   - `is_active` (boolean)
   - `created_at`, `updated_at` (timestamps)

3. **favorites**
   - `id` (UUID, primary key)
   - `user_id` (UUID) - Owner
   - `channel_id` (text)
   - `channel_data` (JSONB)
   - `created_at` (timestamp)

4. **recently_watched**
   - `id` (UUID, primary key)
   - `user_id` (UUID) - Owner
   - `channel_id` (text)
   - `channel_data` (JSONB)
   - `watched_at` (timestamp)

## Security

All tables have **Row Level Security (RLS)** enabled:
- Users can ONLY access their own data
- Policies prevent cross-user data access
- The `service_role` key bypasses RLS (keep it secret!)

## Next Steps

1. Customize the app branding
2. Set up analytics (optional)
3. Configure a custom domain
4. Set up automated backups
5. Monitor usage in the Supabase dashboard

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Supabase GitHub Discussions: https://github.com/supabase/supabase/discussions
