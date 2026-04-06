# IPTV Stream 📺

A modern, full-stack IPTV streaming web application with user authentication, cloud sync, and cross-device support.

[![GitHub](https://img.shields.io/badge/GitHub-Private%20Repo-blue)](https://github.com/aakashkishan/iptv-app)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## Features

### 🎬 Streaming
- ✅ **M3U/M3U8 Playlist Support** - Load playlists from URL or file upload
- ✅ **HLS Streaming** - Built-in HLS.js integration for smooth playback
- ✅ **EPG (TV Guide)** - XMLTV electronic program guide support
- ✅ **Category Filtering** - Filter channels by group/category
- ✅ **Search** - Quick channel search functionality
- ✅ **Grid/List Views** - Choose your preferred channel layout

### 👤 User Accounts
- ✅ **Email Authentication** - Secure sign up/sign in with email verification
- ✅ **User Profiles** - Customizable profiles with preferences
- ✅ **Cloud Sync** - All data synced across devices via Supabase
- ✅ **Favorites** - Star your favorite channels (synced to cloud)
- ✅ **Recently Watched** - Track your viewing history (synced to cloud)
- ✅ **Playlists** - Multiple playlists stored in cloud

### 🎨 UI/UX
- ✅ **Responsive Design** - Works on Mac, Android, and all devices
- ✅ **PWA Support** - Installable on mobile and desktop
- ✅ **Dark Theme** - Beautiful dark UI optimized for video watching
- ✅ **Mobile Navigation** - Optimized for touch and small screens

## Tech Stack

- **Frontend:**
  - **React 18** + **TypeScript**
  - **Vite** - Fast build tooling
  - **Tailwind CSS** - Responsive styling
  - **Zustand** - State management
  - **React Router** - Client-side routing

- **Backend:**
  - **Supabase** - Database & Authentication
  - **PostgreSQL** - Relational database with RLS
  - **Row Level Security** - User data isolation

- **Media:**
  - **HLS.js** - HLS stream playback
  - **Vite PWA** - Progressive Web App support

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free): https://supabase.com

### 1. Clone the Repository

```bash
git clone https://github.com/aakashkishan/iptv-app.git
cd iptv-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed instructions.

**Quick version:**
1. Create a Supabase project at https://supabase.com
2. Run the SQL script from `supabase-setup.sql` in Supabase SQL Editor
3. Copy your project URL and anon key from Settings → API

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 6. Create Your Account

1. Click "Sign up" on the login page
2. Enter your email and password
3. Check your email for the confirmation link
4. Sign in and start adding playlists!

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Adding a Playlist

1. Open the app
2. On the home screen, you'll see two options:
   - **Load from URL**: Enter a direct URL to an M3U/M3U8 playlist
   - **Upload File**: Upload an M3U/M3U8 file from your device

### Watching Channels

1. Browse channels using categories or search
2. Click on any channel to start watching
3. Use the player controls to manage playback

### Managing Favorites

1. Click the star icon on any channel card to add/remove from favorites
2. Access your favorites from the Favorites tab

### Setting up EPG (TV Guide)

1. Go to Settings
2. Enable EPG
3. Enter your XMLTV EPG URL
4. Save and visit the EPG page to view program schedules

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm i -D gh-pages

# Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

## Mobile Installation (PWA)

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮) > "Add to Home screen"
3. The app will install as a standalone app

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

### Desktop (Chrome/Edge)
1. Look for the install icon in the address bar
2. Click to install

## Project Structure

```
iptv-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── VideoPlayer.tsx  # HLS video player
│   │   ├── ChannelCard.tsx  # Channel card component
│   │   ├── ChannelList.tsx  # Channel list/grid
│   │   ├── CategoryFilter.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Sidebar.tsx      # Desktop navigation
│   │   └── BottomNav.tsx    # Mobile navigation
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx
│   │   ├── FavoritesPage.tsx
│   │   ├── EPGPage.tsx
│   │   └── SettingsPage.tsx
│   ├── store/               # Zustand state management
│   │   └── index.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── m3uParser.ts     # M3U playlist parser
│   │   └── epgParser.ts     # XMLTV EPG parser
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
└── package.json
```

## Supported Formats

### Playlist Formats
- M3U
- M3U8 (with HLS streams)
- Direct video URLs

### EPG Formats
- XMLTV format

### Stream Protocols
- HLS (.m3u8)
- HTTP Progressive
- Direct MP4 links

## Troubleshooting

### Stream not playing?
- Ensure the stream URL is accessible
- Some streams may require CORS headers
- Check if the stream is currently active

### EPG not loading?
- Verify the EPG URL is correct and accessible
- Ensure the EPG is in XMLTV format
- Some EPG sources may block browser requests (CORS)

### App not working on mobile?
- Make sure you're using a modern browser
- Try clearing browser cache
- Install as PWA for best experience

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for IPTV enthusiasts everywhere
