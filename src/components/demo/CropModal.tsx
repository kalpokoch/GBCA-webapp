import React, { useState, useCallback, useEffect } from "react";
import Cropper, { type Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

// Minimum size required by the DenseNet121 backend
const MIN_MODEL_SIZE = 350;

// ─── Canvas crop + resize helper ─────────────────────────────────────────────

async function getCroppedFile(imageSrc: string, pixelCrop: Area, originalName: string): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = imageSrc;
  });

  // Step 1: draw the exact crop region
  const cropCanvas = document.createElement("canvas");
  cropCanvas.width  = pixelCrop.width;
  cropCanvas.height = pixelCrop.height;
  const cropCtx = cropCanvas.getContext("2d")!;
  cropCtx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  // Step 2: scale up to at least MIN_MODEL_SIZE × MIN_MODEL_SIZE
  const outSize = Math.max(pixelCrop.width, pixelCrop.height, MIN_MODEL_SIZE);
  const outCanvas = document.createElement("canvas");
  outCanvas.width  = outSize;
  outCanvas.height = outSize;
  const outCtx = outCanvas.getContext("2d")!;
  outCtx.imageSmoothingEnabled = true;
  outCtx.imageSmoothingQuality = "high";
  outCtx.drawImage(cropCanvas, 0, 0, outSize, outSize);

  return new Promise<File>((resolve, reject) => {
    outCanvas.toBlob((blob) => {
      if (!blob) { reject(new Error("Canvas toBlob failed")); return; }
      resolve(new File([blob], originalName, { type: "image/png" }));
    }, "image/png");
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CropModalProps {
  open: boolean;
  imageSrc: string;
  originalName: string;
  onConfirm: (file: File) => void;
  onCancel: () => void;
}

export const CropModal: React.FC<CropModalProps> = ({
  open,
  imageSrc,
  originalName,
  onConfirm,
  onCancel,
}) => {
  const [crop, setCrop]                             = useState({ x: 0, y: 0 });
  const [zoom, setZoom]                             = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels]   = useState<Area | null>(null);

  // Reset state whenever a new image is loaded
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  }, [imageSrc]);

  const willUpscale = croppedAreaPixels
    ? croppedAreaPixels.width < MIN_MODEL_SIZE || croppedAreaPixels.height < MIN_MODEL_SIZE
    : false;

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!croppedAreaPixels) return;
    const file = await getCroppedFile(imageSrc, croppedAreaPixels, originalName);
    onConfirm(file);
  }, [croppedAreaPixels, imageSrc, originalName, onConfirm]);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel(); }}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Crop CT Scan</DialogTitle>
        </DialogHeader>

        {/* Cropper canvas — only mount when we have a real image src */}
        <div className="relative w-full h-[420px] bg-black">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid={true}
              style={{
                containerStyle: { borderRadius: 0 },
                cropAreaStyle:  { border: "2px solid #22d3ee" },
              }}
            />
          )}
        </div>

        {/* Zoom slider + size info */}
        <div className="px-6 py-4 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Zoom</Label>
              <span className="text-xs text-muted-foreground">{zoom.toFixed(1)}×</span>
            </div>
            <Slider
              min={1}
              max={3}
              step={0.05}
              value={[zoom]}
              onValueChange={([v]) => setZoom(v)}
            />
          </div>

          {/* Upscale warning */}
          {/* {willUpscale && croppedAreaPixels && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              ⚠️ Crop region is {Math.round(croppedAreaPixels.width)}×{Math.round(croppedAreaPixels.height)}px
               — will be upscaled to {MIN_MODEL_SIZE}×{MIN_MODEL_SIZE}px for the model.
              Zoom in for a larger selection.
            </p>
          )} */}
        </div>

        <DialogFooter className="px-6 pb-6 gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!croppedAreaPixels}>
            Use Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
