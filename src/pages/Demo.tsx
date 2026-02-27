// const Demo = () => {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-background">
//       <p className="text-xl text-foreground">Demo coming soon</p>
//     </div>
//   );
// };

// export default Demo;

import React, { useState, useCallback } from "react";
import { UploadZone }     from "../components/demo/UploadZone";
import { ResultCard }     from "../components/demo/ResultCard";
import { GradCamOverlay } from "../components/demo/GradCamOverlay";
import { useInference }   from "../hooks/useInference";

export const Demo: React.FC = () => {
  const [preview, setPreview]   = useState<string | null>(null);
  const [gradcam, setGradcam]   = useState(false);
  const { status, result, error, apiOnline, runInference, reset } = useInference();

  const handleFileSelect = useCallback((file: File) => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    reset();
    runInference(file, gradcam);
  }, [preview, gradcam, reset, runInference]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-gray-800">CT Scan Classifier</h1>
          <p className="text-gray-500 text-sm">DenseNet121 + CBAM · Gallbladder Cancer Detection</p>

          {/* API Status Badge */}
          <div className="flex justify-center pt-1">
            {apiOnline === null && (
              <span className="text-xs text-gray-400">Checking API…</span>
            )}
            {apiOnline === true && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                ✅ API Online
              </span>
            )}
            {apiOnline === false && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                ❌ API Offline — check HF Space
              </span>
            )}
          </div>
        </div>

        {/* GradCAM Toggle */}
        <label className="flex items-center gap-3 bg-white rounded-xl px-4 py-3
          border border-gray-200 shadow-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={gradcam}
            onChange={(e) => setGradcam(e.target.checked)}
            className="w-4 h-4 accent-blue-600"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">Show GradCAM++ Heatmap</p>
            <p className="text-xs text-gray-400">Visualizes model attention · ~15s on CPU</p>
          </div>
        </label>

        {/* Upload Zone */}
        <UploadZone
          onFileSelect={handleFileSelect}
          disabled={status === "loading"}
          preview={preview}
        />

        {/* Loading State */}
        {status === "loading" && (
          <div className="flex items-center justify-center gap-3 py-6 text-gray-500">
            <svg className="animate-spin h-5 w-5 text-blue-500"
              fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-sm">
              {gradcam ? "Running inference + GradCAM…" : "Running inference…"}
            </span>
          </div>
        )}

        {/* Error State */}
        {status === "error" && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Results */}
        {status === "success" && result && (
          <div className="space-y-4">
            {result.type === "json"    && <ResultCard     data={result.data} />}
            {result.type === "gradcam" && <GradCamOverlay data={result.data} />}
          </div>
        )}

      </div>
    </div>
  );
};
