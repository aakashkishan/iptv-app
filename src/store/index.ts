import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import { Channel, Playlist, UserSettings, PlayerState } from '../types';

interface AppState {
  // Playlists
  playlists: Playlist[];
  activePlaylist: Playlist | null;
  
  // Channels
  channels: Channel[];
  filteredChannels: Channel[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  
  // Favorites
  favorites: string[];
  
  // Recently watched
  recentlyWatched: string[];
  
  // Player
  player: PlayerState;
  
  // Settings
  settings: UserSettings;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPlaylists: (playlists: Playlist[]) => void;
  setActivePlaylist: (playlist: Playlist | null) => void;
  setChannels: (channels: Channel[]) => void;
  setFilteredChannels: (channels: Channel[]) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  toggleFavorite: (channelId: string) => void;
  addToRecentlyWatched: (channelId: string) => void;
  setPlayerState: (state: Partial<PlayerState>) => void;
  setSettings: (settings: Partial<UserSettings>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const defaultSettings: UserSettings = {
  theme: 'dark',
  defaultPlaylist: null,
  playerAutoplay: false,
  playerVolume: 1,
  channelView: 'grid',
  epgEnabled: false,
  epgUrl: '',
};

const defaultPlayerState: PlayerState = {
  currentChannel: null,
  isPlaying: false,
  isLoading: false,
  error: null,
  volume: 1,
  isMuted: false,
  isFullscreen: false,
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      playlists: [],
      activePlaylist: null,
      channels: [],
      filteredChannels: [],
      categories: [],
      selectedCategory: 'All',
      searchQuery: '',
      favorites: [],
      recentlyWatched: [],
      player: defaultPlayerState,
      settings: defaultSettings,
      isLoading: false,
      error: null,

      // Actions
      setPlaylists: (playlists) => set({ playlists }),
      
      setActivePlaylist: (playlist) => set({ 
        activePlaylist: playlist,
        channels: playlist?.channels || [],
        filteredChannels: playlist?.channels || [],
        categories: ['All', ...new Set(playlist?.channels.map(c => c.group).filter(Boolean) || [])]
      }),
      
      setChannels: (channels) => set({ channels, filteredChannels: channels }),
      
      setFilteredChannels: (filteredChannels) => set({ filteredChannels }),
      
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      
      toggleFavorite: (channelId) => set((state) => ({
        favorites: state.favorites.includes(channelId)
          ? state.favorites.filter(id => id !== channelId)
          : [...state.favorites, channelId]
      })),
      
      addToRecentlyWatched: (channelId) => set((state) => ({
        recentlyWatched: [
          channelId,
          ...state.recentlyWatched.filter(id => id !== channelId)
        ].slice(0, 20)
      })),
      
      setPlayerState: (playerUpdate) => set((state) => ({
        player: { ...state.player, ...playerUpdate }
      })),
      
      setSettings: (settingsUpdate) => set((state) => ({
        settings: { ...state.settings, ...settingsUpdate }
      })),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
    }),
    {
      name: 'iptv-storage',
      partialize: (state) => ({
        playlists: state.playlists,
        favorites: state.favorites,
        recentlyWatched: state.recentlyWatched,
        settings: state.settings,
      }),
    }
  )
);
