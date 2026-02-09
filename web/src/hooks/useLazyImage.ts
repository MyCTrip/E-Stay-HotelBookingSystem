import { useEffect, useRef, useState } from 'react';

export const useLazyImage = (src?: string) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | undefined>();

  useEffect(() => {
    if (!imgRef.current || !src) return;
    const el = imgRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setLoadedSrc(src);
            io.unobserve(el);
          }
        });
      },
      { rootMargin: '100px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return { imgRef, loadedSrc };
};
