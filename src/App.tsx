import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import EPGPage from './pages/EPGPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-dark-950">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/epg" element={<EPGPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

        {/* Mobile Bottom Nav */}
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
