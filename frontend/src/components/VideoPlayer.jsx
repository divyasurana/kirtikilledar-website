import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Play } from 'lucide-react';

const VideoPlayer = ({ url, title, thumbnail }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const handlePlay = () => {
    setShowPlayer(true);
    setIsPlaying(true);
  };

  return (
    <div className="bg-vintage-paper border border-vintage-gold/30 overflow-hidden">
      {!showPlayer ? (
        <div className="relative group cursor-pointer" onClick={handlePlay}>
          <img 
            src={thumbnail}
            alt={title}
            className="w-full h-[320px] object-cover grayscale-[30%] sepia-[15%] group-hover:grayscale-[10%] transition-all duration-500"
          />
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-warm-brown/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-16 h-16 flex items-center justify-center bg-vintage-cream/90 group-hover:bg-vintage-cream transition-colors duration-300">
              <Play size={28} className="text-warm-brown ml-1" strokeWidth={1.5} />
            </div>
          </div>
          
          {/* Corner accents */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-vintage-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-vintage-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ) : (
        <div className="relative pt-[56.25%]">
          <ReactPlayer
            url={url}
            playing={isPlaying}
            controls
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
            config={{
              youtube: {
                playerVars: { 
                  showinfo: 1,
                  modestbranding: 1,
                  rel: 0
                }
              }
            }}
          />
        </div>
      )}
      
      <div className="p-4">
        <p className="text-sm text-sepia-dark font-light mb-1">{title}</p>
        <p className="text-xs text-sepia-dark/50 italic font-light">
          {showPlayer ? 'Video performance reel' : 'Click to watch performance'}
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
