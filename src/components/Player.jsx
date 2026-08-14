import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, ChevronDown } from 'lucide-react';
import './Player.css';

const Player = ({ currentSong, onNext, onPrev, currentView }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
      setIsPlaying(true);
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    setProgress(audioRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const handleVolumeChange = (e) => {
    setVolume(Number(e.target.value));
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <>
      {currentSong && <audio 
        ref={audioRef} 
        src={currentSong.audioUrl} 
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onNext}
      />}
      
      <div 
        className={`player-wrapper ${isExpanded ? 'expanded' : 'floating'}`}
        style={{ display: currentView === 'home' ? 'none' : 'block' }}
      >
        
        {/* COMPACT FLOATING VIEW */}
        {!isExpanded && (
          <div className="player-container-compact">
            <div className="player-left">
              {currentSong ? (
                <>
                  <img src={currentSong.coverUrl} alt="cover" className="player-cover" onClick={() => setIsExpanded(true)} />
                  <div className="player-info" onClick={() => setIsExpanded(true)}>
                    <h4 className="truncate">{currentSong.title}</h4>
                    <p className="text-subdued truncate">{currentSong.artist}</p>
                  </div>
                </>
              ) : (
                <div className="player-info">
                  <h4 className="text-subdued">Selecione uma música</h4>
                </div>
              )}
            </div>
            
            <div className="player-center">
              <div className="player-controls">
                <button className="control-btn" disabled={!currentSong} onClick={onPrev}>
                  <SkipBack size={24} />
                </button>
                <button className="play-pause-btn" onClick={togglePlay} disabled={!currentSong}>
                  {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
                </button>
                <button className="control-btn" disabled={!currentSong} onClick={onNext}>
                  <SkipForward size={24} />
                </button>
              </div>
              <div className="player-progress-container">
                <span className="time-text">{formatTime(progress)}</span>
                <input 
                  type="range" 
                  className="progress-bar"
                  min={0}
                  max={duration || 100}
                  value={progress}
                  onChange={handleSeek}
                  disabled={!currentSong}
                />
                <span className="time-text">{formatTime(duration)}</span>
              </div>
            </div>
            
            <div className="player-right">
              <div className="volume-control">
                <Volume2 size={20} className="icon" color="var(--text-secondary)" />
                <input 
                  type="range" 
                  className="volume-slider"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
              {currentSong && (
                <button className="expand-btn" onClick={() => setIsExpanded(true)}>
                  <Maximize2 size={20} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* FULL SCREEN EXPANDED VIEW */}
        {isExpanded && currentSong && (
          <div className="player-container-expanded">
            <button className="minimize-btn" onClick={() => setIsExpanded(false)}>
              <ChevronDown size={32} />
            </button>
            
            <div className="expanded-content">
              <img src={currentSong.coverUrl} alt="cover" className="expanded-cover" />
              
              <div className="expanded-info">
                <h2>{currentSong.title}</h2>
                <p>{currentSong.artist}</p>
              </div>

              <div className="expanded-progress-container">
                <span className="time-text">{formatTime(progress)}</span>
                <input 
                  type="range" 
                  className="progress-bar expanded-progress"
                  min={0}
                  max={duration || 100}
                  value={progress}
                  onChange={handleSeek}
                />
                <span className="time-text">{formatTime(duration)}</span>
              </div>

              <div className="expanded-controls">
                <button className="control-btn" onClick={onPrev}>
                  <SkipBack size={36} />
                </button>
                <button className="play-pause-btn expanded-play" onClick={togglePlay}>
                  {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" />}
                </button>
                <button className="control-btn" onClick={onNext}>
                  <SkipForward size={36} />
                </button>
              </div>
              
              <div className="expanded-volume-control">
                <Volume2 size={24} className="icon" color="var(--text-secondary)" />
                <input 
                  type="range" 
                  className="volume-slider"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default Player;
