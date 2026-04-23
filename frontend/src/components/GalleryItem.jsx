import React, { useEffect, useState, useCallback } from 'react';
import { PlayCircle, X, ExternalLink, Instagram } from 'lucide-react';
import { getYouTubeId } from './ProjectMediaPlayer';

/**
 * Swap Cloudinary video URL to a JPG first-frame thumbnail.
 *   https://res.cloudinary.com/.../upload/folder/file.mp4
 *     →  https://res.cloudinary.com/.../upload/so_0/folder/file.jpg
 */
const cloudinaryVideoPoster = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  const withSo = url.replace('/upload/', '/upload/so_0/');
  return withSo.replace(/\.(mp4|webm|mov|m4v|ogg)(\?|$)/i, '.jpg$2');
};

const isYouTubeUrl = (url) =>
  !!url && /(?:youtube\.com|youtu\.be)/i.test(url);

/**
 * A single gallery item. Owns its own lightbox-open state so items never
 * interfere with each other (fixes the shared-state caption-bleed bug).
 *
 * Three render modes:
 *   - YouTube video   → thumbnail from img.youtube.com + iframe lightbox
 *   - Cloudinary video → so_0 poster frame + HTML5 <video controls> lightbox
 *   - Image           → normal <img> + image lightbox
 */
const GalleryItem = ({ item, onOpen }) => {
  const url = item.image_url || '';
  const ytId = isYouTubeUrl(url) ? getYouTubeId(url) : null;
  const isVideo = item.resource_type === 'video';

  let thumbSrc = url;
  let kind = 'image';
  if (ytId) {
    thumbSrc = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    kind = 'youtube';
  } else if (isVideo) {
    const poster = cloudinaryVideoPoster(url);
    thumbSrc = poster || url;
    kind = 'cloudinary-video';
  }

  return (
    <div
      className="group cursor-pointer"
      style={{ position: 'relative', overflow: 'hidden' }}
      onClick={() => onOpen({ ...item, _kind: kind, _ytId: ytId })}
      data-testid={`gallery-item-${item.id}`}
    >
      <div
        className="relative mb-4"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <div className="absolute inset-0 border border-warm-brown/10 z-10 pointer-events-none group-hover:border-vintage-gold/40 transition-colors duration-300" />

        {kind === 'image' ? (
          <img
            src={thumbSrc}
            alt={item.caption || ''}
            className="w-full h-[380px] object-cover grayscale-[35%] sepia-[18%] transition-all duration-700 group-hover:grayscale-[15%] group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="relative w-full h-[380px] bg-black">
            <img
              src={thumbSrc}
              alt={item.caption || ''}
              className="w-full h-full object-cover grayscale-[30%] sepia-[15%]"
              loading="lazy"
              onError={(e) => {
                // Fallback to default YouTube thumb quality
                if (kind === 'youtube' && ytId) {
                  e.currentTarget.src = `https://img.youtube.com/vi/${ytId}/0.jpg`;
                }
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-warm-brown/20 group-hover:bg-warm-brown/30 transition-colors duration-300 pointer-events-none">
              <PlayCircle
                size={64}
                className="text-vintage-cream opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                strokeWidth={1.5}
              />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-warm-brown/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      <p className="text-sm text-sepia-dark/60 group-hover:text-vintage-gold transition-colors duration-300 font-light text-center">
        {item.caption}
      </p>
    </div>
  );
};

/**
 * Single global lightbox — at most one open at a time. Closes on ESC, outside
 * click. Locks body scroll while open.
 */
const GalleryLightbox = ({ item, onClose }) => {
  useEffect(() => {
    if (!item) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [item, onClose]);

  if (!item) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      data-testid="gallery-lightbox"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: 'rgba(10, 7, 4, 0.92)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflow: 'auto',
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        data-testid="gallery-lightbox-close"
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          color: '#f5f1e8',
          background: 'transparent',
          border: 0,
          cursor: 'pointer',
          zIndex: 2,
        }}
      >
        <X size={32} strokeWidth={1.5} />
      </button>

      {item._kind === 'youtube' && item._ytId && (
        <div
          style={{
            width: '100%',
            maxWidth: 'min(1100px, 95vw)',
            minWidth: 'min(600px, 100%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${item._ytId}?autoplay=1`}
              title={item.caption || 'YouTube video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
            />
          </div>
        </div>
      )}

      {item._kind === 'cloudinary-video' && (
        <video
          src={item.image_url}
          controls
          autoPlay
          playsInline
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '900px',
            maxHeight: '80vh',
            background: '#000',
          }}
          data-testid="gallery-lightbox-video"
        />
      )}

      {item._kind === 'image' && (
        <img
          src={item.image_url}
          alt={item.caption || ''}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '900px',
            width: '100%',
            maxHeight: '80vh',
            objectFit: 'contain',
          }}
        />
      )}

      {(item.caption || item.instagram_url) && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            color: '#f5f1e8',
            textAlign: 'center',
            marginTop: 20,
            fontWeight: 300,
            maxWidth: '900px',
          }}
        >
          {item.caption && <p className="text-lg font-light">{item.caption}</p>}
          {item.instagram_url && (
            <a
              href={item.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 text-sm text-vintage-gold hover:text-vintage-cream"
            >
              <Instagram size={14} />
              View on Instagram
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export { GalleryItem, GalleryLightbox, cloudinaryVideoPoster, isYouTubeUrl };
