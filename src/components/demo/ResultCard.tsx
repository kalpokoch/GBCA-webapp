import React from "react";
import type { PredictResponse } from "@/lib/api";

interface Props { data: PredictResponse; }

export const ResultCard: React.FC<Props> = ({ data }) => {
  const isCancer = data.predicted_class === 1;
  const pct = (data.probability * 100).toFixed(1);
  const barColor = isCancer ? "bg-red-500" : "bg-green-500";
  const cardColor = isCancer
    ? "border-red-300 bg-red-50"
    : "border-green-300 bg-green-50";

  return (
    <div className={`rounded-2xl border-2 p-6 ${cardColor} space-y-4`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">
          {isCancer ? "🔴 Cancer Detected" : "🟢 Normal"}
        </h3>
        <span className={`text-xs font-mono px-2 py-1 rounded-full
          ${isCancer ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          class {data.predicted_class}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Confidence</span>
          <span className="font-semibold">{pct}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-400 text-right">
        Threshold: {data.threshold_used}
      </p>
    </div>
  );
};
