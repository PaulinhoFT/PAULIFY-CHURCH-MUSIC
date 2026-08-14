import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import './Home.css';

const Home = ({ songs, onPlay, artists, onSelectArtist, onViewChange }) => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [featuredSongs, setFeaturedSongs] = useState([]);
  const [randomArtists, setRandomArtists] = useState([]);

  useEffect(() => {
    if (songs && songs.length > 0) {
      // Create random lists only once when songs load
      const shuffled = [...songs].sort(() => 0.5 - Math.random());
      setFeaturedSongs(shuffled.slice(0, 5));
    }
    if (artists && artists.length > 0) {
      const filtered = artists.filter(a => a !== 'Todos');
      const shuffledArtists = [...filtered].sort(() => 0.5 - Math.random());
      setRandomArtists(shuffledArtists.slice(0, 10));
    }
  }, [songs, artists]);

  useEffect(() => {
    if (featuredSongs.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % featuredSongs.length);
    }, 5000); // Muda a cada 5 segundos
    return () => clearInterval(interval);
  }, [featuredSongs]);

  if (!songs || songs.length === 0) return null;

  const handleArtistClick = (artist) => {
    onSelectArtist(artist);
    onViewChange('playlist');
  };

  const handlePlayFromHome = (song) => {
    onPlay(song);
    onViewChange('playlist');
  };

  const heroSong = featuredSongs[heroIndex];

  return (
    <div className="home-container">
      
      {/* HERO SECTION */}
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
          <div className="hero-content" key={heroSong.id}>
            <span className="hero-tag">Destaque</span>
            <h1 className="hero-title">{heroSong.title}</h1>
            <p className="hero-artist">{heroSong.artist}</p>
            <button className="hero-play-btn" onClick={() => handlePlayFromHome(heroSong)}>
              <Play size={24} fill="black" />
              Ouvir agora
            </button>
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

      {/* CANTORES */}
      <section className="home-section" style={{ marginBottom: '60px' }}>
        <h2 className="section-title">Cantores</h2>
        <div className="carousel">
          {randomArtists.map((artist, idx) => {
            const safeName = artist.replace(/ /g, '_').replace(/\//g, '_');
            const imgPath = `/artists/${safeName}.jpg`;
            return (
              <div className="artist-card" key={idx} onClick={() => handleArtistClick(artist)}>
                <div className="artist-circle">
                  <img src={imgPath} alt={artist} className="artist-image" />
                </div>
                <p className="artist-name">{artist}</p>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default Home;;
