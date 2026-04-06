import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { name: 'Home', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Favorites', path: '/favorites', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { name: 'EPG', path: '/epg', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { name: 'Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { name: 'Settings', path: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export default function Sidebar() {
  const location = useLocation();
  const { signOut, profile } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 h-full" style={{ backgroundColor: 'var(--bg1)', borderRight: '1px solid var(--bg3)' }}>
      {/* Logo */}
      <div className="p-6" style={{ borderBottom: '1px solid var(--bg3)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--bright-blue), var(--blue))' }}>
            <svg className="w-6 h-6" style={{ color: 'var(--fg0)' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--fg0)' }}>IPTV Stream</h1>
            <p className="text-xs" style={{ color: 'var(--fg4)' }}>Watch Live TV</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
              style={{
                backgroundColor: isActive ? 'var(--blue)' : 'transparent',
                color: isActive ? 'var(--fg0)' : 'var(--fg3)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--bg2)';
                  e.currentTarget.style.color = 'var(--fg1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--fg3)';
                }
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Sign Out */}
      <div className="p-4" style={{ borderTop: '1px solid var(--bg3)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--bg2)', color: 'var(--bright-blue)' }}>
            {(profile?.full_name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--fg1)' }}>
              {profile?.full_name || 'User'}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--fg4)' }}>
              {profile?.email}
            </p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--bg2)', color: 'var(--fg3)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg3)';
            e.currentTarget.style.color = 'var(--fg1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg2)';
            e.currentTarget.style.color = 'var(--fg3)';
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
