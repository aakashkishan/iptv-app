import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface SignUpPageProps {
  onSwitchToSignIn: () => void;
}

export default function SignUpPage({ onSwitchToSignIn }: SignUpPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password, fullName);
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg0-hard)' }}>
        <div className="w-full max-w-md">
          <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--bg1)', border: '1px solid var(--bg3)' }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(152, 151, 26, 0.2)' }}>
              <svg className="w-10 h-10" style={{ color: 'var(--bright-green)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--fg0)' }}>Check Your Email</h2>
            <p className="mb-6" style={{ color: 'var(--fg4)' }}>
              We've sent you a confirmation email. Please verify your email address to continue.
            </p>
            <button
              onClick={onSwitchToSignIn}
              className="w-full px-6 py-3 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: 'var(--blue)', color: 'var(--fg0)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bright-blue)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--blue)'}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg0-hard)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--bright-blue), var(--blue))' }}>
            <svg className="w-10 h-10" style={{ color: 'var(--fg0)' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--fg0)' }}>IPTV Stream</h1>
          <p style={{ color: 'var(--fg4)' }}>Create your account</p>
        </div>

        {/* Sign Up Form */}
        <div className="rounded-xl p-8" style={{ backgroundColor: 'var(--bg1)', border: '1px solid var(--bg3)' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(204, 36, 29, 0.2)', border: '1px solid var(--red)', color: 'var(--bright-red)' }}>
                {error}
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
                style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bg4)', color: 'var(--fg1)' }}
                placeholder="John Doe"
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--bright-blue)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--bg4)'}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--fg3)' }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg focus:outline-none transition-colors"
                style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bg4)', color: 'var(--fg1)' }}
                placeholder="you@example.com"
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--bright-blue)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--bg4)'}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--fg3)' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg focus:outline-none transition-colors"
                style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bg4)', color: 'var(--fg1)' }}
                placeholder="••••••••"
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--bright-blue)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--bg4)'}
              />
              <p className="text-xs mt-2" style={{ color: 'var(--bright-neutral)' }}>Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--blue)', color: 'var(--fg0)' }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--bright-blue)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--blue)'; }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: 'var(--fg4)' }}>
              Already have an account?{' '}
              <button
                onClick={onSwitchToSignIn}
                className="font-medium transition-colors"
                style={{ color: 'var(--bright-blue)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--fg0)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--bright-blue)'}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
