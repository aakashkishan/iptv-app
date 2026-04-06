import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import EPGPage from './pages/EPGPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';

function AuthLayout() {
  const [isSignIn, setIsSignIn] = useState(true);

  return isSignIn ? (
    <SignInPage onSwitchToSignUp={() => setIsSignIn(false)} />
  ) : (
    <SignUpPage onSwitchToSignIn={() => setIsSignIn(true)} />
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg0-hard)' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <AuthLayout />;
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--bg0-hard)' }}>
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/epg" element={<EPGPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
