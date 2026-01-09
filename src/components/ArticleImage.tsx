'use client';

import { useState } from 'react';

interface ArticleImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ArticleImage({ src, alt, className = '' }: ArticleImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error || !src) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img 
        src={src} 
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={(e) => {
          console.warn('Failed to load image:', src);
          setError(true);
        }}
      />
    </div>
  );
}
