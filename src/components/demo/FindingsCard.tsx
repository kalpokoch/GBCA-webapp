import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdCheckCircle, MdRemoveCircleOutline, MdInfoOutline } from "react-icons/md";
import { attributeLabel, type Attributes } from "@/lib/api";
import { demoData } from "@/data/demoData";

interface Props {
  /** Stage-2 findings; null means they were unavailable for this Cancer result. */
  attributes: Attributes | null;
}

/** Stage-2 radiological findings. Render only for Cancer results. */
export const FindingsCard: React.FC<Props> = ({ attributes }) => {
  const { findings } = demoData;

  // Detected first; stable order otherwise (backend sends a fixed key order).
  const entries = attributes
    ? Object.entries(attributes).sort(([, a], [, b]) => Number(b.present) - Number(a.present))
    : [];
  const noneDetected = entries.length > 0 && entries.every(([, v]) => !v.present);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-base sm:text-lg text-gray-800">{findings.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {!attributes ? (
          <p role="status" className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2 font-body text-sm text-gray-600">
            <MdInfoOutline size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            {findings.unavailable}
          </p>
        ) : (
          <>
            <ul className="divide-y divide-gray-100" aria-label={findings.title}>
              {entries.map(([key, value]) => (
                <li key={key} className="flex items-center justify-between gap-3 py-2">
                  <span className={`font-body text-sm ${value.present ? "font-semibold text-gray-800" : "text-gray-500"}`}>
                    {attributeLabel(key)}
                  </span>
                  {value.present ? (
                    <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 font-body text-xs font-semibold text-red-700">
                      <MdCheckCircle size={14} aria-hidden="true" /> {findings.detected}
                    </span>
                  ) : (
                    <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 font-body text-xs text-gray-500">
                      <MdRemoveCircleOutline size={14} aria-hidden="true" /> {findings.notDetected}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {noneDetected && (
              <p className="font-body text-sm text-gray-600">{findings.noneDetected}</p>
            )}
          </>
        )}

        <p className="font-body text-xs text-gray-400">{findings.disclaimer}</p>
      </CardContent>
    </Card>
  );
};
