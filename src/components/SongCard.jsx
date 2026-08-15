import { Play, Pause, Plus, Heart } from 'lucide-react';
import CoverImage from './CoverImage';
import { usePlayer } from '../context/PlayerContext';
import './SongCard.css';

const SongCard = ({ song, list }) => {
  const { currentSong, isPlaying, playSong, addToQueue, toggleFavorite, isFavorite, openContextMenu } = usePlayer();
  const isCurrent = song.id === currentSong?.id;

  const handlePlay = (e) => {
    e.stopPropagation();
    playSong(song, list);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(song);
  };

  const handleQueue = (e) => {
    e.stopPropagation();
    addToQueue(song);
  };

  return (
    <div
      className={`song-card ${isCurrent ? 'now-playing' : ''}`}
      onClick={handlePlay}
      onContextMenu={(e) => openContextMenu(e, song)}
    >
      <div className="song-cover-container">
        <CoverImage src={song.coverUrl} alt={song.title} className="song-cover-wrap" fallbackText="🎵" />
        {isCurrent && isPlaying && (
          <div className="equalizer cover-eq"><span></span><span></span><span></span></div>
        )}
        <button className={`card-action-btn fav-btn ${isFavorite(song.id) ? 'is-fav' : ''}`} onClick={handleFavorite} title={isFavorite(song.id) ? 'Remover das favoritas' : 'Adicionar às favoritas'}>
          <Heart size={16} fill={isFavorite(song.id) ? 'currentColor' : 'none'} />
        </button>
        <button className="card-action-btn queue-btn" onClick={handleQueue} title="Adicionar à fila">
          <Plus size={16} />
        </button>
        <button className="play-button-overlay" onClick={handlePlay} title="Reproduzir">
          {isCurrent && isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
        </button>
      </div>
      <div className="song-info">
        <h3 className="song-title truncate">{song.title}</h3>
        <p className="song-artist truncate text-subdued">{song.artist}</p>
      </div>
    </div>
  );
};

export default SongCard;
