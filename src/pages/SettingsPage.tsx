import { useState } from 'react';
import { useStore } from '../store';

export default function SettingsPage() {
  const { settings, setSettings, playlists, setPlaylists, setChannels, setActivePlaylist } = useStore();
  const [epgUrl, setEpgUrl] = useState(settings.epgUrl);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleToggleTheme = () => {
    setSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const handleToggleEPG = () => {
    setSettings({ epgEnabled: !settings.epgEnabled });
  };

  const handleSaveEPGUrl = () => {
    setSettings({ epgUrl });
  };

  const handleToggleAutoplay = () => {
    setSettings({ playerAutoplay: !settings.playerAutoplay });
  };

  const handleToggleViewMode = () => {
    setSettings({ channelView: settings.channelView === 'grid' ? 'list' : 'grid' });
  };

  const handleDeletePlaylist = (id: string) => {
    const newPlaylists = playlists.filter(p => p.id !== id);
    setPlaylists(newPlaylists);
    
    if (useStore.getState().activePlaylist?.id === id) {
      setActivePlaylist(null);
      setChannels([]);
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear();
      indexedDB.deleteDatabase('keyval-store');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-dark-900/95 backdrop-blur-sm border-b border-dark-800 safe-top">
        <div className="p-4">
          <h1 className="text-xl font-bold text-white">Settings</h1>
        </div>
      </div>

      {/* Settings Content */}
      <div className="p-4 pb-24 md:pb-4 space-y-4">
        {/* Appearance */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-dark-400 uppercase tracking-wide">
            Appearance
          </h2>
          
          <button
            onClick={handleToggleTheme}
            className="w-full flex items-center justify-between p-4 hover:bg-dark-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span className="text-white">Dark Mode</span>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${settings.theme === 'dark' ? 'bg-primary-600' : 'bg-dark-600'} relative`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`} />
            </div>
          </button>

          <button
            onClick={handleToggleViewMode}
            className="w-full flex items-center justify-between p-4 hover:bg-dark-700 transition-colors border-t border-dark-700"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="text-white">List View</span>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${settings.channelView === 'list' ? 'bg-primary-600' : 'bg-dark-600'} relative`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.channelView === 'list' ? 'translate-x-7' : 'translate-x-1'}`} />
            </div>
          </button>
        </div>

        {/* Player Settings */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-dark-400 uppercase tracking-wide">
            Player
          </h2>
          
          <button
            onClick={handleToggleAutoplay}
            className="w-full flex items-center justify-between p-4 hover:bg-dark-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white">Autoplay</span>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${settings.playerAutoplay ? 'bg-primary-600' : 'bg-dark-600'} relative`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.playerAutoplay ? 'translate-x-7' : 'translate-x-1'}`} />
            </div>
          </button>
        </div>

        {/* EPG Settings */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-dark-400 uppercase tracking-wide">
            TV Guide (EPG)
          </h2>
          
          <button
            onClick={handleToggleEPG}
            className="w-full flex items-center justify-between p-4 hover:bg-dark-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-white">Enable EPG</span>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${settings.epgEnabled ? 'bg-primary-600' : 'bg-dark-600'} relative`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.epgEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </div>
          </button>

          {settings.epgEnabled && (
            <div className="p-4 border-t border-dark-700">
              <label className="block text-sm font-medium text-dark-400 mb-2">
                EPG XML URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={epgUrl}
                  onChange={(e) => setEpgUrl(e.target.value)}
                  placeholder="https://example.com/epg.xml"
                  className="flex-1 px-4 py-2 bg-dark-900 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleSaveEPGUrl}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Playlists */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-dark-400 uppercase tracking-wide">
            Playlists
          </h2>
          
          {playlists.length === 0 ? (
            <div className="p-4 text-dark-500 text-sm">
              No saved playlists. Add one from the home screen.
            </div>
          ) : (
            <div className="divide-y divide-dark-700">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-white font-medium">{playlist.name}</p>
                    <p className="text-sm text-dark-400">
                      {playlist.channels.length} channels
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeletePlaylist(playlist.id)}
                    className="p-2 text-red-500 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Advanced */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between p-4 hover:bg-dark-700 transition-colors"
          >
            <h2 className="text-sm font-semibold text-dark-400 uppercase tracking-wide">
              Advanced
            </h2>
            <svg
              className={`w-5 h-5 text-dark-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAdvanced && (
            <div className="p-4 border-t border-dark-700">
              <button
                onClick={handleClearAllData}
                className="w-full px-4 py-3 bg-red-900/20 border border-red-800 text-red-500 rounded-lg hover:bg-red-900/30 transition-colors"
              >
                Clear All Data
              </button>
            </div>
          )}
        </div>

        {/* App Info */}
        <div className="text-center py-8 text-dark-500 text-sm">
          <p>IPTV Stream v1.0</p>
          <p className="mt-1">A modern IPTV player for the web</p>
        </div>
      </div>
    </div>
  );
}
