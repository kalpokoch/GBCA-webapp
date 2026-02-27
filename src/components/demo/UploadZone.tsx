import React, { useCallback, useState, useRef } from "react";

interface Props {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  preview?: string | null;
}

export const UploadZone: React.FC<Props> = ({ onFileSelect, disabled, preview }) => {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
        ${preview ? "p-2" : "p-10"}
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

      {preview ? (
        <img
          src={preview}
          alt="CT scan preview"
          className="w-full max-h-72 object-contain rounded-xl"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 text-gray-500 select-none">
          <span className="text-5xl">🫀</span>
          <p className="text-base font-medium">Drop CT scan here or click to browse</p>
          <p className="text-sm text-gray-400">PNG · JPG · JPEG · Max 10MB</p>
        </div>
      )}

      {/* Replace label overlay when preview exists */}
      {preview && (
        <div className="absolute inset-0 flex items-center justify-center
          opacity-0 hover:opacity-100 transition-opacity bg-black/40 rounded-2xl">
          <span className="text-white font-semibold text-sm">Click to change image</span>
        </div>
      )}
    </div>
  );
};
