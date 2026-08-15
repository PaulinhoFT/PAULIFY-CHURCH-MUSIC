import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Play, Plus, Heart, Music, Mic } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { artistRoute } from './ArtistCard';
import './CommandPalette.css';

const CommandPalette = () => {
  const navigate = useNavigate();
  const { songs, commandOpen, setCommandOpen, playSong, addToQueue, toggleFavorite, isFavorite } = usePlayer();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (commandOpen) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [commandOpen]);

  useEffect(() => {
    if (!commandOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setCommandOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [commandOpen, setCommandOpen]);

  if (!commandOpen) return null;

  const q = query.trim().toLowerCase();
  const songMatches = q
    ? songs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q))
    : songs.slice(0, 8);
  const artistMatches = q
    ? [...new Set(songs.map(s => s.artist))]
        .filter(a => a.toLowerCase().includes(q))
        .sort()
    : [];

  const items = [
    ...artistMatches.map(a => ({ type: 'artist', key: `a-${a}`, label: a })),
    ...songMatches.map(s => ({ type: 'song', key: `s-${s.id}`, song: s })),
  ];

  const handleSelect = (index) => {
    const item = items[index];
    if (!item) return;
    if (item.type === 'artist') {
      navigate(artistRoute(item.label));
      setCommandOpen(false);
    } else {
      playSong(item.song, songs);
      setCommandOpen(false);
    }
  };

  return (
    <div className="palette-backdrop" onClick={() => setCommandOpen(false)}>
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <div className="palette-search-row">
          <Search size={20} className="palette-search-icon" />
          <input
            ref={inputRef}
            className="palette-input"
            placeholder="Buscar músicas e cantores... (Enter para selecionar)"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, items.length - 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
              else if (e.key === 'Enter') { handleSelect(selected); }
              else if (e.key === 'Escape') { setCommandOpen(false); }
            }}
          />
          <kbd className="palette-kbd">Esc</kbd>
        </div>

        <div className="palette-results">
          {items.length === 0 && (
            <p className="palette-empty">Nenhum resultado para "{query}"</p>
          )}
          {items.map((item, idx) => (
            <div
              key={item.key}
              className={`palette-item ${idx === selected ? 'selected' : ''}`}
              onMouseEnter={() => setSelected(idx)}
              onClick={() => handleSelect(idx)}
            >
              {item.type === 'artist' ? (
                <div className="palette-thumb artist-thumb"><Mic size={16} /></div>
              ) : (
                <div className="palette-thumb">
                  <img src={item.song.coverUrl} alt="" />
                </div>
              )}
              <div className="palette-item-info">
                <span className="palette-title truncate">{item.label}</span>
                <span className="palette-sub truncate">
                  {item.type === 'artist' ? 'Cantor' : item.song.artist}
                </span>
              </div>
              {item.type === 'song' && (
                <div className="palette-actions">
                  <button title="Tocar" onClick={(e) => { e.stopPropagation(); playSong(item.song, songs); setCommandOpen(false); }}>
                    <Play size={16} />
                  </button>
                  <button title="Adicionar à fila" onClick={(e) => { e.stopPropagation(); addToQueue(item.song); }}>
                    <Plus size={16} />
                  </button>
                  <button title="Favoritar" onClick={(e) => { e.stopPropagation(); toggleFavorite(item.song); }}>
                    <Heart size={16} fill={isFavorite(item.song.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="palette-footer">
            <span><kbd>↑</kbd><kbd>↓</kbd> navegar</span>
            <span><kbd>Enter</kbd> selecionar</span>
            <span className="palette-hint"><Music size={12} /> músicas · <Mic size={12} /> cantores</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandPalette;
