// Channel types
export interface Channel {
  id: string;
  name: string;
  url: string;
  logo: string;
  group: string;
  tvgId: string;
  tvgName: string;
  language: string;
  country: string;
}

// EPG Program types
export interface EPGProgram {
  channel: string;
  start: Date;
  stop: Date;
  title: string;
  description: string;
  category: string;
}

// Playlist types
export interface Playlist {
  id: string;
  name: string;
  url: string;
  channels: Channel[];
  lastUpdated: Date;
  isActive: boolean;
}

// User settings
export interface UserSettings {
  theme: 'dark' | 'light';
  defaultPlaylist: string | null;
  playerAutoplay: boolean;
  playerVolume: number;
  channelView: 'grid' | 'list';
  epgEnabled: boolean;
  epgUrl: string;
}

// Player state
export interface PlayerState {
  currentChannel: Channel | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
}
