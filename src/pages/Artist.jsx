import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Shuffle, ChevronLeft, Music } from 'lucide-react';
import SongCard from '../components/SongCard';
import CoverImage from '../components/CoverImage';
import { artistImagePath } from '../components/ArtistCard';
import { usePlayer } from '../context/PlayerContext';
import { getDominantColor } from '../utils/color';
import './Artist.css';

const Artist = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { songs, playSong } = usePlayer();
  const [accent, setAccent] = useState(null);

  const artistName = decodeURIComponent(name || '');
  const artistSongs = songs.filter(s => s.artist === artistName);

  useEffect(() => {
    let active = true;
    getDominantColor(artistImagePath(artistName)).then(color => {
      if (active && color) setAccent(color);
    });
    return () => { active = false; };
  }, [artistName]);

  if (artistSongs.length === 0) {
    return (
      <div className="empty-state">
        <Music size={40} />
        <h3>Cantor não encontrado</h3>
        <p className="text-subdued">Não encontramos músicas para "{artistName}".</p>
        <Link className="chip-btn" to="/biblioteca">Ver a biblioteca</Link>
      </div>
    );
  }

  const handlePlayAll = () => {
    playSong(artistSongs[0], artistSongs);
  };

  const handleShuffle = () => {
    const shuffled = [...artistSongs].sort(() => 0.5 - Math.random());
    playSong(shuffled[0], shuffled);
  };

  const headerStyle = accent
    ? { background: `linear-gradient(to bottom, rgba(${accent.r}, ${accent.g}, ${accent.b}, 0.55) 0%, var(--bg-base) 75%)` }
    : undefined;

  return (
    <div className="artist-page">
      <button className="back-btn" onClick={() => navigate(-1)} title="Voltar">
        <ChevronLeft size={24} /> Voltar
      </button>

      <div className="artist-header" style={headerStyle}>
        <CoverImage
          src={artistImagePath(artistName)}
          alt={artistName}
          className="artist-header-img"
          fallbackText={artistName.charAt(0)}
        />
        <div className="artist-header-info">
          <span className="hero-tag">Cantor</span>
          <h1 className="artist-header-name">{artistName}</h1>
          <p className="text-subdued">
            {artistSongs.length} {artistSongs.length === 1 ? 'música' : 'músicas'}
          </p>
          <div className="hero-actions">
            <button className="hero-play-btn" onClick={handlePlayAll}>
              <Play size={20} fill="black" /> Tocar
            </button>
            <button className="hero-action-btn" onClick={handleShuffle}>
              <Shuffle size={18} /> Embaralhar
            </button>
          </div>
        </div>
      </div>

      <div className="song-grid">
        {artistSongs.map(song => (
          <SongCard key={song.id} song={song} list={artistSongs} />
        ))}
      </div>
    </div>
  );
};

export default Artist;
