import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const AudioPlayer = ({ url, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-vintage-paper border border-vintage-gold/30 p-6">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center bg-warm-brown text-vintage-cream hover:bg-burnt-sienna transition-colors duration-300 group"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <Play size={20} strokeWidth={1.5} className="ml-0.5 group-hover:scale-110 transition-transform duration-300" />
          )}
        </button>
        
        <div className="flex-1">
          <p className="text-sm text-sepia-dark font-light mb-2">{title}</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-sepia-dark/60 font-light w-10">{formatTime(currentTime)}</span>
            
            <div className="flex-1 relative">
              <div className="h-1 bg-warm-brown/20 relative overflow-hidden">
                <div 
                  className="h-full bg-vintage-gold transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                aria-label="Seek"
              />
            </div>
            
            <span className="text-xs text-sepia-dark/60 font-light w-10">{formatTime(duration)}</span>
          </div>
        </div>
        
        <button
          onClick={toggleMute}
          className="text-warm-brown hover:text-vintage-gold transition-colors duration-300"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX size={20} strokeWidth={1.5} />
          ) : (
            <Volume2 size={20} strokeWidth={1.5} />
          )}
        </button>
      </div>
      
      <div className="text-xs text-sepia-dark/50 italic font-light">
        Click play to listen to this performance
      </div>
    </div>
  );
};

export default AudioPlayer;
