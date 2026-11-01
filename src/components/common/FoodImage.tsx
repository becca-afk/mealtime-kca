import React, { useState } from 'react';

interface FoodImageProps {
  src?: string;
  alt: string;
  emoji: string;
  className?: string;
}

export const FoodImage: React.FC<FoodImageProps> = ({ src, alt, emoji, className = '' }) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`food-image-fallback flex items-center justify-center select-none ${className}`}
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(255, 215, 0, 0.22), rgba(128, 0, 32, 0.28)), #2A0812',
          color: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          borderRadius: 'inherit',
          width: '100%',
          height: '100%',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)',
        }}
        title={alt}
      >
        <span style={{ transform: 'scale(1.2)', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}>
          {emoji}
        </span>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 'inherit' }}>
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(128,0,32,0.15) 0%, rgba(201,152,31,0.15) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
          }}
        >
          <span>{emoji}</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'opacity 0.25s ease-in-out',
          opacity: loaded ? 1 : 0,
        }}
      />
    </div>
  );
};
