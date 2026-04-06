import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useStore } from '../store';
import { Channel } from '../types';
import { parseM3U, fetchPlaylist, parseM3UFile } from '../utils/m3uParser';
import VideoPlayer from '../components/VideoPlayer';
import ChannelList from '../components/ChannelList';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';

export default function HomePage() {
  const {
    channels,
    filteredChannels,
    categories,
    selectedCategory,
    searchQuery,
    displayCount,
    player,
    setChannels,
    setFilteredChannels,
    setSelectedCategory,
    setSearchQuery,
    setActivePlaylist,
    setPlayerState,
    setLoading,
    loadMoreChannels,
  } = useStore();

  const [showPlayer, setShowPlayer] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Optimized filtering with useMemo - works on ALL channels
  const optimizedFilteredChannels = useMemo(() => {
    let filtered = channels;

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(ch => ch.group === selectedCategory);
    }

    // Filter by search query (searches ALL channels)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ch =>
        ch.name.toLowerCase().includes(query) ||
        ch.group?.toLowerCase().includes(query) ||
        ch.tvgName?.toLowerCase().includes(query) ||
        ch.language?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [channels, selectedCategory, searchQuery]);

  // Update store with filtered channels
  useEffect(() => {
    setFilteredChannels(optimizedFilteredChannels);
  }, [optimizedFilteredChannels, setFilteredChannels]);

  // Get channels to display (lazy loaded subset)
  const displayedChannels = optimizedFilteredChannels.slice(0, displayCount);
  const hasMore = displayCount < optimizedFilteredChannels.length;

  // Reset display count when filters change
  useEffect(() => {
    useStore.setState({ displayCount: 100 });
  }, [selectedCategory, searchQuery]);

  const handleSelectChannel = useCallback((channel: Channel) => {
    setPlayerState({ currentChannel: channel });
    setShowPlayer(true);
  }, [setPlayerState]);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, [setSelectedCategory]);

  // Infinite scroll - load more when user scrolls near bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          // Small delay to prevent rapid firing
          setTimeout(() => {
            loadMoreChannels();
            setIsLoadingMore(false);
          }, 300);
        }
      },
      {
        rootMargin: '500px', // Load more when 500px from bottom
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef && hasMore) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoadingMore, loadMoreChannels]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    loadMoreChannels();
    setTimeout(() => setIsLoadingMore(false), 200);
  };

  const handleLoadPlaylist = async () => {
    if (!playlistUrl) return;

    setLoading(true);
    try {
      const channelsList = await fetchPlaylist(playlistUrl);
      
      // Warn for very large playlists
      if (channelsList.length > 5000) {
        if (!window.confirm(
          `This playlist contains ${channelsList.length.toLocaleString()} channels. The app will load them efficiently (100 at a time). Continue?`
        )) {
          setLoading(false);
          return;
        }
      }
      
      setChannels(channelsList);

      const playlist = {
        id: `playlist-${Date.now()}`,
        name: playlistUrl.split('/').pop() || 'Playlist',
        url: playlistUrl,
        channels: channelsList,
        lastUpdated: new Date(),
        isActive: true,
      };

      setActivePlaylist(playlist);
      setPlaylistUrl('');
    } catch (error) {
      console.error('Error loading playlist:', error);
      alert('Failed to load playlist. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const channelsList = await parseM3UFile(file);
      
      // Warn for very large playlists
      if (channelsList.length > 5000) {
        if (!window.confirm(
          `This playlist contains ${channelsList.length.toLocaleString()} channels. The app will load them efficiently (100 at a time). Continue?`
        )) {
          setLoading(false);
          return;
        }
      }
      
      setChannels(channelsList);

      const playlist = {
        id: `playlist-${Date.now()}`,
        name: file.name,
        url: '',
        channels: channelsList,
        lastUpdated: new Date(),
        isActive: true,
      };

      setActivePlaylist(playlist);
    } catch (error) {
      console.error('Error loading playlist file:', error);
      alert('Failed to load playlist file. Please make sure it\'s a valid M3U file.');
    } finally {
      setLoading(false);
    }
  };

  // If no channels, show add playlist UI
  if (channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Welcome to IPTV Stream</h2>
          <p className="text-dark-400 mb-8">Add an M3U playlist to start watching live TV</p>

          <div className="space-y-4">
            {/* URL Input */}
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <h3 className="text-lg font-semibold text-white mb-4">Load from URL</h3>
              <input
                type="url"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                placeholder="https://example.com/playlist.m3u"
                className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
              />
              <button
                onClick={handleLoadPlaylist}
                disabled={!playlistUrl}
                className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Load Playlist
              </button>
              <p className="text-xs text-dark-500 mt-3">
                💡 Try: https://iptv-org.github.io/iptv/index.m3u (10,000+ free channels)
              </p>
              <p className="text-xs text-primary-400 mt-2">
                ✨ Lazy loading enabled - only 100 channels load at a time
              </p>
            </div>

            <div className="text-dark-500 font-medium">OR</div>

            {/* File Upload */}
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <h3 className="text-lg font-semibold text-white mb-4">Upload File</h3>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-dark-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-3 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-dark-400">Click to upload or drag and drop</p>
                  <p className="text-xs text-dark-500">M3U or M3U8 files</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".m3u,.m3u8"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Player */}
      {showPlayer && player.currentChannel && (
        <div className="sticky top-0 z-40 bg-dark-950">
          <VideoPlayer
            channel={player.currentChannel}
            onReady={() => setShowPlayer(true)}
            onError={() => setShowPlayer(true)}
          />
          <div className="flex items-center justify-between p-4 bg-dark-900 border-b border-dark-800">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {player.currentChannel.name}
              </h2>
              {player.currentChannel.group && (
                <p className="text-sm text-dark-400">{player.currentChannel.group}</p>
              )}
            </div>
            <button
              onClick={() => {
                setShowPlayer(false);
                setPlayerState({ currentChannel: null, isPlaying: false });
              }}
              className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-30 bg-dark-900/95 backdrop-blur-sm border-b border-dark-800 safe-top">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">
                {selectedCategory === 'All' ? 'All Channels' : selectedCategory}
              </h1>
              {channels.length > 1000 && (
                <p className="text-xs text-dark-500 mt-1">
                  Showing {displayedChannels.length.toLocaleString()} of {optimizedFilteredChannels.length.toLocaleString()} channels
                  {hasMore && ' • Scroll to load more'}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-dark-400">
                {optimizedFilteredChannels.length.toLocaleString()} total
              </span>
            </div>
          </div>

          <SearchBar />

          {categories.length > 1 && (
            <CategoryFilter onSelectCategory={handleCategorySelect} />
          )}
        </div>
      </div>

      {/* Channel List */}
      <div className="p-4 pb-24 md:pb-4">
        <ChannelList channels={displayedChannels} onSelectChannel={handleSelectChannel} />

        {/* Load More indicator (infinite scroll sentinel) */}
        {hasMore && (
          <div ref={loadMoreRef} className="mt-6 text-center">
            {isLoadingMore ? (
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="spinner" style={{ width: '24px', height: '24px', borderWidth: '2px' }} />
                <span className="text-dark-400 text-sm">Loading more channels...</span>
              </div>
            ) : (
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-dark-800 border border-dark-700 text-white rounded-lg hover:bg-dark-700 transition-colors"
              >
                Load More Channels ({(optimizedFilteredChannels.length - displayCount).toLocaleString()} remaining)
              </button>
            )}
          </div>
        )}

        {/* All channels loaded message */}
        {!hasMore && optimizedFilteredChannels.length > 100 && (
          <div className="mt-6 text-center py-4">
            <p className="text-dark-500 text-sm">
              ✓ All {optimizedFilteredChannels.length.toLocaleString()} channels loaded
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
