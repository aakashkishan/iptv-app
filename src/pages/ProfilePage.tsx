import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await updateProfile({ full_name: fullName });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    alert('Account deletion must be done through Supabase dashboard or contact support.');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-sm safe-top" style={{ backgroundColor: 'rgba(40, 40, 40, 0.95)', borderBottom: '1px solid var(--bg3)' }}>
        <div className="p-4">
          <h1 className="text-xl font-bold" style={{ color: 'var(--fg0)' }}>Profile</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-4 pb-24 md:pb-4 space-y-4">
        {/* Profile Card */}
        <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bg3)' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: 'linear-gradient(135deg, var(--bright-blue), var(--blue))', color: 'var(--fg0)' }}>
              {(profile?.full_name || user?.email || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--fg1)' }}>
                {profile?.full_name || 'User'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--fg4)' }}>{user?.email}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--bright-neutral)' }}>
                Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {message.text && (
              <div className="px-4 py-3 rounded-lg text-sm" style={{
                backgroundColor: message.type === 'success' ? 'rgba(152, 151, 26, 0.2)' : 'rgba(204, 36, 29, 0.2)',
                border: `1px solid ${message.type === 'success' ? 'var(--green)' : 'var(--red)'}`,
                color: message.type === 'success' ? 'var(--bright-green)' : 'var(--bright-red)'
              }}>
                {message.text}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2" style={{ color: 'var(--fg3)' }}>
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:outline-none transition-colors"
                style={{ backgroundColor: 'var(--bg1)', border: '1px solid var(--bg4)', color: 'var(--fg1)' }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--bright-blue)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--bg4)'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--fg3)' }}>
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-lg"
                style={{ backgroundColor: 'var(--bg1)', border: '1px solid var(--bg4)', color: 'var(--fg4)', cursor: 'not-allowed' }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--blue)', color: 'var(--fg0)' }}
              onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = 'var(--bright-blue)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--blue)'; }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bg3)' }}>
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--fg4)' }}>
            Account Details
          </h2>
          <div style={{ borderTop: '1px solid var(--bg3)' }}>
            <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--bg3)' }}>
              <span style={{ color: 'var(--fg4)' }}>User ID</span>
              <span className="text-sm font-mono" style={{ color: 'var(--fg1)' }}>{user?.id?.slice(0, 8)}...</span>
            </div>
            <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--bg3)' }}>
              <span style={{ color: 'var(--fg4)' }}>Email Verified</span>
              <span style={{ color: user?.email_confirmed_at ? 'var(--bright-green)' : 'var(--bright-yellow)' }}>
                {user?.email_confirmed_at ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4">
              <span style={{ color: 'var(--fg4)' }}>Last Sign In</span>
              <span className="text-sm" style={{ color: 'var(--fg1)' }}>
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg2)', border: '1px solid rgba(204, 36, 29, 0.5)' }}>
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--bright-red)' }}>
            Danger Zone
          </h2>
          <div className="p-4">
            <button
              onClick={handleDeleteAccount}
              className="w-full px-4 py-3 rounded-lg transition-colors"
              style={{ backgroundColor: 'rgba(204, 36, 29, 0.2)', border: '1px solid var(--red)', color: 'var(--bright-red)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(204, 36, 29, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(204, 36, 29, 0.2)'}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
