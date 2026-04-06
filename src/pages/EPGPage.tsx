import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { EPGProgram } from '../types';
import { fetchEPG, getCurrentProgram, getUpcomingPrograms } from '../utils/epgParser';

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
          <div className="w-20 h-20 mx-auto mb-6 bg-dark-800 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">EPG Disabled</h2>
          <p className="text-dark-400 mb-4">Enable EPG in Settings to view program guides</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-dark-900/95 backdrop-blur-sm border-b border-dark-800 safe-top">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">TV Guide</h1>
            <button
              onClick={loadEPG}
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {/* Channel selector */}
          <select
            value={selectedChannel || ''}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select a channel</option>
            {channels.map((channel) => (
              <option key={channel.id} value={channel.tvgId || channel.id}>
                {channel.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24 md:pb-4">
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
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
            <div className="bg-primary-900/20 border border-primary-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded">
                  NOW
                </span>
                <span className="text-sm text-dark-400">
                  {formatTime(currentProgram.start)} - {formatTime(currentProgram.stop)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {currentProgram.title}
              </h3>
              {currentProgram.description && (
                <p className="text-sm text-dark-400 line-clamp-2">
                  {currentProgram.description}
                </p>
              )}
              {currentProgram.category && (
                <span className="inline-block mt-2 px-2 py-1 bg-dark-800 text-dark-300 text-xs rounded">
                  {currentProgram.category}
                </span>
              )}
            </div>

            {/* Upcoming programs */}
            {upcomingPrograms.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wide mb-3">
                  Upcoming
                </h3>
                <div className="space-y-2">
                  {upcomingPrograms.map((program, index) => (
                    <div
                      key={index}
                      className="bg-dark-800 border border-dark-700 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-primary-400 font-medium">
                          {formatDate(program.start)}
                        </span>
                        <span className="text-sm text-dark-400">
                          {formatTime(program.start)} - {formatTime(program.stop)}
                        </span>
                      </div>
                      <h4 className="text-base font-medium text-white mb-1">
                        {program.title}
                      </h4>
                      {program.description && (
                        <p className="text-sm text-dark-400 line-clamp-2">
                          {program.description}
                        </p>
                      )}
                      {program.category && (
                        <span className="inline-block mt-2 px-2 py-1 bg-dark-900 text-dark-500 text-xs rounded">
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
          <div className="text-center py-12 text-dark-500">
            <p>Select a channel to view its program guide</p>
          </div>
        )}
      </div>
    </div>
  );
}
