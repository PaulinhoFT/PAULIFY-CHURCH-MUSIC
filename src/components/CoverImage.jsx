import { useState } from 'react';
import './CoverImage.css';

const CoverImage = ({ src, alt = '', className = '', fallbackText = '🎵' }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`cover-image-wrap ${className} ${loaded ? 'is-loaded' : ''}`}>
      {!loaded && !error && <div className="cover-skeleton shimmer" />}
      {error ? (
        <div className="cover-fallback">{fallbackText}</div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="cover-image"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
};

export default CoverImage;
