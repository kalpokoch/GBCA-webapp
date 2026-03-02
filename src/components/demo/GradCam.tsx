import React from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
        <p className="text-sm font-medium text-gray-700">{demoData.gradCamToggle.label}</p>
        <p className="text-xs text-gray-400">{demoData.gradCamToggle.description}</p>
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
  const pctNum = data.probability * 100;

  return (
    <div className="space-y-3">
      <img
        src={data.imageUrl}
        alt="GradCAM heatmap"
        className="w-full rounded-2xl border border-gray-200 shadow"
      />
      <Badge
        variant="outline"
        className={`w-full justify-center py-3 text-sm font-semibold rounded-xl ${
          isCancer ? "bg-red-100 text-red-700 border-red-200" : "bg-green-100 text-green-700 border-green-200"
        }`}
      >
        {isCancer ? "🔴 Cancer" : "🟢 Normal"} · <CountUp to={pctNum} from={0} duration={1.5} />% confidence
        <span className="ml-2 text-xs font-normal opacity-70">
          (GradCAM++ · CBAM attention layer)
        </span>
      </Badge>
    </div>
  );
};
