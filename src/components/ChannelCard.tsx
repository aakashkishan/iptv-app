import { Channel } from '../types';
import { useStore } from '../store';

interface ChannelCardProps {
  channel: Channel;
  onSelect: (channel: Channel) => void;
}

export default function ChannelCard({ channel, onSelect }: ChannelCardProps) {
  const { favorites, toggleFavorite } = useStore();
  const isFavorite = favorites.includes(channel.id);

  return (
    <div
      className="channel-card group relative bg-dark-800 rounded-lg overflow-hidden cursor-pointer hover:bg-dark-700 border border-dark-700 hover:border-primary-500/50"
      onClick={() => onSelect(channel)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(channel)}
    >
      {/* Logo */}
      <div className="relative aspect-video bg-dark-900 flex items-center justify-center p-4">
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
          <div className="text-dark-500 text-4xl font-bold">
            {channel.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(channel.id);
          }}
          className="absolute top-2 right-2 p-1 rounded-full bg-dark-900/80 hover:bg-dark-900 transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className={`w-5 h-5 ${isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-dark-400'}`}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      </div>

      {/* Channel info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-white truncate" title={channel.name}>
          {channel.name}
        </h3>
        {channel.group && (
          <p className="text-xs text-dark-400 mt-1 truncate">
            {channel.group}
          </p>
        )}
      </div>
    </div>
  );
}
