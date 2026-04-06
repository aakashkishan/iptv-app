import { useState } from 'react';
import { useStore } from '@/store';

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

  const ToggleSwitch = ({ enabled }: { enabled: boolean }) => (
    <div className="w-12 h-6 rounded-full relative transition-colors" style={{ backgroundColor: enabled ? 'var(--blue)' : 'var(--bg4)' }}>
      <div className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform" style={{ transform: enabled ? 'translateX(24px)' : 'translateX(4px)' }} />
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-sm safe-top" style={{ backgroundColor: 'rgba(40, 40, 40, 0.95)', borderBottom: '1px solid var(--bg3)' }}>
        <div className="p-4">
          <h1 className="text-xl font-bold" style={{ color: 'var(--fg0)' }}>Settings</h1>
        </div>
      </div>

      {/* Settings Content */}
      <div className="p-4 pb-24 md:pb-4 space-y-4">
        {/* Appearance */}
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bg3)' }}>
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--fg4)' }}>
            Appearance
          </h2>
          
          <button
            onClick={handleToggleTheme}
            className="w-full flex items-center justify-between p-4 transition-colors"
            style={{ borderTop: '1px solid var(--bg3)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" style={{ color: 'var(--fg4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span style={{ color: 'var(--fg1)' }}>Dark Mode</span>
            </div>
            <ToggleSwitch enabled={settings.theme === 'dark'} />
          </button>

          <button
            onClick={handleToggleViewMode}
            className="w-full flex items-center justify-between p-4 transition-colors"
            style={{ borderTop: '1px solid var(--bg3)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" style={{ color: 'var(--fg4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span style={{ color: 'var(--fg1)' }}>List View</span>
            </div>
            <ToggleSwitch enabled={settings.channelView === 'list'} />
          </button>
        </div>

        {/* Player Settings */}
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bg3)' }}>
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--fg4)' }}>
            Player
          </h2>
          
          <button
            onClick={handleToggleAutoplay}
            className="w-full flex items-center justify-between p-4 transition-colors"
            style={{ borderTop: '1px solid var(--bg3)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" style={{ color: 'var(--fg4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ color: 'var(--fg1)' }}>Autoplay</span>
            </div>
            <ToggleSwitch enabled={settings.playerAutoplay} />
          </button>
        </div>

        {/* EPG Settings */}
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bg3)' }}>
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--fg4)' }}>
            TV Guide (EPG)
          </h2>
          
          <button
            onClick={handleToggleEPG}
            className="w-full flex items-center justify-between p-4 transition-colors"
            style={{ borderTop: '1px solid var(--bg3)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" style={{ color: 'var(--fg4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span style={{ color: 'var(--fg1)' }}>Enable EPG</span>
            </div>
            <ToggleSwitch enabled={settings.epgEnabled} />
          </button>

          {settings.epgEnabled && (
            <div className="p-4" style={{ borderTop: '1px solid var(--bg3)' }}>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--fg4)' }}>
                EPG XML URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={epgUrl}
                  onChange={(e) => setEpgUrl(e.target.value)}
                  placeholder="https://example.com/epg.xml"
                  className="flex-1 px-4 py-2 rounded-lg focus:outline-none transition-colors"
                  style={{ backgroundColor: 'var(--bg1)', border: '1px solid var(--bg4)', color: 'var(--fg1)' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--bright-blue)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--bg4)'}
                />
                <button
                  onClick={handleSaveEPGUrl}
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--blue)', color: 'var(--fg0)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bright-blue)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--blue)'}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Playlists */}
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bg3)' }}>
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--fg4)' }}>
            Playlists
          </h2>
          
          {playlists.length === 0 ? (
            <div className="p-4 text-sm" style={{ color: 'var(--fg4)', borderTop: '1px solid var(--bg3)' }}>
              No saved playlists. Add one from the home screen.
            </div>
          ) : (
            <div style={{ borderTop: '1px solid var(--bg3)' }}>
              {playlists.map((playlist) => (
                <div key={playlist.id} className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--bg3)' }}>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--fg1)' }}>{playlist.name}</p>
                    <p className="text-sm" style={{ color: 'var(--fg4)' }}>
                      {playlist.channels.length} channels
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeletePlaylist(playlist.id)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: 'var(--bright-red)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(251, 73, 52, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bg3)' }}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between p-4 transition-colors"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--fg4)' }}>
              Advanced
            </h2>
            <svg
              className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              style={{ color: 'var(--fg4)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAdvanced && (
            <div className="p-4" style={{ borderTop: '1px solid var(--bg3)' }}>
              <button
                onClick={handleClearAllData}
                className="w-full px-4 py-3 rounded-lg transition-colors"
                style={{ backgroundColor: 'rgba(204, 36, 29, 0.2)', border: '1px solid var(--red)', color: 'var(--bright-red)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(204, 36, 29, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(204, 36, 29, 0.2)'}
              >
                Clear All Data
              </button>
            </div>
          )}
        </div>

        {/* App Info */}
        <div className="text-center py-8 text-sm" style={{ color: 'var(--fg4)' }}>
          <p>IPTV Stream v1.0</p>
          <p className="mt-1">A modern IPTV player for the web</p>
        </div>
      </div>
    </div>
  );
}
