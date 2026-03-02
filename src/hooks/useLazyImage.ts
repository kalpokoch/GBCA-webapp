import { useEffect, useState } from "react";
import { useImageLoading } from "@/contexts/ImageLoadingContext";

interface UseLazyImageProps {
  src: string;
  blurSrc?: string;
}

interface UseLazyImageReturn {
  backgroundImage: string;
  isLoaded: boolean;
}

/**
 * Hook for lazy loading background images with blur-up effect
 * Shows a low-quality blurred placeholder while the full image loads
 */
export const useLazyImage = ({ src, blurSrc }: UseLazyImageProps): UseLazyImageReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [displaySrc, setDisplaySrc] = useState(src); // Start with the actual image
  const { setHeroImageLoaded } = useImageLoading();

  useEffect(() => {
    // If no blur placeholder, just load the image directly
    if (!blurSrc) {
      const img = new Image();
      img.onload = () => {
        setIsLoaded(true);
        setHeroImageLoaded(true); // Notify app that hero image is loaded
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        setIsLoaded(true); // Still mark as loaded to remove blur
        setHeroImageLoaded(true); // Still notify to hide loader
      };
      img.src = src;
    } else {
      // Use blur-up technique with placeholder
      setDisplaySrc(blurSrc);
      
      const img = new Image();
      img.onload = () => {
        setDisplaySrc(src);
        setIsLoaded(true);
        setHeroImageLoaded(true); // Notify app that hero image is loaded
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        setIsLoaded(true);
        setHeroImageLoaded(true); // Still notify to hide loader
      };
      img.src = src;
    }
  }, [src, blurSrc, setHeroImageLoaded]);

  return {
    backgroundImage: `url(${displaySrc})`,
    isLoaded,
  };
};
