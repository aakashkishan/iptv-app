import { useMemo } from 'react';
import { useStore } from '@/store';
import { Channel } from '@/types';
import ChannelList from '@/components/ChannelList';
import VideoPlayer from '@/components/VideoPlayer';

export default function FavoritesPage() {
  const { channels, favorites, player, setPlayerState } = useStore();

  const favoriteChannels = useMemo(() => {
    return channels.filter(ch => favorites.includes(ch.id));
  }, [channels, favorites]);

  const handleSelectChannel = (channel: Channel) => {
    setPlayerState({ currentChannel: channel });
  };

  if (favoriteChannels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg2)' }}>
            <svg className="w-10 h-10" style={{ color: 'var(--fg4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--fg0)' }}>No Favorites Yet</h2>
          <p style={{ color: 'var(--fg4)' }}>Star channels to add them to your favorites</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Player */}
      {player.currentChannel && (
        <div className="sticky top-0 z-40" style={{ backgroundColor: 'var(--bg0-hard)' }}>
          <VideoPlayer channel={player.currentChannel} />
          <div className="flex items-center justify-between p-4" style={{ backgroundColor: 'var(--bg1)', borderBottom: '1px solid var(--bg3)' }}>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--fg1)' }}>
                {player.currentChannel.name}
              </h2>
              {player.currentChannel.group && (
                <p className="text-sm" style={{ color: 'var(--fg4)' }}>{player.currentChannel.group}</p>
              )}
            </div>
            <button
              onClick={() => setPlayerState({ currentChannel: null, isPlaying: false })}
              className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--bg2)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg3)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg2)'}
            >
              <svg className="w-6 h-6" style={{ color: 'var(--fg3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-sm safe-top" style={{ backgroundColor: 'rgba(40, 40, 40, 0.95)', borderBottom: '1px solid var(--bg3)' }}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold" style={{ color: 'var(--fg0)' }}>Favorites</h1>
            <span className="text-sm" style={{ color: 'var(--fg4)' }}>
              {favoriteChannels.length} channels
            </span>
          </div>
        </div>
      </div>

      {/* Channel List */}
      <div className="p-4 pb-24 md:pb-4">
        <ChannelList channels={favoriteChannels} onSelectChannel={handleSelectChannel} />
      </div>
    </div>
  );
}
