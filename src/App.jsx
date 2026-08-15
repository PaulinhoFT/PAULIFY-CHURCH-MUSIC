import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import LayoutHeader from './components/LayoutHeader';
import Toast from './components/Toast';
import CommandPalette from './components/CommandPalette';
import ContextMenu from './components/ContextMenu';
import Home from './pages/Home';
import Playlist from './pages/Playlist';
import Artist from './pages/Artist';
import Favorites from './pages/Favorites';
import './App.css';

const Shell = () => {
  const location = useLocation();
  const {
    currentSong, toggleFavorite, sidebarCollapsed,
    commandOpen, setCommandOpen, globalTogglePlay,
  } = usePlayer();

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setCommandOpen(!commandOpen);
        return;
      }
      const target = e.target;
      const isTyping = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isTyping) return;
      if (e.code === 'Space') {
        e.preventDefault();
        globalTogglePlay();
      } else if (e.key === 'f' || e.key === 'F') {
        if (currentSong) toggleFavorite(currentSong);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandOpen, setCommandOpen, globalTogglePlay, currentSong, toggleFavorite]);

  return (
    <div className={`app-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <main className="main-content">
        <LayoutHeader />
        <div key={location.pathname} className="view-transition">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/biblioteca" element={<Playlist />} />
            <Route path="/artista/:name" element={<Artist />} />
            <Route path="/favoritas" element={<Favorites />} />
            <Route path="*" element={<Playlist />} />
          </Routes>
        </div>
      </main>
      <Player />
      <CommandPalette />
      <ContextMenu />
      <Toast />
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <PlayerProvider>
      <Shell />
    </PlayerProvider>
  </BrowserRouter>
);

export default App;
