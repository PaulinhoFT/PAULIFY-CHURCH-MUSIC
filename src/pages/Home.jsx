import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Shuffle, Heart } from 'lucide-react';
import SongCarousel from '../components/SongCarousel';
import SongCard from '../components/SongCard';
import ArtistCard from '../components/ArtistCard';
import { usePlayer } from '../context/PlayerContext';
import { getDominantColor } from '../utils/color';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { songs, playSong, mostPlayedSongs, recentSongs, favoriteSongs } = usePlayer();

  const [heroIndex, setHeroIndex] = useState(0);
  const [heroColor, setHeroColor] = useState(null);

  const featuredSongs = useMemo(() => {
    const shuffled = [...songs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs]);

  const recommendedSongs = useMemo(() => {
    const shuffled = [...songs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  }, [songs]);

  const heroSong = featuredSongs[heroIndex];

  useEffect(() => {
    if (!featuredSongs.length) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % featuredSongs.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredSongs]);

  useEffect(() => {
    let active = true;
    if (heroSong?.coverUrl) {
      getDominantColor(heroSong.coverUrl).then(color => {
        if (active) setHeroColor(color);
      });
    }
    return () => { active = false; };
  }, [heroSong?.coverUrl, heroSong]);

  if (!songs || songs.length === 0) return null;

  const mostPlayed = mostPlayedSongs().slice(0, 10);
  const recents = recentSongs().slice(0, 10);
  const artists = Array.from(new Set(songs.map(s => s.artist))).sort();
  const favCount = favoriteSongs().length;

  const handlePlayHero = () => {
    if (heroSong) playSong(heroSong, songs);
  };

  const handleShuffleAll = () => {
    const shuffled = [...songs].sort(() => 0.5 - Math.random());
    if (shuffled.length) playSong(shuffled[0], shuffled);
  };

  const heroGradient = heroColor
    ? `linear-gradient(to top, rgba(${heroColor.r}, ${heroColor.g}, ${heroColor.b}, 0.92) 0%, rgba(${heroColor.r}, ${heroColor.g}, ${heroColor.b}, 0.25) 55%, rgba(0,0,0,0) 100%)`
    : undefined;

  return (
    <div className="home-container">
      {/* RECOMENDADAS */}
      <section className="home-section">
        <h2 className="section-title">Recomendadas para você</h2>
        <div className="song-grid">
          {recommendedSongs.map(song => (
            <SongCard key={song.id} song={song} list={songs} />
          ))}
        </div>
      </section>

      {/* HERO */}
      {heroSong && (
        <div className="hero-banner">
          {featuredSongs.map((song, idx) => (
            <img
              key={song.id}
              src={song.coverUrl}
              alt="Hero Cover"
              className={`hero-image ${idx === heroIndex ? 'active' : ''}`}
            />
          ))}
          {heroGradient && <div className="hero-gradient" style={{ background: heroGradient }} />}
          <div className="hero-content" key={heroSong.id}>
            <span className="hero-tag">Destaque</span>
            <h1 className="hero-title">{heroSong.title}</h1>
            <p className="hero-artist">{heroSong.artist}</p>
            <div className="hero-actions">
              <button className="hero-play-btn" onClick={handlePlayHero}>
                <Play size={24} fill="black" /> Ouvir agora
              </button>
              <button className="hero-action-btn" onClick={handleShuffleAll}>
                <Shuffle size={20} /> Embaralhar tudo
              </button>
              {favCount > 0 && (
                <button className="hero-action-btn" onClick={() => navigate('/favoritas')}>
                  <Heart size={20} fill="currentColor" /> Favoritas ({favCount})
                </button>
              )}
            </div>
          </div>
          <div className="hero-indicators">
            {featuredSongs.map((_, idx) => (
              <span
                key={idx}
                className={`indicator ${idx === heroIndex ? 'active' : ''}`}
                onClick={() => setHeroIndex(idx)}
              />
            ))}
          </div>
        </div>
      )}

      {/* MAIS TOCADAS */}
      {mostPlayed.length > 0 && (
        <SongCarousel title="Mais tocadas" songs={mostPlayed} list={songs} />
      )}

      {/* RECENTES */}
      {recents.length > 0 && (
        <SongCarousel title="Tocadas recentemente" songs={recents} list={songs} />
      )}

      {/* CANTORES */}
      <section className="home-section">
        <h2 className="section-title">Cantores</h2>
        <div className="carousel">
          {artists.map(artist => (
            <div className="carousel-item artist-carousel-item" key={artist}>
              <ArtistCard
                artist={artist}
                songCount={songs.filter(s => s.artist === artist).length}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
