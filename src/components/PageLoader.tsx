import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PageLoaderProps {
  isLoading: boolean;
  minDuration?: number;
}

export const PageLoader = ({ isLoading, minDuration = 1000 }: PageLoaderProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, minDuration);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isLoading, minDuration]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm"
        >
          <div className="banter-loader">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="banter-loader__box" />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
