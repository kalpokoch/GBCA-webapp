import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { PageLoader } from "@/components/PageLoader";
import { ImageLoadingProvider, useImageLoading } from "@/contexts/ImageLoadingContext";
import Index from "./pages/Index";
import {Demo} from "./pages/Demo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const { isHeroImageLoaded } = useImageLoading();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isOnHomePage = location.pathname === "/";

  useEffect(() => {
    // Handle initial page load
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    // Handle route changes
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, isInitialLoad]);

  // Show loader on initial load until hero image is loaded (only on homepage)
  const showLoader = isInitialLoad && (!isHeroImageLoaded && isOnHomePage) || isLoading;

  return (
    <>
      <PageLoader isLoading={showLoader} />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ImageLoadingProvider>
          <AppContent />
        </ImageLoadingProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
