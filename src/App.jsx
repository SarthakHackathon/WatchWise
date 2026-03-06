import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Browse from './pages/Browse';
import FilmDetail from './pages/FilmDetail';
import Watchlist from './pages/Watchlist';
import AIPicks from './pages/AIPicks';

function AppContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar onAuthClick={() => setAuthModalOpen(true)} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <Routes>
        <Route path="/" element={<Home onAuthRequired={() => setAuthModalOpen(true)} />} />
        <Route path="/browse" element={<Browse onAuthRequired={() => setAuthModalOpen(true)} />} />
        <Route path="/film/:id" element={<FilmDetail onAuthRequired={() => setAuthModalOpen(true)} />} />
        <Route path="/watchlist" element={<Watchlist onAuthRequired={() => setAuthModalOpen(true)} />} />
        <Route path="/ai-picks" element={<AIPicks onAuthRequired={() => setAuthModalOpen(true)} />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <AppContent />
      </WatchlistProvider>
    </AuthProvider>
  );
}
