import React from 'react';
import './SongList.css';

const SongList = ({ songs, onPlay }) => {
  return (
    <div className="song-list-container">
      <div className="song-grid">
        {songs.map((song) => (
          <div key={song.id} className="song-card" onClick={() => onPlay(song)}>
            <div className="song-cover-container">
              {song.coverUrl ? (
                <img src={song.coverUrl} alt={song.title} className="song-cover" />
              ) : (
                <div className="song-cover-placeholder">🎵</div>
              )}
              <button className="play-button-overlay">
                ▶
              </button>
            </div>
            <div className="song-info">
              <h3 className="song-title truncate">{song.title}</h3>
              <p className="song-artist truncate text-subdued">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList;
