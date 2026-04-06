# DEPLOYMENT GUIDE

This guide covers deploying your IPTV Stream app to various platforms.

## Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy React apps with excellent free tier.

### Prerequisites
- Vercel account (free): https://vercel.com/signup
- Your GitHub repository connected

### Steps

1. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Add New..." → "Project"

2. **Import from GitHub**
   - Click "Import Git Repository"
   - Select your `iptv-app` repository
   - Click "Import"

3. **Configure Project**
   - **Project Name**: `iptv-stream` (or your choice)
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (default)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   VITE_SUPABASE_URL = https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key-here
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build and deployment
   - You'll get a live URL like: `https://iptv-stream.vercel.app`

### Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Automatic Deployments

Every push to `master` branch will automatically trigger a deployment!

---

## Option 2: Deploy to Netlify

Netlify is another excellent free hosting option.

### Steps

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Your Site**
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Select your team
   - Site name: `iptv-stream`

4. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Add Environment Variables**
   ```bash
   netlify env:set VITE_SUPABASE_URL "https://your-project-id.supabase.co"
   netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key-here"
   ```

6. **Deploy**
   ```bash
   netlify deploy --prod
   ```

---

## Option 3: Deploy to GitHub Pages

Free hosting directly from your GitHub repository.

### Steps

1. **Install gh-pages**
   ```bash
   npm install -D gh-pages
   ```

2. **Update package.json**
   Add these scripts:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.ts**
   Add the `base` property:
   ```typescript
   export default defineConfig({
     base: '/iptv-app/', // Your repo name
     plugins: [react(), VitePWA({...})],
     // ... rest of config
   })
   ```

4. **Add Environment Variables**
   
   Create a `.env.production` file:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

5. **Deploy**
   ```bash
   npm run deploy
   ```

6. **Enable GitHub Pages**
   - Go to your repo Settings
   - Scroll to "Pages"
   - Set source to "gh-pages" branch
   - Your site will be at: `https://yourusername.github.io/iptv-app/`

---

## Option 4: Deploy to Cloudflare Pages

Cloudflare offers generous free tier with unlimited bandwidth.

### Steps

1. **Go to Cloudflare Pages**
   - Visit https://pages.cloudflare.com
   - Click "Create a project"

2. **Connect GitHub**
   - Select your `iptv-app` repository
   - Click "Begin setup"

3. **Configure Build**
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

4. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add your Supabase credentials

5. **Deploy**
   - Click "Save and Deploy"

---

## Post-Deployment Configuration

### 1. Update Supabase CORS Settings

After deployment, add your production URL to Supabase:

1. Go to Supabase Dashboard → **Project Settings** → **API**
2. Under **CORS Configuration**, add your production URL:
   ```
   https://iptv-stream.vercel.app
   https://your-custom-domain.com
   ```
3. Click "Save"

### 2. Test Your Deployment

1. Open your deployed URL
2. Try signing up/signing in
3. Add a playlist and test playback
4. Check browser console for errors

### 3. Set Up Analytics (Optional)

Consider adding analytics to track usage:
- **Vercel Analytics**: Built-in for Vercel deployments
- **Google Analytics**: Free and comprehensive
- **Plausible**: Privacy-focused, paid

### 4. Configure Error Monitoring (Optional)

For production debugging:
- **Sentry**: https://sentry.io (free tier available)
- **LogRocket**: Session replay and error tracking

---

## Environment Variables Reference

All hosting platforms need these environment variables:

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Supabase Dashboard → Settings → API |

**IMPORTANT**: 
- Never commit these to Git
- Always use the `anon` key, never `service_role`
- Variables must start with `VITE_` for Vite to expose them

---

## Troubleshooting

### Build Fails

**Error**: `Missing Supabase environment variables`
- Ensure environment variables are set in your hosting platform
- Check they're spelled correctly

**Error**: `Module not found`
- Run `npm install` locally and commit `package-lock.json`
- Clear build cache in hosting platform

### App Deploys But Doesn't Work

**Blank page / white screen**:
- Check browser console for errors
- Verify environment variables are correct
- Check CORS settings in Supabase

**Authentication doesn't work**:
- Verify Supabase URL is correct
- Check that email confirmation is working
- Review Supabase logs in dashboard

**Videos don't play**:
- This is likely a CORS issue with the video source
- Some IPTV streams block browser playback
- Check stream URLs are accessible

### Performance Issues

**Slow initial load**:
- Enable gzip/brotli compression (Vercel/Netlify do this automatically)
- Use code splitting (already configured)
- Optimize images and assets

**Slow video playback**:
- Check stream quality and server speed
- Consider using a CDN for streams
- Test with different streams

---

## Scaling Considerations

### Supabase Free Tier Limits
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth/month
- 50,000 monthly active users

### When to Upgrade
- If you exceed free tier limits
- Need custom SMTP for emails
- Want team collaboration features
- Need point-in-time database backups

### Cost Optimization
- Supabase Pro: $25/month
- Vercel Pro: Free for most use cases
- Total cost for small app: ~$25/month

---

## Continuous Deployment

Both Vercel and Netlify support automatic deployments:

1. **Push to main/master**: Triggers automatic build
2. **Pull Requests**: Creates preview deployments
3. **Environment Branching**: Different env vars per branch

### Setup Preview Deployments

For Vercel:
- Every PR gets a unique preview URL
- Team can test changes before merging
- Automatically cleaned up after merge

---

## Next Steps

1. ✅ Deploy your app
2. ✅ Test all features
3. ✅ Set up custom domain
4. ✅ Monitor errors and analytics
5. ✅ Gather user feedback
6. ✅ Iterate and improve

Good luck with your IPTV Stream app! 🚀
