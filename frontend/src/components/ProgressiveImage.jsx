import React, { useState, useEffect } from 'react';
import { getProgressiveImageURLs } from '../utils/cloudinary';

/**
 * Progressive Image Component with LQIP (Low Quality Image Placeholder)
 * Shows a blurred placeholder while the full image loads, then fades in smoothly
 */
const ProgressiveImage = ({ 
  src, 
  alt, 
  className = '',
  priority = false,  // Set to true for hero images
  ...props 
}) => {
  const [currentSrc, setCurrentSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!src) return;
    
    const { lqip, optimized } = getProgressiveImageURLs(src);
    
    // Start with LQIP
    setCurrentSrc(lqip);
    setLoading(true);
    
    // Load full image in background
    const img = new Image();
    img.src = optimized;
    
    img.onload = () => {
      // Fade to full image
      setCurrentSrc(optimized);
      setLoading(false);
    };
    
    img.onerror = () => {
      // Fallback to original src if optimization fails
      setCurrentSrc(src);
      setLoading(false);
    };
  }, [src]);
  
  if (!currentSrc) {
    return <div className={className} style={{ backgroundColor: '#f5f1ed' }} />;
  }
  
  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`${className} transition-opacity duration-300 ${loading ? 'opacity-100' : 'opacity-100'}`}
      style={{
        filter: loading ? 'blur(10px)' : 'none',
        transition: 'filter 0.3s ease-out'
      }}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      {...props}
    />
  );
};

export default ProgressiveImage;
