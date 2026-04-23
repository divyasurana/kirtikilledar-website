import React from 'react';

/**
 * Extract YouTube video ID from any common YouTube URL shape.
 * Handles youtube.com/watch?v=, youtu.be/, youtube.com/embed/, shorts/, etc.
 */
const getYouTubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    /(?:youtube\.com\/v\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
};

const isDirectVideoFile = (url) =>
  /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url || '');

/**
 * ProjectMediaPlayer — renders a media player appropriate to the saved type/url.
 *   - Video + YouTube URL   → responsive 16:9 YouTube iframe
 *   - Video + direct file   → HTML5 <video controls>
 *   - Audio                 → HTML5 <audio controls>
 *   - Otherwise             → renders nothing
 */
const ProjectMediaPlayer = ({ mediaType, mediaUrl, title = '' }) => {
  if (!mediaType || !mediaUrl) return null;

  const type = String(mediaType).toLowerCase();

  // YouTube URLs render as an embed regardless of whether the field was
  // tagged as video or audio — many artists save YouTube links under both.
  const ytId = getYouTubeId(mediaUrl);
  if (ytId) {
    return (
      <div
        data-testid="project-youtube-embed"
        className="w-full mx-auto"
        style={{ maxWidth: '800px' }}
      >
        <div
          style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            width: '100%',
            minHeight: '200px',
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title={title || 'YouTube video'}
            loading="lazy"
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
    );
  }

  if (type === 'video') {
    if (isDirectVideoFile(mediaUrl) || mediaUrl.includes('res.cloudinary.com')) {
      return (
        <video
          data-testid="project-html5-video"
          src={mediaUrl}
          controls
          preload="metadata"
          className="w-full mx-auto bg-black"
          style={{ maxWidth: '800px', maxHeight: '500px' }}
        />
      );
    }
    return null;
  }

  if (type === 'audio') {
    return (
      <audio
        data-testid="project-html5-audio"
        src={mediaUrl}
        controls
        preload="metadata"
        className="w-full mx-auto"
        style={{ maxWidth: '800px' }}
      />
    );
  }

  return null;
};

export default ProjectMediaPlayer;
export { getYouTubeId };
