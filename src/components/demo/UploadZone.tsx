import React, { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

type Status = "idle" | "loading" | "success" | "error";

interface Props {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  preview?: string | null;
  status?: Status;
  gradcamUrl?: string | null;
  isCancer?: boolean;
}

export const UploadZone: React.FC<Props> = ({ onFileSelect, disabled, preview, status = "idle", gradcamUrl, isCancer }) => {
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
          <span className="text-4xl">🫀</span>
          <p className="text-sm font-medium">Drop CT scan here or click to browse</p>
          <p className="text-xs text-gray-400">PNG · JPG · JPEG · Max 10MB</p>
        </div>
      )}

      {/* Image area — original → gradcam crossfade */}
      {preview && (
        <div className="relative w-full rounded-xl overflow-hidden">
          {/* Original image — always the base layer */}
          <img
            src={preview}
            alt="CT scan preview"
            className="w-full max-h-48 object-contain rounded-xl"
          />

          {/* Scanning animation overlay during inference */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                key="scan-overlay"
                className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Dim tint */}
                <div className="absolute inset-0 bg-black/20 rounded-xl" />

                {/* Scan line */}
                <motion.div
                  className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_4px_rgba(34,211,238,0.6)]"
                  initial={{ top: "0%" }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                />

                {/* Corner brackets */}
                <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-cyan-400 rounded-tl" />
                <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-cyan-400 rounded-tr" />
                <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-cyan-400 rounded-bl" />
                <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-cyan-400 rounded-br" />
              </motion.div>
            )}
          </AnimatePresence>

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
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>

          {/* Click-to-change overlay (only when not loading) */}
          {!isLoading && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40 rounded-xl">
              <span className="text-white font-semibold text-sm">Click to change image</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
