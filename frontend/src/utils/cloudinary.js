/**
 * Cloudinary URL transformation utilities
 */

/**
 * Generate a Low Quality Image Placeholder (LQIP) URL
 * @param {string} imageUrl - Original Cloudinary image URL
 * @returns {string} - Blurred, low-quality placeholder URL
 */
export const getCloudinaryLQIP = (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }
  
  // Insert blur and low quality transformations
  // e_blur:1000,q_1,w_100 = extremely blurred, 1% quality, 100px width
  return imageUrl.replace('/upload/', '/upload/e_blur:1000,q_1,w_100/');
};

/**
 * Add auto-format and auto-quality to Cloudinary URL
 * @param {string} imageUrl - Original Cloudinary image URL
 * @returns {string} - Optimized URL with f_auto,q_auto
 */
export const getOptimizedCloudinaryURL = (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }
  
  // Add auto-format and auto-quality transformations
  // f_auto = automatically deliver best format (WebP, AVIF, etc.)
  // q_auto = automatically optimize quality
  return imageUrl.replace('/upload/', '/upload/f_auto,q_auto/');
};

/**
 * Get both LQIP and optimized URL for progressive image loading
 * @param {string} imageUrl - Original Cloudinary image URL
 * @returns {{lqip: string, optimized: string}}
 */
export const getProgressiveImageURLs = (imageUrl) => {
  return {
    lqip: getCloudinaryLQIP(imageUrl),
    optimized: getOptimizedCloudinaryURL(imageUrl)
  };
};
