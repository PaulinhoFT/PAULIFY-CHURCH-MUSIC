import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ListPlus, Heart, Mic } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { artistRoute } from './ArtistCard';
import './ContextMenu.css';

const ContextMenu = () => {
  const navigate = useNavigate();
  const { contextMenu, closeContextMenu, songs, playSong, addToQueue, toggleFavorite, isFavorite } = usePlayer();
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (!contextMenu) return;
    const { x, y } = contextMenu;
    const menuWidth = 220;
    const menuHeight = 176;
    setStyle({
      left: Math.min(x, window.innerWidth - menuWidth - 8),
      top: Math.min(y, window.innerHeight - menuHeight - 8),
    });
  }, [contextMenu]);

  useEffect(() => {
    if (!contextMenu) return;
    const close = () => closeContextMenu();
    window.addEventListener('click', close);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [contextMenu, closeContextMenu]);

  if (!contextMenu) return null;
  const { song } = contextMenu;

  const doAction = (fn) => {
    fn();
    closeContextMenu();
  };

  return (
    <div className="context-menu" style={style} onClick={(e) => e.stopPropagation()}>
      <button className="context-item" onClick={() => doAction(() => playSong(song, songs))}>
        <Play size={16} /> Tocar agora
      </button>
      <button className="context-item" onClick={() => doAction(() => addToQueue(song))}>
        <ListPlus size={16} /> Adicionar à fila
      </button>
      <button className="context-item" onClick={() => doAction(() => toggleFavorite(song))}>
        <Heart size={16} fill={isFavorite(song.id) ? 'currentColor' : 'none'} />
        {isFavorite(song.id) ? 'Remover das favoritas' : 'Favoritar'}
      </button>
      <div className="context-divider" />
      <button className="context-item" onClick={() => doAction(() => navigate(artistRoute(song.artist)))}>
        <Mic size={16} /> Ir ao cantor
      </button>
    </div>
  );
};

export default ContextMenu;
