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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const { settings, setPlayerState, addToRecentlyWatched } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !channel.url) return;

    let hls: Hls | null = null;

    const initPlayer = async () => {
      setPlayerState({ isLoading: true, error: null });

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
              video.play().catch(console.error);
              setPlayerState({ isLoading: false, isPlaying: true, error: null });
              onReady?.();
              addToRecentlyWatched(channel.id);
            });

            hls.on(Hls.Events.ERROR, (_event, data) => {
              if (data.fatal) {
                setPlayerState({ 
                  isLoading: false, 
                  isPlaying: false, 
                  error: `Stream error: ${data.details}` 
                });
                onError?.(`Stream error: ${data.details}`);
                
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                  hls?.startLoad();
                } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                  hls?.recoverMediaError();
                } else {
                  hls?.destroy();
                }
              }
            });

            hlsRef.current = hls;
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            video.src = channel.url;
            video.addEventListener('loadedmetadata', () => {
              video.play().catch(console.error);
              setPlayerState({ isLoading: false, isPlaying: true });
              onReady?.();
              addToRecentlyWatched(channel.id);
            });
          }
        } else {
          // Regular video file
          video.src = channel.url;
          video.addEventListener('loadedmetadata', () => {
            video.play().catch(console.error);
            setPlayerState({ isLoading: false, isPlaying: true });
            onReady?.();
            addToRecentlyWatched(channel.id);
          });
        }
      } catch (error) {
        setPlayerState({ 
          isLoading: false, 
          isPlaying: false, 
          error: `Failed to load stream: ${error instanceof Error ? error.message : 'Unknown error'}` 
        });
        onError?.(`Failed to load stream`);
      }
    };

    initPlayer();

    return () => {
      if (hls) {
        hls.destroy();
      }
      hlsRef.current = null;
    };
  }, [channel, setPlayerState, onReady, onError, addToRecentlyWatched]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(console.error);
      setPlayerState({ isPlaying: true });
    } else {
      video.pause();
      setPlayerState({ isPlaying: false });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setPlayerState({ isMuted: video.muted });
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
        setPlayerState({ isFullscreen: true });
      }).catch(console.error);
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        setPlayerState({ isFullscreen: false });
      }).catch(console.error);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const volume = parseFloat(e.target.value);
    video.volume = volume;
    setPlayerState({ volume, isMuted: volume === 0 });
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
      />

      {/* Loading indicator */}
      {useStore.getState().player.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="spinner" />
        </div>
      )}

      {/* Controls overlay */}
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
            aria-label={useStore.getState().player.isPlaying ? 'Pause' : 'Play'}
          >
            {useStore.getState().player.isPlaying ? (
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
            aria-label={useStore.getState().player.isMuted ? 'Unmute' : 'Mute'}
          >
            {useStore.getState().player.isMuted ? (
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
            value={useStore.getState().player.isMuted ? 0 : useStore.getState().player.volume}
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
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
