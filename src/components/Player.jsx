import React, { useRef, useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, ChevronDown,
  ListMusic, Shuffle, Repeat, Repeat1, X, Music
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import './Player.css';

const Player = () => {
  const {
    currentSong, isPlaying, setIsPlaying, playNext, playPrevious,
    queue, queueIndex, playFromQueue, removeFromQueue, clearQueue,
    isShuffling, toggleShuffle, repeatMode, cycleRepeat, registerPlayControls,
  } = usePlayer();

  const audioRef = useRef(null);
  const [ytPlayer, setYtPlayer] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const playNextRef = useRef(playNext);
  const playPrevRef = useRef(playPrevious);
  playNextRef.current = playNext;
  playPrevRef.current = playPrevious;

  // Clear stale YouTube player reference when unmounting or switching to local audio
  useEffect(() => {
    if (!currentSong?.youtubeId) {
      setYtPlayer(null);
    }
  }, [currentSong?.youtubeId]);

  // Handle standard audio tag playback
  useEffect(() => {
    if (currentSong && !currentSong.youtubeId && audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    if (currentSong && currentSong.youtubeId && ytPlayer) {
      try {
        // Prevent calling methods on a destroyed iframe instance
        if (typeof ytPlayer.playVideo === 'function') {
          ytPlayer.playVideo();
        }
        setIsPlaying(true);
      } catch (e) {
        console.warn('Skipping playVideo on stale YT player instance');
      }
    }
  }, [currentSong, setIsPlaying, ytPlayer]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (ytPlayer) {
      try {
        if (typeof ytPlayer.setVolume === 'function') ytPlayer.setVolume(volume * 100);
      } catch (e) {}
    }
  }, [volume, ytPlayer]);

  // MediaSession API
  useEffect(() => {
    if (!currentSong || !('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title,
      artist: currentSong.artist,
      artwork: [{ src: currentSong.coverUrl, sizes: '512x512' }],
    });
    const actions = {
      play: () => togglePlay(),
      pause: () => togglePlay(),
      previoustrack: () => playPrevRef.current(),
      nexttrack: () => playNextRef.current(),
      seekto: (details) => {
        if (details.seekTime) handleSeek({ target: { value: details.seekTime } });
      },
    };
    Object.entries(actions).forEach(([action, handler]) => {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* unsupported */ }
    });
  }, [currentSong, ytPlayer]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
      try {
        if (currentSong.youtubeId && ytPlayer && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
        else if (audioRef.current) audioRef.current.pause();
      } catch(e) {}
      setIsPlaying(false);
    } else {
      try {
        if (currentSong.youtubeId && ytPlayer && typeof ytPlayer.playVideo === 'function') ytPlayer.playVideo();
        else if (audioRef.current) audioRef.current.play();
      } catch(e) {}
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    registerPlayControls(togglePlay);
  });

  const handleEnded = () => {
    if (repeatMode === 'one') {
      try {
        if (currentSong.youtubeId && ytPlayer) {
          if (typeof ytPlayer.seekTo === 'function') ytPlayer.seekTo(0);
          if (typeof ytPlayer.playVideo === 'function') ytPlayer.playVideo();
        } else if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      } catch(e) {}
      setIsPlaying(true);
    } else {
      playNext();
    }
  };

  // YouTube API Callbacks
  const onYtReady = (event) => {
    try {
      setYtPlayer(event.target);
      event.target.setVolume(volume * 100);
      if (isPlaying) event.target.playVideo();
    } catch (e) {
      console.error('YT Ready Error:', e);
    }
  };

  const onYtStateChange = async (event) => {
    try {
      if (event.data === YouTube.PlayerState.PLAYING) {
        setIsPlaying(true);
        if (event.target && typeof event.target.getDuration === 'function') {
          const dur = await event.target.getDuration();
          if (dur) setDuration(dur);
        }
      } else if (event.data === YouTube.PlayerState.PAUSED) {
        setIsPlaying(false);
      } else if (event.data === YouTube.PlayerState.ENDED) {
        handleEnded();
      }
    } catch (e) {
      console.error('YT State Change Error:', e);
    }
  };

  // YouTube Progress Polling
  useEffect(() => {
    let interval;
    if (isPlaying && currentSong?.youtubeId && ytPlayer) {
      interval = setInterval(async () => {
        try {
          if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
            const time = await ytPlayer.getCurrentTime();
            if (time) setProgress(time);
            const dur = await ytPlayer.getDuration();
            if (dur && dur !== duration) setDuration(dur);
          }
        } catch (e) {
          // Ignore polling errors on destroyed instances
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong, ytPlayer, duration]);

  const onTimeUpdate = () => {
    if (!currentSong?.youtubeId && audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };
  
  const onLoadedMetadata = () => {
    if (!currentSong?.youtubeId && audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    try {
      if (currentSong.youtubeId && ytPlayer && typeof ytPlayer.seekTo === 'function') {
        ytPlayer.seekTo(time);
      } else if (audioRef.current) {
        audioRef.current.currentTime = time;
      }
    } catch(e) {}
    setProgress(time);
  };

  const handleVolumeChange = (e) => setVolume(Number(e.target.value));

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <>
      {/* Invisible YouTube Player */}
      {currentSong?.youtubeId && (
        <div style={{ position: 'absolute', width: '0px', height: '0px', overflow: 'hidden', opacity: 0 }}>
          <YouTube 
            videoId={currentSong.youtubeId} 
            opts={{ playerVars: { autoplay: 1, controls: 0 } }} 
            onReady={onYtReady}
            onStateChange={onYtStateChange}
          />
        </div>
      )}

      {/* Fallback Local Audio Player */}
      {currentSong && !currentSong.youtubeId && (
        <audio
          ref={audioRef}
          src={currentSong.audioUrl}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={handleEnded}
        />
      )}

      <div className={`player-wrapper ${isExpanded ? 'expanded' : 'floating'}`}>
        {isQueueOpen && (
          <div className="queue-panel">
            <div className="queue-header">
              <h3>
                <ListMusic size={18} /> Fila de reprodução
              </h3>
              {queue.length > 0 && (
                <button className="queue-clear" onClick={clearQueue}>Limpar</button>
              )}
            </div>
            <div className="queue-list">
              {queue.length === 0 ? (
                <p className="queue-empty">
                  <Music size={24} style={{ marginBottom: 8 }} /><br />
                  A fila está vazia
                </p>
              ) : (
                queue.map((song, idx) => (
                  <div
                    key={`${song.id}-${idx}`}
                    className={`queue-item ${idx === queueIndex ? 'active' : ''}`}
                    onClick={() => playFromQueue(idx)}
                  >
                    <img src={song.coverUrl} alt="" className="queue-cover" />
                    <div className="queue-info">
                      <h4 className="truncate">{song.title}</h4>
                      <p className="text-subdued truncate">{song.artist}</p>
                    </div>
                    {idx === queueIndex && isPlaying && (
                      <div className="equalizer queue-eq"><span></span><span></span><span></span></div>
                    )}
                    <button
                      className="queue-remove"
                      onClick={(e) => { e.stopPropagation(); removeFromQueue(idx); }}
                      title="Remover da fila"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {!isExpanded && (
          <div className="player-container-compact">
            <div className="player-left">
              {currentSong ? (
                <>
                  <div className="player-cover-wrap">
                    <img src={currentSong.coverUrl} alt="cover" className="player-cover" onClick={() => setIsExpanded(true)} />
                    {isPlaying && (
                      <div className="equalizer cover-eq"><span></span><span></span><span></span></div>
                    )}
                  </div>
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
                <button
                  className={`control-btn ${isShuffling ? 'active' : ''}`}
                  disabled={!currentSong}
                  onClick={toggleShuffle}
                  title="Embaralhar"
                >
                  <Shuffle size={18} />
                </button>
                <button className="control-btn" disabled={!currentSong} onClick={playPrevious}>
                  <SkipBack size={24} />
                </button>
                <button className="play-pause-btn" onClick={togglePlay} disabled={!currentSong}>
                  {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
                </button>
                <button className="control-btn" disabled={!currentSong} onClick={playNext}>
                  <SkipForward size={24} />
                </button>
                <button
                  className={`control-btn ${repeatMode !== 'off' ? 'active' : ''}`}
                  disabled={!currentSong}
                  onClick={cycleRepeat}
                  title="Repetir"
                >
                  {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
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
              <button
                className={`control-btn queue-toggle ${isQueueOpen ? 'active' : ''}`}
                onClick={() => setIsQueueOpen(open => !open)}
                title="Fila de reprodução"
              >
                <ListMusic size={20} />
              </button>
              {currentSong && (
                <button className="expand-btn" onClick={() => setIsExpanded(true)} title="Tela cheia">
                  <Maximize2 size={20} />
                </button>
              )}
            </div>
          </div>
        )}

        {isExpanded && currentSong && (
          <div className="player-container-expanded">
            {currentSong && <img src={currentSong.coverUrl} alt="" className="expanded-ambience" />}
            <button className="minimize-btn" onClick={() => setIsExpanded(false)} title="Minimizar">
              <ChevronDown size={32} />
            </button>
            <button
              className={`control-btn expanded-queue-btn ${isQueueOpen ? 'active' : ''}`}
              onClick={() => setIsQueueOpen(open => !open)}
              title="Fila de reprodução"
            >
              <ListMusic size={24} />
            </button>

            <div className="expanded-content">
              <div className="expanded-cover-wrap">
                <img src={currentSong.coverUrl} alt="cover" className="expanded-cover" />
                {isPlaying && (
                  <div className="equalizer expanded-eq"><span></span><span></span><span></span></div>
                )}
              </div>

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
                <button className={`control-btn ${isShuffling ? 'active' : ''}`} onClick={toggleShuffle} title="Embaralhar">
                  <Shuffle size={26} />
                </button>
                <button className="control-btn" onClick={playPrevious}>
                  <SkipBack size={36} />
                </button>
                <button className="play-pause-btn expanded-play" onClick={togglePlay}>
                  {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" />}
                </button>
                <button className="control-btn" onClick={playNext}>
                  <SkipForward size={36} />
                </button>
                <button className={`control-btn ${repeatMode !== 'off' ? 'active' : ''}`} onClick={cycleRepeat} title="Repetir">
                  {repeatMode === 'one' ? <Repeat1 size={26} /> : <Repeat size={26} />}
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
