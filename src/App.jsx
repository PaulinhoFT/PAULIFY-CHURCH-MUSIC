import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import SongList from './components/SongList';
import Home from './components/Home';
import songsData from './data/songs.json';
import './App.css';

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtist, setSelectedArtist] = useState("Todos");
  const [currentView, setCurrentView] = useState("home"); // 'home' ou 'playlist'

  useEffect(() => {
    setSongs(songsData);
  }, []);

  // Compute unique artists, sorted alphabetically
  const artists = ["Todos", ...Array.from(new Set(songs.map(s => s.artist))).sort()];

  // Filter and sort songs
  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArtist = selectedArtist === "Todos" || song.artist === selectedArtist;
    return matchesSearch && matchesArtist;
  }).sort((a, b) => a.title.localeCompare(b.title));

  const handlePlaySong = (song) => {
    setCurrentSong(song);
  };

  const playNext = () => {
    if (!currentSong || filteredSongs.length === 0) return;
    const currentIndex = filteredSongs.findIndex(s => s.id === currentSong.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % filteredSongs.length;
      setCurrentSong(filteredSongs[nextIndex]);
    }
  };

  const playPrevious = () => {
    if (!currentSong || filteredSongs.length === 0) return;
    const currentIndex = filteredSongs.findIndex(s => s.id === currentSong.id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
      setCurrentSong(filteredSongs[prevIndex]);
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        artists={artists}
        selectedArtist={selectedArtist}
        onSelectArtist={setSelectedArtist}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <main className="main-content">
        <header className="main-header">
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, marginBottom: '4px', whiteSpace: 'nowrap', fontSize: 'clamp(1rem, 4vw, 2rem)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentView === 'home' ? 'Bem vindo ao Paulify - Church Music !' : 'Sua Playlist'}
            </h1>
            <p className="text-subdued" style={{ margin: 0 }}>
              {currentView === 'playlist' ? `${filteredSongs.length} músicas disponíveis.` : 'Os melhores louvores para abençoar o seu dia.'}
            </p>
          </div>
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Buscar música ou cantor..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'playlist') setCurrentView('playlist');
              }}
              className="search-input"
            />
          </div>
        </header>
        
        {currentView === 'home' ? (
          <Home 
            songs={songs} 
            onPlay={handlePlaySong} 
            artists={artists} 
            onSelectArtist={setSelectedArtist}
            onViewChange={setCurrentView}
          />
        ) : (
          <SongList songs={filteredSongs} onPlay={handlePlaySong} />
        )}
      </main>
      <Player 
        currentSong={currentSong} 
        onNext={playNext} 
        onPrev={playPrevious}
        currentView={currentView}
      />
    </div>
  );
}

export default App;
