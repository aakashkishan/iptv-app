# 🚀 QUICK START GUIDE - IPTV STREAM

Follow this guide to get your IPTV app up and running in under 15 minutes!

---

## 📋 What You'll Need

1. ✅ **GitHub Account** - Already have one: `aakashkishan`
2. ✅ **Supabase Account** - Free at https://supabase.com (2 min to set up)
3. ✅ **Vercel Account** - Free at https://vercel.com (sign in with GitHub)
4. ✅ **Your IPTV Playlist** - M3U/M3U8 URL or file

---

## 🎯 Step-by-Step (15 minutes total)

### Step 1: Set Up Supabase (5 minutes)

1. **Go to https://supabase.com**
   - Click "Start your project"
   - Sign in with your GitHub account (aakashkishan)

2. **Create New Project**
   - Click "New Project"
   - Name: `iptv-stream`
   - Database Password: Create a strong password (save it!)
   - Region: Choose closest to you
   - Click "Create new project"
   - ⏳ Wait 2 minutes for setup

3. **Get Your API Keys**
   - Click Settings (⚙️) in sidebar
   - Click "API"
   - Copy these two values:
     ```
     Project URL: https://xxxxxxxxxxxxx.supabase.co
     anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

4. **Run Database Setup**
   - Click "SQL Editor" in sidebar
   - Click "New Query"
   - Open file: `supabase-setup.sql` from your project
   - Copy ALL the SQL code
   - Paste into Supabase SQL Editor
   - Click "Run" (or Ctrl/Cmd + Enter)
   - ✅ Success!

5. **Configure Email**
   - Go to Authentication → Providers
   - Click "Email"
   - Make sure "Enable Email Provider" is ON
   - Toggle "Confirm email" to OFF (for testing)
   - Click "Save"

**✅ Supabase is ready! Keep your URL and anon key handy.**

---

### Step 2: Set Up Your Local Project (3 minutes)

1. **Open Terminal**

2. **Navigate to project**
   ```bash
   cd /Users/radhasriram/Desktop/PROJECTS/iptv-app
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env**
   ```bash
   open .env
   ```
   
   Update with your Supabase values:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   
   **IMPORTANT**: Replace with YOUR actual values from Step 1!

5. **Install dependencies** (if not already done)
   ```bash
   npm install
   ```

6. **Test locally**
   ```bash
   npm run dev
   ```

7. **Open browser**
   - Go to http://localhost:5173
   - Click "Sign up"
   - Create an account with your email
   - ✅ You're in!

---

### Step 3: Deploy to Vercel (5 minutes)

1. **Go to https://vercel.com**
   - Click "Sign Up"
   - Sign in with GitHub (aakashkishan)

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Find and select: `iptv-app`
   - Click "Import"

3. **Configure**
   - Project Name: `iptv-stream`
   - Framework: Vite (auto-detected)
   - Scroll to "Environment Variables"

4. **Add Environment Variables**
   
   Click "Environment Variables" section and add:
   
   ```
   Name: VITE_SUPABASE_URL
   Value: https://your-project-id.supabase.co
   
   Name: VITE_SUPABASE_ANON_KEY  
   Value: your-anon-key-here
   ```

5. **Deploy!**
   - Click "Deploy"
   - ⏳ Wait 2-3 minutes
   - 🎉 You'll get a live URL like: `https://iptv-stream.vercel.app`

6. **Test Your Live App**
   - Open your Vercel URL
   - Sign up with an account
   - Add a playlist
   - Start watching!

---

### Step 4: Add Your IPTV Playlist (2 minutes)

1. **Sign in to your app** (local or deployed)

2. **Add a playlist:**
   
   **Option A - From URL:**
   - Paste your M3U playlist URL
   - Click "Load Playlist"
   
   **Option B - Upload File:**
   - Click the upload area
   - Select your .m3u or .m3u8 file
   - It will parse automatically

3. **Browse channels**
   - Use categories to filter
   - Search for specific channels
   - Star your favorites

4. **Watch!**
   - Click any channel
   - Video player will start streaming

---

## 🎉 You're Done!

Your IPTV app is now:
- ✅ Running locally on your Mac
- ✅ Deployed to the web
- ✅ Ready to use on any device
- ✅ All data synced to the cloud
- ✅ Accessible from anywhere

---

## 📱 Using on Your Android Phone

1. **Open Chrome on Android**
2. **Go to your Vercel URL**
3. **Tap the menu (⋮)**
4. **Tap "Add to Home screen"**
5. **It installs like a real app!**

Now it works just like a native app with:
- App icon on home screen
- Full-screen mode
- Offline support for settings
- Push notifications (if enabled)

---

## 🔧 Common Issues & Fixes

### "Can't sign up"
- Check that Supabase email confirmation is OFF (for testing)
- Check browser console for errors
- Verify .env file has correct values

### "Missing Supabase environment variables"
- Make sure `.env` file exists
- Check variable names are exact
- Restart dev server after changing .env

### "Playlist won't load"
- Check the URL is accessible
- Make sure it's a valid M3U format
- Try uploading the file instead

### "Video won't play"
- Some streams block browser playback (CORS)
- Try different playlist sources
- Check stream is currently active

---

## 📊 Your Project URLs

| What | URL |
|------|-----|
| **GitHub Repo** | https://github.com/aakashkishan/iptv-app |
| **Supabase Dashboard** | https://supabase.com/dashboard |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Local Dev** | http://localhost:5173 |
| **Live App** | (Your Vercel URL after deploy) |

---

## 🎓 Next Steps

1. ✅ **Test all features** - Sign up, add playlist, watch channels
2. ✅ **Set up custom domain** - In Vercel Settings → Domains
3. ✅ **Enable email confirmation** - In Supabase for production
4. ✅ **Add EPG** - Get an XMLTV URL and configure in Settings
5. ✅ **Share with friends** - Give them your Vercel URL

---

## 💡 Pro Tips

- **Free tier limits**: Supabase gives you 500MB database, 50K monthly users
- **Cost**: ~$0 for personal use, $25/month if you scale
- **Backups**: Supabase does automatic backups
- **Updates**: Just push to GitHub and Vercel auto-deploys!

---

## 🆘 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Your Repo**: https://github.com/aakashkishan/iptv-app

---

**Congratulations! You now have your own IPTV streaming service! 🎉📺**
