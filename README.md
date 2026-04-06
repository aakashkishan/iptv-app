# IPTV Stream 📺

A modern, responsive IPTV streaming web application that works on both desktop and mobile devices.

## Features

- ✅ **M3U/M3U8 Playlist Support** - Load playlists from URL or file upload
- ✅ **HLS Streaming** - Built-in HLS.js integration for smooth playback
- ✅ **EPG (TV Guide)** - XMLTV electronic program guide support
- ✅ **Favorites** - Star your favorite channels for quick access
- ✅ **Recently Watched** - Track your viewing history
- ✅ **Category Filtering** - Filter channels by group/category
- ✅ **Search** - Quick channel search functionality
- ✅ **Responsive Design** - Works on Mac, Android, and all devices
- ✅ **PWA Support** - Installable on mobile and desktop
- ✅ **Dark Theme** - Beautiful dark UI optimized for video watching
- ✅ **Grid/List Views** - Choose your preferred channel layout

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Fast build tooling
- **Tailwind CSS** - Responsive styling
- **Zustand** - State management
- **HLS.js** - HLS stream playback
- **React Router** - Client-side routing
- **IndexedDB** - Local storage for settings
- **Vite PWA** - Progressive Web App support

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Navigate to the project directory
cd iptv-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

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
