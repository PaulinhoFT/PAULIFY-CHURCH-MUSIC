import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, LibraryBig, Heart, Mic, ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import './Sidebar.css';

const Sidebar = () => {
  const { songs, selectedArtist, setSelectedArtist, sidebarCollapsed, setSidebarCollapsed, favoriteSongs, setCommandOpen } = usePlayer();
  const navigate = useNavigate();
  const [isCantoresOpen, setIsCantoresOpen] = useState(true);

  const artists = ["Todos", ...Array.from(new Set(songs.map(s => s.artist))).sort()];

  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
    navigate(artist === 'Todos' ? '/biblioteca' : `/biblioteca?artista=${encodeURIComponent(artist)}`);
  };

  const goHome = () => {
    setSelectedArtist('Todos');
  };

  return (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Paulify Logo" className="logo-img" />
        {!sidebarCollapsed && <span className="logo-text">Paulify</span>}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} onClick={goHome} title="Início">
              <Home size={20} className="icon" />
              <span>Início</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/biblioteca" className={({ isActive }) => (isActive ? 'active' : '')} title="Playlist">
              <LibraryBig size={20} className="icon" />
              <span>Playlist</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/favoritas" className={({ isActive }) => (isActive ? 'active' : '')} title="Favoritas">
              <Heart size={20} className="icon" />
              <span>Favoritas{favoriteSongs().length > 0 ? ` (${favoriteSongs().length})` : ''}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/biblioteca" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setCommandOpen(true)} title="Buscar">
              <Search size={20} className="icon" />
              <span>Buscar</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="sidebar-divider"></div>

      <div className="sidebar-filters">
        <div
          className="sidebar-filters-header"
          onClick={() => setIsCantoresOpen(!isCantoresOpen)}
          title="Cantores"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mic size={18} /> {!sidebarCollapsed && <span>Cantores</span>}
          </div>
          {!sidebarCollapsed && (isCantoresOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
        </div>

        {isCantoresOpen && !sidebarCollapsed && (
          <ul className="sidebar-artist-list">
            {artists.map((artist) => (
              <li
                key={artist}
                className={selectedArtist === artist ? 'active' : ''}
                onClick={() => handleArtistClick(artist)}
              >
                {artist}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
