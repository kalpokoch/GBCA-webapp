import React, { useState, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import { DemoHeader }                    from "../components/demo/DemoHeader";
import { GradCamOverlay }               from "../components/demo/GradCam";
import { UploadZone }                    from "../components/demo/UploadZone";
import { LoadingState }                  from "../components/demo/LoadingState";
import { ResultCard }                    from "../components/demo/ResultCard";
import { CropModal }                     from "../components/demo/CropModal";
import { FullscreenImageDialog }         from "../components/demo/FullscreenImageDialog";
import { Alert, AlertDescription }       from "@/components/ui/alert";
import CircularGallery                   from "@/components/ui/circular-gallery";
import { MdBarChart } from "react-icons/md";
import { demoData }                      from "@/data/demoData";
import { useInference }                  from "../hooks/useInference";

export const Demo: React.FC = () => {
  // ── Display state ─────────────────────────────────────────────────────────
  const [preview, setPreview]   = useState<string | null>(null);

  // ── Crop modal state (kept separate from display preview) ─────────────────
  // cropSrc is its own object URL — never cleared synchronously with closing
  // the modal, so Radix Dialog can always finish its exit animation cleanly.
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc,  setCropSrc]  = useState<string>("");
  const [cropName, setCropName] = useState<string>("image.png");
  const cropSrcRef = useRef<string>("");   // tracks latest cropSrc for cleanup

  // ── Fullscreen dialog state ───────────────────────────────────────────────
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const { status, result, error, apiOnline, runInference, reset } = useInference();

  // ── Open crop modal with a fresh File ─────────────────────────────────────
  const openCrop = useCallback((file: File) => {
    // Revoke the previous crop URL (not the display preview)
    if (cropSrcRef.current) URL.revokeObjectURL(cropSrcRef.current);
    const url = URL.createObjectURL(file);
    cropSrcRef.current = url;
    setCropSrc(url);
    setCropName(file.name);
    reset();
    setCropOpen(true);
  }, [reset]);

  // Step 1 — file picked from UploadZone
  const handleFilePicked = useCallback((file: File) => {
    openCrop(file);
  }, [openCrop]);

  // Step 2a — crop confirmed: update display preview, run inference
  const handleCropConfirm = useCallback((croppedFile: File) => {
    setCropOpen(false);
    if (preview) URL.revokeObjectURL(preview);
    const newUrl = URL.createObjectURL(croppedFile);
    setPreview(newUrl);
    runInference(croppedFile, true);
  }, [preview, runInference]);

  // Step 2b — crop cancelled: just close the dialog
  // cropSrc is intentionally NOT cleared here so the exit animation
  // has a valid imageSrc throughout its duration.
  const handleCropCancel = useCallback(() => {
    setCropOpen(false);
    // Clear display preview only if we have no inference result yet
    if (status === "idle") {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }, [preview, status]);

  // Sample gallery selection — fetch image → File → open crop modal
  const handleSampleSelect = useCallback(async (imageUrl: string) => {
    try {
      const res  = await fetch(imageUrl);
      const blob = await res.blob();
      const name = imageUrl.split("/").pop() ?? "sample.png";
      const file = new File([blob], name, { type: blob.type || "image/png" });
      openCrop(file);
    } catch {
      console.error("Failed to load sample image:", imageUrl);
    }
  }, [openCrop]);

  return (
    <>
      <Navbar />

      {/* ── Full-viewport column: scrollable content + pinned gallery ── */}
      <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col pt-20 overflow-hidden">

        {/* Scrollable main content */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-2">
          <div className="max-w-6xl mx-auto space-y-2">

            {/* Page header */}
            <DemoHeader apiOnline={apiOnline} />

            {/* Two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">


              {/* ── Left: inputs & controls ── */}
              <div className="space-y-3">
                <UploadZone
                  onFileSelect={handleFilePicked}
                  disabled={status === "loading" || cropOpen}
                  preview={preview}
                  status={status}
                  gradcamUrl={result?.type === "gradcam" ? result.data.imageUrl : null}
                  isCancer={result?.type === "gradcam" ? result.data.label === "Cancer" : false}
                  onFullscreenClick={() => setFullscreenOpen(true)}
                />
              </div>

              {/* ── Right: results ── */}
              <div className="space-y-3">
                {status === "idle" && (
                  <div className="flex flex-col items-center justify-center py-12 rounded-xl bg-white/60 text-gray-400 select-none">
                    <MdBarChart size={24} className="mb-2 text-gray-400" />
                    <p className="font-body text-sm font-medium">Results will appear here</p>
                  </div>
                )}
                {status === "loading" && <LoadingState gradcam={true} />}
                {status === "error" && error && (
                  <Alert variant="destructive">
                    <AlertDescription>❌ {error}</AlertDescription>
                  </Alert>
                )}
                {status === "success" && result && (
                  <>
                    {result.type === "json"    && <ResultCard     data={result.data} />}
                    {result.type === "gradcam" && <GradCamOverlay data={result.data} />}
                  </>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ── Sample gallery — pinned at bottom, edge-to-edge ── */}
        <div className="w-full flex-shrink-0">
          <p className="font-body text-center text-xs font-medium text-gray-400 pb-0 pt-1 tracking-widest uppercase">
            {demoData.galleryLabel}
          </p>
          <div className="w-full h-[200px]">
            <CircularGallery
              items={demoData.sampleImages}
              bend={0}
              textColor="#000000"
              borderRadius={0.05}
              scrollSpeed={2}
              scrollEase={0.05}
              onSelect={handleSampleSelect}
            />
          </div>
        </div>

      </div>

      {/* Crop modal — always mounted; uses its own cropSrc independent of display preview
           so Radix Dialog exit animation is never interrupted by state changes */}
      <CropModal
        open={cropOpen}
        imageSrc={cropSrc}
        originalName={cropName}
        onConfirm={handleCropConfirm}
        onCancel={handleCropCancel}
      />

      {/* Fullscreen image dialog */}
      {result?.type === "gradcam" && (
        <FullscreenImageDialog
          open={fullscreenOpen}
          onOpenChange={setFullscreenOpen}
          imageUrl={result.data.imageUrl}
          title="GradCAM++ Visualization"
          isCancer={result.data.label === "Cancer"}
          confidence={result.data.probability * 100}
        />
      )}
    </>
  );
};
