import { Link } from 'react-router-dom';
import { Heart, Music } from 'lucide-react';
import SongCard from '../components/SongCard';
import { usePlayer } from '../context/PlayerContext';
import './Favorites.css';

const Favorites = () => {
  const { favoriteSongs } = usePlayer();
  const favs = favoriteSongs();

  if (favs.length === 0) {
    return (
      <div className="empty-state favorites-empty">
        <Heart size={48} />
        <h3>Nenhuma favorita ainda</h3>
        <p className="text-subdued">
          Toque no coração de uma música para salvá-la aqui e ouvir quando quiser.
        </p>
        <Link className="chip-btn" to="/biblioteca">
          <Music size={16} /> Explorar músicas
        </Link>
      </div>
    );
  }

  return (
    <div className="song-grid">
      {favs.map(song => (
        <SongCard key={song.id} song={song} list={favs} />
      ))}
    </div>
  );
};

export default Favorites;
