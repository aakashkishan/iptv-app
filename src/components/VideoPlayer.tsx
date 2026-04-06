import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { useStore } from '../store';
import { Channel } from '../types';

interface VideoPlayerProps {
  channel: Channel;
  onReady?: () => void;
  onError?: (error: string) => void;
}

export default function VideoPlayer({ channel, onReady, onError }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Local state for player (not from store to avoid re-render issues)
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { addToRecentlyWatched } = useStore();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !channel.url) return;

    // Reset state for new channel
    setIsLoading(true);
    setIsPlaying(false);
    setError(null);

    let hls: Hls | null = null;
    let mounted = true;

    const initPlayer = async () => {
      try {
        if (channel.url.includes('.m3u8') || channel.url.includes('m3u8')) {
          if (Hls.isSupported()) {
            hls = new Hls({
              maxBufferLength: 30,
              maxMaxBufferLength: 60,
              startLevel: -1,
              capLevelToPlayerSize: true,
              debug: false,
            });

            hls.loadSource(channel.url);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              if (!mounted) return;
              setIsLoading(false);
              setIsPlaying(true);
              video.play().catch(() => {
                // Autoplay may be blocked, that's ok
              });
              onReady?.();
              addToRecentlyWatched(channel.id);
            });

            hls.on(Hls.Events.ERROR, (_event, data) => {
              if (!mounted) return;
              
              if (data.fatal) {
                setIsLoading(false);
                setIsPlaying(false);
                
                let errorMsg = 'Stream error';
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    errorMsg = 'Network error - stream may be offline or blocked by CORS';
                    hls?.startLoad();
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    errorMsg = 'Media error - trying to recover...';
                    hls?.recoverMediaError();
                    break;
                  default:
                    errorMsg = `Stream error: ${data.details}`;
                    hls?.destroy();
                    break;
                }
                
                setError(errorMsg);
                onError?.(errorMsg);
              }
            });

            hlsRef.current = hls;
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            video.src = channel.url;
            video.addEventListener('loadedmetadata', () => {
              if (!mounted) return;
              setIsLoading(false);
              setIsPlaying(true);
              video.play().catch(() => {});
              onReady?.();
              addToRecentlyWatched(channel.id);
            });
            video.addEventListener('error', () => {
              if (!mounted) return;
              setIsLoading(false);
              setError('Failed to load stream - browser does not support this format');
            });
          } else {
            setError('HLS streaming is not supported in your browser');
          }
        } else {
          // Direct video URL (mp4, etc.)
          video.src = channel.url;
          video.addEventListener('loadedmetadata', () => {
            if (!mounted) return;
            setIsLoading(false);
            setIsPlaying(true);
            video.play().catch(() => {});
            onReady?.();
            addToRecentlyWatched(channel.id);
          });
          video.addEventListener('error', () => {
            if (!mounted) return;
            setIsLoading(false);
            setError('Failed to load video - URL may be invalid or blocked');
          });
        }
      } catch (err) {
        if (!mounted) return;
        setIsLoading(false);
        const msg = err instanceof Error ? err.message : 'Failed to initialize player';
        setError(msg);
        onError?.(msg);
      }
    };

    initPlayer();

    return () => {
      mounted = false;
      if (hls) {
        hls.destroy();
      }
      hlsRef.current = null;
    };
  }, [channel, onReady, onError, addToRecentlyWatched]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const vol = parseFloat(e.target.value);
    video.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  let controlsTimeout: ReturnType<typeof setTimeout>;

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <div
      ref={containerRef}
      className="video-container relative bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full max-h-[70vh] md:max-h-[80vh]"
        playsInline
        onClick={togglePlay}
        autoPlay
        muted
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
          <div className="spinner mb-3" />
          <p className="text-white text-sm">Loading stream...</p>
        </div>
      )}

      {/* Error display */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-6">
          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-white text-center font-medium mb-2">Unable to Play</p>
          <p className="text-dark-400 text-sm text-center max-w-md mb-4">{error}</p>
          <div className="bg-dark-800 rounded-lg p-4 text-xs text-dark-400 space-y-2">
            <p><strong>Common issues:</strong></p>
            <p>• Stream may be offline or temporarily unavailable</p>
            <p>• Some streams block browser playback (CORS policy)</p>
            <p>• Try a different channel from the list</p>
            <p>• Free IPTV streams can be unreliable</p>
          </div>
        </div>
      )}

      {/* Unmute button (shown when muted and playing) */}
      {isPlaying && isMuted && !isLoading && !error && (
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleMute}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
            <span className="text-sm font-medium">Unmute</span>
          </button>
        </div>
      )}

      {/* Controls overlay */}
      {!isLoading && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-primary-400 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Mute */}
            <button
              onClick={toggleMute}
              className="text-white hover:text-primary-400 transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>

            {/* Volume slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 accent-primary-500"
            />

            {/* Channel name */}
            <span className="flex-1 text-white text-sm truncate">
              {channel.name}
            </span>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-primary-400 transition-colors"
              aria-label="Toggle fullscreen"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
