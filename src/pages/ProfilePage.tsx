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

    // Account deletion requires Supabase Edge Function or admin API
    alert('Account deletion must be done through Supabase dashboard or contact support.');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-dark-900/95 backdrop-blur-sm border-b border-dark-800 safe-top">
        <div className="p-4">
          <h1 className="text-xl font-bold text-white">Profile</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-4 pb-24 md:pb-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {(profile?.full_name || user?.email || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {profile?.full_name || 'User'}
              </h2>
              <p className="text-sm text-dark-400">{user?.email}</p>
              <p className="text-xs text-dark-500 mt-1">
                Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {message.text && (
              <div className={`px-4 py-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-900/20 border border-green-800 text-green-500' 
                  : 'bg-red-900/20 border border-red-800 text-red-500'
              }`}>
                {message.text}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-dark-300 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-lg text-dark-400 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-dark-400 uppercase tracking-wide">
            Account Details
          </h2>
          <div className="divide-y divide-dark-700">
            <div className="flex items-center justify-between p-4">
              <span className="text-dark-400">User ID</span>
              <span className="text-white text-sm font-mono">{user?.id?.slice(0, 8)}...</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-dark-400">Email Verified</span>
              <span className={user?.email_confirmed_at ? 'text-green-500' : 'text-yellow-500'}>
                {user?.email_confirmed_at ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-dark-400">Last Sign In</span>
              <span className="text-white text-sm">
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-dark-800 rounded-lg border border-red-900/50 overflow-hidden">
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-red-500 uppercase tracking-wide">
            Danger Zone
          </h2>
          <div className="p-4">
            <button
              onClick={handleDeleteAccount}
              className="w-full px-4 py-3 bg-red-900/20 border border-red-800 text-red-500 rounded-lg hover:bg-red-900/30 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
