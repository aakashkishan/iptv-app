import { Channel } from '@/types';
import { useStore } from '@/store';

interface ChannelCardProps {
  channel: Channel;
  onSelect: (channel: Channel) => void;
}

export default function ChannelCard({ channel, onSelect }: ChannelCardProps) {
  const { favorites, toggleFavorite } = useStore();
  const isFavorite = favorites.includes(channel.id);

  return (
    <div
      className="channel-card group relative rounded-lg overflow-hidden cursor-pointer"
      style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bg3)' }}
      onClick={() => onSelect(channel)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(channel)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--bright-blue)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--bg3)';
      }}
    >
      {/* Logo */}
      <div className="relative aspect-video flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg1)' }}>
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
          <div className="text-4xl font-bold" style={{ color: 'var(--fg4)' }}>
            {channel.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(channel.id);
          }}
          className="absolute top-2 right-2 p-1 rounded-full transition-colors"
          style={{ backgroundColor: 'rgba(29, 32, 33, 0.8)' }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`}
            style={{ color: isFavorite ? 'var(--bright-yellow)' : 'var(--fg4)' }}
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
        <h3 className="text-sm font-medium truncate" style={{ color: 'var(--fg1)' }} title={channel.name}>
          {channel.name}
        </h3>
        {channel.group && (
          <p className="text-xs mt-1 truncate" style={{ color: 'var(--fg4)' }}>
            {channel.group}
          </p>
        )}
      </div>
    </div>
  );
}
