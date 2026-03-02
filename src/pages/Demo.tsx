import React, { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { DemoHeader }                    from "../components/demo/DemoHeader";
import { GradCamToggle, GradCamOverlay } from "../components/demo/GradCam";
import { UploadZone }                    from "../components/demo/UploadZone";
import { LoadingState }                  from "../components/demo/LoadingState";
import { ResultCard }                    from "../components/demo/ResultCard";
import { Alert, AlertDescription }       from "@/components/ui/alert";
import { useInference }                  from "../hooks/useInference";

export const Demo: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [gradcam, setGradcam] = useState(false);
  const { status, result, error, apiOnline, runInference, reset } = useInference();

  const handleFileSelect = useCallback((file: File) => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    reset();
    runInference(file, gradcam);
  }, [preview, gradcam, reset, runInference]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20 pb-12 px-6">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Page header — full width */}
          <DemoHeader apiOnline={apiOnline} />

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* ── Left: inputs & controls ── */}
            <div className="space-y-5">
              <GradCamToggle checked={gradcam} onCheckedChange={setGradcam} />
              <UploadZone
                onFileSelect={handleFileSelect}
                disabled={status === "loading"}
                preview={preview}
              />
            </div>

            {/* ── Right: results ── */}
            <div className="space-y-4">
              {status === "idle" && (
                <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-gray-200 bg-white/60 text-gray-400 select-none">
                  <span className="text-4xl mb-3">📊</span>
                  <p className="text-sm font-medium">Results will appear here</p>
                  <p className="text-xs mt-1 opacity-70">Upload a CT scan to run inference</p>
                </div>
              )}
              {status === "loading" && <LoadingState gradcam={gradcam} />}
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
    </>
  );
};
