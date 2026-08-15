import SongCard from './SongCard';
import './SongCarousel.css';

const SongCarousel = ({ title, songs, list }) => {
  if (!songs || songs.length === 0) return null;

  return (
    <section className="home-section">
      <h2 className="section-title">{title}</h2>
      <div className="carousel">
        {songs.map(song => (
          <div className="carousel-item" key={song.id}>
            <SongCard song={song} list={list} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SongCarousel;
