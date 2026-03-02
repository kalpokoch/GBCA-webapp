import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MdDownload } from "react-icons/md";
import { Button } from "@/components/ui/button";

interface FullscreenImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  title?: string;
  isCancer?: boolean;
  confidence?: number;
}

export const FullscreenImageDialog: React.FC<FullscreenImageDialogProps> = ({
  open,
  onOpenChange,
  imageUrl,
  title = "GradCAM Visualization",
  isCancer = false,
  confidence,
}) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `gradcam-${isCancer ? "cancer" : "normal"}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b bg-white">
          <div className="space-y-3">
            <DialogTitle className="font-display text-xl sm:text-2xl">
              {title}
            </DialogTitle>
            {confidence !== undefined && (
              <p className="font-body text-sm text-gray-500">
                {isCancer ? "🔴 Cancer" : "🟢 Normal"} · {confidence.toFixed(2)}% confidence
              </p>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2 w-full sm:w-auto"
            >
              <MdDownload size={16} />
              Download
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center p-6">
          <img
            src={imageUrl}
            alt="GradCAM Heatmap"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
