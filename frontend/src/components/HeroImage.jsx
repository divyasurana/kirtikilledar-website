import React, { useState, useEffect } from 'react';
import { getHeroCloudinaryURL } from '../utils/cloudinary';

const CACHE_KEY = 'hero_image_url_v1';

/**
 * HeroImage — optimised above-the-fold image for the homepage.
 *
 * - Caches the last-known Cloudinary URL in localStorage so returning visitors
 *   see the image instantly while the fresh URL loads in the background.
 * - Serves the image through Cloudinary with f_auto,q_auto,w_1200 transforms.
 * - Uses loading="eager" and fetchpriority="high" so the browser prioritises it.
 * - While no image has rendered yet, shows a solid #1a1a1a background — no
 *   placeholder/default image, no spinner.
 * - Fades the image in over 0.4s once it has fully loaded.
 */
const HeroImage = ({ src, alt = '', className = '', style = {}, ...props }) => {
  // On first render, pre-fill from the localStorage cache if available so we
  // can paint immediately on subsequent visits.
  const [displaySrc, setDisplaySrc] = useState(() => {
    try {
      return localStorage.getItem(CACHE_KEY) || null;
    } catch {
      return null;
    }
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;
    const optimized = getHeroCloudinaryURL(src);

    // Preload the fresh URL in the background. Once ready, swap it in.
    const img = new Image();
    img.src = optimized;
    img.onload = () => {
      setDisplaySrc(optimized);
      try {
        localStorage.setItem(CACHE_KEY, optimized);
      } catch {
        /* ignore quota / privacy-mode errors */
      }
    };
  }, [src]);

  return (
    <div
      data-testid="hero-image-wrapper"
      className={className}
      style={{ backgroundColor: '#1a1a1a', overflow: 'hidden', ...style }}
    >
      {displaySrc && (
        <img
          src={displaySrc}
          alt={alt}
          onLoad={() => setLoaded(true)}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          data-testid="hero-image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease-out',
            display: 'block',
          }}
          {...props}
        />
      )}
    </div>
  );
};

export default HeroImage;
