import React, { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MdCloudUpload, MdZoomIn } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { ScanningAnimation } from "@/components/ui/scanning-animation";

type Status = "idle" | "loading" | "success" | "error";

interface Props {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  preview?: string | null;
  status?: Status;
  gradcamUrl?: string | null;
  isCancer?: boolean;
  onFullscreenClick?: () => void;
}

export const UploadZone: React.FC<Props> = ({ 
  onFileSelect, 
  disabled, 
  preview, 
  status = "idle", 
  gradcamUrl, 
  isCancer,
  onFullscreenClick 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isLoading = status === "loading";
  const showGradcam = status === "success" && !!gradcamUrl && isCancer === true;

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File must be under 10MB");
      return;
    }
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      className={`
        relative w-full rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
        ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${preview ? "p-2" : "p-5"}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        disabled={disabled}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {/* Empty state */}
      {!preview && (
        <div className="flex flex-col items-center gap-2 text-gray-500 select-none">
          <MdCloudUpload size={32} className="text-blue-500" />
          <p className="font-body text-sm font-medium">Drop CT scan here or click to browse</p>
          <p className="font-body text-xs text-gray-400">PNG · JPG · JPEG · Max 10MB</p>
        </div>
      )}

      {/* Image area — original → gradcam crossfade */}
      {preview && (
        <div className="relative w-full rounded-xl overflow-hidden">
          {/* Original image — always the base layer */}
          <img
            src={preview}
            alt="CT scan preview"
            className="w-full max-h-80 object-contain rounded-xl"
          />

          {/* Scanning animation overlay during inference */}
          <ScanningAnimation isVisible={isLoading} />

          {/* GradCAM fade-in over original */}
          <AnimatePresence>
            {showGradcam && (
              <motion.img
                key="gradcam"
                src={gradcamUrl!}
                alt="GradCAM heatmap"
                className="absolute inset-0 w-full h-full object-contain rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>

          {/* Fullscreen button - appears when GradCAM is shown */}
          <AnimatePresence>
            {showGradcam && onFullscreenClick && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 1.6, duration: 0.3 }}
                className="absolute top-3 right-3 z-10"
              >
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFullscreenClick();
                  }}
                  className="gap-2 bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm border border-gray-200"
                >
                  <MdZoomIn size={16} />
                  <span className="hidden sm:inline font-body text-xs">Fullscreen</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Heatmap badge - appears on the image */}
          <AnimatePresence>
            {showGradcam && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 1.7, duration: 0.3 }}
                className="absolute bottom-3 left-3 right-3 z-10"
              >
                <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                  <p className="font-body text-xs text-white text-center">
                    <span className="font-semibold">GradCAM++</span> · CBAM attention layer
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Click-to-change overlay (only when not loading and not showing gradcam) */}
          {!isLoading && !showGradcam && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40 rounded-xl">
              <span className="font-body text-white font-semibold text-sm">Click to change image</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
