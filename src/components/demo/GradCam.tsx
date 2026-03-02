import React from "react";
import { Switch } from "@/components/ui/switch";
import CountUp from "@/components/ui/count-up";
import { demoData } from "@/data/demoData";
import type { GradCamResponse } from "@/lib/api";

// ─── GradCamToggle ────────────────────────────────────────────────────────────

interface GradCamToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const GradCamToggle: React.FC<GradCamToggleProps> = ({ checked, onCheckedChange }) => {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm select-none">
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
      <div>
        <p className="font-body text-sm font-medium text-gray-700">{demoData.gradCamToggle.label}</p>
        <p className="font-body text-xs text-gray-400">{demoData.gradCamToggle.description}</p>
      </div>
    </div>
  );
};

// ─── GradCamOverlay ───────────────────────────────────────────────────────────

interface GradCamOverlayProps {
  data: GradCamResponse;
}

export const GradCamOverlay: React.FC<GradCamOverlayProps> = ({ data }) => {
  const isCancer = data.label === "Cancer";
  const pctNum = parseFloat((data.probability * 100).toFixed(2));

  return (
    <div
      className={`w-full py-2 px-3 rounded-lg border flex flex-col sm:flex-row items-center justify-center gap-1 ${
        isCancer ? "bg-red-100 text-red-700 border-red-200" : "bg-green-100 text-green-700 border-green-200"
      }`}
    >
      <div className="font-body text-sm font-semibold text-center sm:text-left">
        {isCancer ? "🔴 Cancer" : "🟢 Normal"} · <CountUp to={pctNum} from={0} duration={1.5} />% confidence
      </div>
    </div>
  );
};
