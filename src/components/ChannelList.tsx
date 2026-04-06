import { Channel } from '../types';
import { useStore } from '../store';
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
      <div className="flex flex-col items-center justify-center py-16 text-dark-400">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium">No channels found</p>
        <p className="text-sm mt-2">Add a playlist to get started</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="channel-card flex items-center gap-4 p-3 bg-dark-800 rounded-lg cursor-pointer hover:bg-dark-700 border border-dark-700 hover:border-primary-500/50 transition-all"
            onClick={() => onSelectChannel(channel)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectChannel(channel)}
          >
            {/* Logo */}
            <div className="flex-shrink-0 w-16 h-16 bg-dark-900 rounded-lg flex items-center justify-center">
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
                <span className="text-dark-500 text-xl font-bold">
                  {channel.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-white truncate">
                {channel.name}
              </h3>
              {channel.group && (
                <p className="text-xs text-dark-400 mt-1">
                  {channel.group}
                </p>
              )}
            </div>

            {/* Play icon */}
            <svg className="w-5 h-5 text-dark-500" fill="currentColor" viewBox="0 0 24 24">
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
