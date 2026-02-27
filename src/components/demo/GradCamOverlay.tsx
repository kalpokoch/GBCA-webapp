import React from "react";
import type { GradCamResponse } from "@/lib/api";

interface Props { data: GradCamResponse; }

export const GradCamOverlay: React.FC<Props> = ({ data }) => {
  const isCancer = data.label === "Cancer";
  const pct = (data.probability * 100).toFixed(1);

  return (
    <div className="space-y-3">
      <img
        src={data.imageUrl}
        alt="GradCAM heatmap"
        className="w-full rounded-2xl border border-gray-200 shadow"
      />
      <div className={`text-center py-3 rounded-xl font-semibold text-sm
        ${isCancer ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
        {isCancer ? "🔴 Cancer" : "🟢 Normal"} · {pct}% confidence
        <span className="ml-2 text-xs font-normal opacity-70">
          (GradCAM++ · CBAM attention layer)
        </span>
      </div>
    </div>
  );
};
