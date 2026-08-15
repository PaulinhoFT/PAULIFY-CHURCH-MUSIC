import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import songsData from '../data/songs.json';

const PlayerContext = createContext(null);

export const usePlayer = () => useContext(PlayerContext);

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const PlayerProvider = ({ children }) => {
  const [songs] = useState(songsData);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');

  const [theme, setTheme] = useState(() => localStorage.getItem('paulify-theme') || 'dark');
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('Todos');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [favorites, setFavorites] = useState(() => readStorage('paulify-favorites', []));
  const [plays, setPlays] = useState(() => readStorage('paulify-plays', {}));
  const [recents, setRecents] = useState(() => readStorage('paulify-recents', []));

  const [contextMenu, setContextMenu] = useState(null);
  const [commandOpen, setCommandOpen] = useState(false);

  const playControlsRef = useRef(null);
  const registerPlayControls = useCallback((toggle) => {
    playControlsRef.current = toggle;
  }, []);
  const globalTogglePlay = useCallback(() => {
    if (playControlsRef.current) playControlsRef.current();
  }, []);

  useEffect(() => { localStorage.setItem('paulify-favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('paulify-plays', JSON.stringify(plays)); }, [plays]);
  useEffect(() => { localStorage.setItem('paulify-recents', JSON.stringify(recents)); }, [recents]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('paulify-theme', theme);
  }, [theme]);

  const showToast = useCallback((message) => {
    setToast({ id: Date.now(), message });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const recordPlay = useCallback((songId) => {
    setPlays(prev => ({ ...prev, [songId]: (prev[songId] || 0) + 1 }));
    setRecents(prev => [songId, ...prev.filter(id => id !== songId)].slice(0, 10));
  }, []);

  const startSong = useCallback((song, list) => {
    const index = list.findIndex(s => s.id === song.id);
    setQueue(list);
    setQueueIndex(index === -1 ? 0 : index);
    setCurrentSong(song);
    recordPlay(song.id);
  }, [recordPlay]);

  const playSong = useCallback((song, list) => {
    startSong(song, list || songs);
  }, [songs, startSong]);

  const playFromQueue = useCallback((index) => {
    if (index < 0 || index >= queue.length) return;
    const song = queue[index];
    setQueueIndex(index);
    setCurrentSong(song);
    recordPlay(song.id);
  }, [queue, recordPlay]);

  const addToQueue = useCallback((song) => {
    if (!currentSong) {
      setQueue([song]);
      setQueueIndex(0);
      setCurrentSong(song);
      recordPlay(song.id);
    } else {
      setQueue(prev => [...prev, song]);
    }
    showToast(`Adicionada à fila: ${song.title}`);
  }, [currentSong, recordPlay, showToast]);

  const removeFromQueue = useCallback((index) => {
    const next = queue.filter((_, i) => i !== index);
    setQueue(next);
    if (index < queueIndex) {
      setQueueIndex(queueIndex - 1);
    } else if (index === queueIndex) {
      if (next.length === 0) {
        setQueueIndex(-1);
        setCurrentSong(null);
      } else {
        const newIndex = Math.min(index, next.length - 1);
        setQueueIndex(newIndex);
        setCurrentSong(next[newIndex]);
      }
    }
  }, [queue, queueIndex]);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setQueueIndex(-1);
    setCurrentSong(null);
    showToast('Fila limpa');
  }, [showToast]);

  const pickShuffledIndex = useCallback((length, exclude) => {
    let next;
    do { next = Math.floor(Math.random() * length); } while (next === exclude);
    return next;
  }, []);

  const playNext = useCallback(() => {
    if (!currentSong || queue.length === 0) return;
    let next;
    if (isShuffling && queue.length > 1) {
      next = pickShuffledIndex(queue.length, queueIndex);
    } else {
      next = queueIndex + 1;
      if (next >= queue.length) {
        if (repeatMode === 'all') next = 0;
        else return;
      }
    }
    const song = queue[next];
    setQueueIndex(next);
    setCurrentSong(song);
    recordPlay(song.id);
  }, [currentSong, queue, queueIndex, isShuffling, repeatMode, pickShuffledIndex, recordPlay]);

  const playPrevious = useCallback(() => {
    if (!currentSong || queue.length === 0) return;
    let prev;
    if (isShuffling && queue.length > 1) {
      prev = pickShuffledIndex(queue.length, queueIndex);
    } else {
      prev = queueIndex - 1;
      if (prev < 0) prev = queue.length - 1;
    }
    const song = queue[prev];
    setQueueIndex(prev);
    setCurrentSong(song);
    recordPlay(song.id);
  }, [currentSong, queue, queueIndex, isShuffling, pickShuffledIndex, recordPlay]);

  const toggleShuffle = useCallback(() => {
    setIsShuffling(prev => {
      showToast(prev ? 'Embaralhar desativado' : 'Embaralhar ativado');
      return !prev;
    });
  }, [showToast]);

  const cycleRepeat = useCallback(() => {
    setRepeatMode(mode => {
      const next = mode === 'off' ? 'all' : mode === 'all' ? 'one' : 'off';
      const label = next === 'all' ? 'Repetir fila' : next === 'one' ? 'Repetir música' : 'Repetir desativado';
      showToast(label);
      return next;
    });
  }, [showToast]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const toggleFavorite = useCallback((song) => {
    setFavorites(prev => {
      if (prev.includes(song.id)) {
        showToast('Removida das favoritas');
        return prev.filter(id => id !== song.id);
      }
      showToast(`Favorita: ${song.title}`);
      return [...prev, song.id];
    });
  }, [showToast]);

  const isFavorite = useCallback((songId) => favorites.includes(songId), [favorites]);

  const openContextMenu = useCallback((event, song) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({ x: event.clientX, y: event.clientY, song });
  }, []);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const favoriteSongs = useCallback(
    () => favorites.map(id => songs.find(s => s.id === id)).filter(Boolean),
    [favorites, songs]
  );

  const mostPlayedSongs = useCallback(
    () => songs.filter(s => plays[s.id]).sort((a, b) => (plays[b.id] || 0) - (plays[a.id] || 0)),
    [songs, plays]
  );

  const recentSongs = useCallback(
    () => recents.map(id => songs.find(s => s.id === id)).filter(Boolean),
    [recents, songs]
  );

  const value = {
    songs,
    currentSong,
    isPlaying,
    setIsPlaying,
    queue,
    queueIndex,
    isShuffling,
    toggleShuffle,
    repeatMode,
    cycleRepeat,
    playSong,
    playFromQueue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    playNext,
    playPrevious,
    theme,
    toggleTheme,
    toast,
    showToast,
    dismissToast,
    searchQuery,
    setSearchQuery,
    selectedArtist,
    setSelectedArtist,
    sidebarCollapsed,
    setSidebarCollapsed,
    favorites,
    toggleFavorite,
    isFavorite,
    contextMenu,
    openContextMenu,
    closeContextMenu,
    commandOpen,
    setCommandOpen,
    registerPlayControls,
    globalTogglePlay,
    favoriteSongs,
    mostPlayedSongs,
    recentSongs,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};
