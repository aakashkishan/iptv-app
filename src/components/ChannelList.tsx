import { Channel } from '@/types';
import { useStore } from '@/store';
import ChannelCard from './ChannelCard';

interface ChannelListProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

export default function ChannelList({ channels, onSelectChannel }: ChannelListProps) {
  const { settings } = useStore();
  const viewMode = settings.channelView;

  if (channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <svg className="w-16 h-16 mb-4" style={{ color: 'var(--fg4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium" style={{ color: 'var(--fg3)' }}>No channels found</p>
        <p className="text-sm mt-2" style={{ color: 'var(--fg4)' }}>Add a playlist to get started</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="channel-card flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors"
            style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bg3)' }}
            onClick={() => onSelectChannel(channel)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectChannel(channel)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--bright-blue)';
              e.currentTarget.style.backgroundColor = 'var(--bg3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--bg3)';
              e.currentTarget.style.backgroundColor = 'var(--bg2)';
            }}
          >
            {/* Logo */}
            <div className="flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg1)' }}>
              {channel.logo ? (
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-xl font-bold" style={{ color: 'var(--fg4)' }}>
                  {channel.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate" style={{ color: 'var(--fg1)' }}>
                {channel.name}
              </h3>
              {channel.group && (
                <p className="text-xs mt-1" style={{ color: 'var(--fg4)' }}>
                  {channel.group}
                </p>
              )}
            </div>

            {/* Play icon */}
            <svg className="w-5 h-5" style={{ color: 'var(--fg4)' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        ))}
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {channels.map((channel) => (
        <ChannelCard
          key={channel.id}
          channel={channel}
          onSelect={onSelectChannel}
        />
      ))}
    </div>
  );
}
