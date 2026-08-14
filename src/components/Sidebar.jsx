import React, { useState } from 'react';
import { Home, LibraryBig, Mic, ChevronDown, ChevronRight } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ artists, selectedArtist, onSelectArtist, currentView, onViewChange }) => {
  const [isCantoresOpen, setIsCantoresOpen] = useState(true);

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Paulify Logo" className="logo-img" />
        <span className="logo-text">Paulify</span>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li 
            className={currentView === 'home' ? 'active' : ''} 
            onClick={() => { onViewChange('home'); onSelectArtist('Todos'); }}
          >
            <Home size={20} className="icon" /> Início
          </li>
          <li 
            className={currentView === 'playlist' ? 'active' : ''}
            onClick={() => onViewChange('playlist')}
          >
            <LibraryBig size={20} className="icon" /> Playlist
          </li>
        </ul>
      </nav>
      <div className="sidebar-divider"></div>
      
      <div className="sidebar-filters">
        <div 
          className="sidebar-filters-header" 
          onClick={() => setIsCantoresOpen(!isCantoresOpen)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mic size={18} /> Cantores
          </div>
          {isCantoresOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
        
        {isCantoresOpen && (
          <ul className="sidebar-artist-list">
            {artists.map((artist, index) => (
              <li 
                key={index}
                className={selectedArtist === artist && currentView === 'playlist' ? 'active' : ''}
                onClick={() => {
                  onSelectArtist(artist);
                  onViewChange('playlist'); // Força abrir a playlist filtrada
                }}
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
