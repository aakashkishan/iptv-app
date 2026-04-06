import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { EPGProgram } from '@/types';
import { fetchEPG, getCurrentProgram, getUpcomingPrograms } from '@/utils/epgParser';

export default function EPGPage() {
  const { channels, settings } = useStore();
  const [programs, setPrograms] = useState<EPGProgram[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentProgram = selectedChannel
    ? getCurrentProgram(programs, selectedChannel)
    : null;

  const upcomingPrograms = selectedChannel
    ? getUpcomingPrograms(programs, selectedChannel, 10)
    : [];

  const loadEPG = async () => {
    if (!settings.epgUrl) {
      setError('No EPG URL configured. Please set it in Settings.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const epgData = await fetchEPG(settings.epgUrl);
      setPrograms(epgData);
    } catch (err) {
      setError('Failed to load EPG data. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (settings.epgEnabled && settings.epgUrl && programs.length === 0) {
      loadEPG();
    }
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (!settings.epgEnabled) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg2)' }}>
            <svg className="w-10 h-10" style={{ color: 'var(--fg4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--fg0)' }}>EPG Disabled</h2>
          <p style={{ color: 'var(--fg4)' }}>Enable EPG in Settings to view program guides</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-sm safe-top" style={{ backgroundColor: 'rgba(40, 40, 40, 0.95)', borderBottom: '1px solid var(--bg3)' }}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold" style={{ color: 'var(--fg0)' }}>TV Guide</h1>
            <button
              onClick={loadEPG}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              style={{ backgroundColor: 'var(--blue)', color: 'var(--fg0)' }}
              onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = 'var(--bright-blue)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--blue)'; }}
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {/* Channel selector */}
          <select
            value={selectedChannel || ''}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="w-full px-4 py-3 rounded-lg focus:outline-none transition-colors"
            style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bg3)', color: 'var(--fg1)' }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--bright-blue)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--bg3)'}
          >
            <option value="">Select a channel</option>
            {channels.map((channel) => (
              <option key={channel.id} value={channel.tvgId || channel.id} style={{ backgroundColor: 'var(--bg2)' }}>
                {channel.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24 md:pb-4">
        {error && (
          <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(204, 36, 29, 0.2)', border: '1px solid var(--red)', color: 'var(--bright-red)' }}>
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="spinner" />
          </div>
        )}

        {!isLoading && !error && selectedChannel && currentProgram && (
          <div className="space-y-4">
            {/* Current program */}
            <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(69, 133, 136, 0.2)', border: '1px solid var(--blue)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs font-medium rounded" style={{ backgroundColor: 'var(--blue)', color: 'var(--fg0)' }}>
                  NOW
                </span>
                <span className="text-sm" style={{ color: 'var(--fg4)' }}>
                  {formatTime(currentProgram.start)} - {formatTime(currentProgram.stop)}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--fg1)' }}>
                {currentProgram.title}
              </h3>
              {currentProgram.description && (
                <p className="text-sm line-clamp-2" style={{ color: 'var(--fg4)' }}>
                  {currentProgram.description}
                </p>
              )}
              {currentProgram.category && (
                <span className="inline-block mt-2 px-2 py-1 text-xs rounded" style={{ backgroundColor: 'var(--bg3)', color: 'var(--fg3)' }}>
                  {currentProgram.category}
                </span>
              )}
            </div>

            {/* Upcoming programs */}
            {upcomingPrograms.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--fg4)' }}>
                  Upcoming
                </h3>
                <div className="space-y-2">
                  {upcomingPrograms.map((program, index) => (
                    <div
                      key={index}
                      className="rounded-lg p-4"
                      style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bg3)' }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium" style={{ color: 'var(--bright-blue)' }}>
                          {formatDate(program.start)}
                        </span>
                        <span className="text-sm" style={{ color: 'var(--fg4)' }}>
                          {formatTime(program.start)} - {formatTime(program.stop)}
                        </span>
                      </div>
                      <h4 className="text-base font-medium mb-1" style={{ color: 'var(--fg1)' }}>
                        {program.title}
                      </h4>
                      {program.description && (
                        <p className="text-sm line-clamp-2" style={{ color: 'var(--fg4)' }}>
                          {program.description}
                        </p>
                      )}
                      {program.category && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs rounded" style={{ backgroundColor: 'var(--bg1)', color: 'var(--fg4)' }}>
                          {program.category}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!isLoading && !error && !selectedChannel && (
          <div className="text-center py-12" style={{ color: 'var(--fg4)' }}>
            <p>Select a channel to view its program guide</p>
          </div>
        )}
      </div>
    </div>
  );
}
