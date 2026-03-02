import { createContext, useContext, useState, ReactNode } from "react";

interface ImageLoadingContextType {
  isHeroImageLoaded: boolean;
  setHeroImageLoaded: (loaded: boolean) => void;
}

const ImageLoadingContext = createContext<ImageLoadingContextType | undefined>(undefined);

export const ImageLoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isHeroImageLoaded, setHeroImageLoaded] = useState(false);

  return (
    <ImageLoadingContext.Provider value={{ isHeroImageLoaded, setHeroImageLoaded }}>
      {children}
    </ImageLoadingContext.Provider>
  );
};

export const useImageLoading = () => {
  const context = useContext(ImageLoadingContext);
  if (!context) {
    throw new Error("useImageLoading must be used within ImageLoadingProvider");
  }
  return context;
};
