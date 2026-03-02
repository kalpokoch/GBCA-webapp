import React from "react";
import { demoData } from "@/data/demoData";

interface LoadingStateProps {
  gradcam: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ gradcam }) => {
  return (
    <div className="flex items-center justify-center gap-3 py-6 text-gray-500">
      <svg className="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <span className="font-body text-sm">
        {gradcam ? demoData.loading.withGradCam : demoData.loading.default}
      </span>
    </div>
  );
};
