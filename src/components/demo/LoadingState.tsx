import React, { useEffect, useState } from "react";
import { demoData } from "@/data/demoData";

export const DETAILED_AFTER_MS = 4_000;
export const WAKING_AFTER_MS = 30_000;

/** Neutral, time-based loading copy: the app can't know in advance whether stage 2 will run. */
export const LoadingState: React.FC = () => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setElapsed(Date.now() - start), 500);
    return () => clearInterval(id);
  }, []);

  const message =
    elapsed >= WAKING_AFTER_MS ? demoData.loading.waking
    : elapsed >= DETAILED_AFTER_MS ? demoData.loading.detailed
    : demoData.loading.initial;

  return (
    <div className="flex items-center justify-center gap-3 py-6 text-gray-500">
      <svg className="animate-spin h-5 w-5 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <span role="status" aria-live="polite" className="font-body text-sm">{message}</span>
    </div>
  );
};
