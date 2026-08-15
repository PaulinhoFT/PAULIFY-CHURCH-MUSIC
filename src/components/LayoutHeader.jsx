import { useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Search, X } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const TITLES = {
  '/': { title: 'Bem vindo ao Paulify - Church Music !', subtitle: 'Os melhores louvores para abençoar o seu dia.' },
  '/biblioteca': { title: 'Sua Playlist', subtitle: null },
  '/favoritas': { title: 'Minhas Favoritas', subtitle: null },
};

const LayoutHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, theme, toggleTheme } = usePlayer();

  const meta = TITLES[location.pathname];

  if (!meta) return null;

  return (
    <header className="main-header">
      <div style={{ minWidth: 0 }}>
        <h1 className="page-title">{meta.title}</h1>
        <p className="text-subdued" style={{ margin: 0 }}>
          {meta.subtitle}
        </p>
      </div>
      <div className="header-actions">
        <button className="icon-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar música ou cantor..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (location.pathname !== '/biblioteca') navigate('/biblioteca');
            }}
            className="search-input"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')} title="Limpar busca">
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default LayoutHeader;
