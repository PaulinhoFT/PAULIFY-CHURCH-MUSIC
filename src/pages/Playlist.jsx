import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import SongCard from '../components/SongCard';
import { usePlayer } from '../context/PlayerContext';
import './Playlist.css';

const Playlist = () => {
  const { songs, searchQuery, selectedArtist, setSelectedArtist } = usePlayer();
  const [searchParams] = useSearchParams();
  const [sortMode, setSortMode] = useState('alpha');

  useEffect(() => {
    const artistParam = searchParams.get('artista');
    if (artistParam) {
      setSelectedArtist(artistParam);
    }
  }, [searchParams, setSelectedArtist]);

  const filtered = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArtist = selectedArtist === 'Todos' || song.artist === selectedArtist;
    return matchesSearch && matchesArtist;
  });

  const sorted = [...filtered];
  if (sortMode === 'alpha') sorted.sort((a, b) => a.title.localeCompare(b.title));
  else if (sortMode === 'alphaDesc') sorted.sort((a, b) => b.title.localeCompare(a.title));

  return (
    <div className="playlist-container">
      <div className="playlist-toolbar">
        <p className="text-subdued playlist-count">
          {sorted.length} {sorted.length === 1 ? 'música' : 'músicas'}
          {selectedArtist !== 'Todos' && ` · ${selectedArtist}`}
        </p>
        <div className="playlist-toolbar-right">
          {selectedArtist !== 'Todos' && (
            <button className="chip-btn" onClick={() => setSelectedArtist('Todos')}>
              Limpar filtro
            </button>
          )}
          <select
            className="sort-select"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
            title="Ordenar"
          >
            <option value="alpha">A → Z</option>
            <option value="alphaDesc">Z → A</option>
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <Search size={40} />
          <h3>Nenhuma música encontrada</h3>
          <p className="text-subdued">Tente outra busca ou limpe os filtros.</p>
        </div>
      ) : (
        <div className="song-grid">
          {sorted.map(song => (
            <SongCard key={song.id} song={song} list={sorted} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlist;
