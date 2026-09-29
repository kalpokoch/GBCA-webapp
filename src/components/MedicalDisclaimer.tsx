import React from "react";
import { MdInfoOutline } from "react-icons/md";

export const DISCLAIMER_TEXT =
  "This tool is intended for research and clinical decision support only. Final diagnosis and treatment planning must be confirmed by a qualified medical professional.";

interface Props {
  variant?: "light" | "dark";
  className?: string;
}

export const MedicalDisclaimer: React.FC<Props> = ({ variant = "light", className = "" }) => {
  const styles =
    variant === "dark"
      ? "bg-[#0A1F42] text-white/70 border-white/10"
      : "bg-amber-50 text-amber-900 border-amber-200";

  return (
    <div role="note" className={`border-y sm:border sm:rounded-lg ${styles} ${className}`}>
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-start gap-2 font-body text-xs leading-relaxed">
        <MdInfoOutline size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
        <p>
          <strong className="font-semibold">Medical Disclaimer:</strong> {DISCLAIMER_TEXT}
        </p>
      </div>
    </div>
  );
};
