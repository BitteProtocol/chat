import { useEffect, useState } from 'react';

interface ImageWithFallbackProps {
  fallbackSrc: string;
  src?: string;
  alt: string;
  className: string;
}

export const ImageWithFallback = ({
  fallbackSrc,
  alt,
  src,
  className,
}: ImageWithFallbackProps) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <img
      alt={alt}
      onError={() => setError(true)}
      src={error ? fallbackSrc : src}
      className={className}
    />
  );
};
