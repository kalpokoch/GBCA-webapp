import { useState, useCallback, useEffect, useRef } from "react";
import { predictImage, healthCheck, type InferenceResult } from "../lib/api";

type Status = "idle" | "loading" | "success" | "error";

export function useInference() {
  const [status, setStatus]         = useState<Status>("idle");
  const [result, setResult]         = useState<InferenceResult | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [apiOnline, setApiOnline]   = useState<boolean | null>(null);
  const gradcamUrlRef               = useRef<string | null>(null);

  // Check API health on mount
  useEffect(() => {
    healthCheck().then(setApiOnline);
  }, []);

  // Revoke object URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (gradcamUrlRef.current) URL.revokeObjectURL(gradcamUrlRef.current);
    };
  }, []);

  const runInference = useCallback(async (file: File, gradcam: boolean) => {
    // Revoke previous GradCAM URL if exists
    if (gradcamUrlRef.current) {
      URL.revokeObjectURL(gradcamUrlRef.current);
      gradcamUrlRef.current = null;
    }

    setStatus("loading");
    setResult(null);
    setError(null);

    try {
      const res = await predictImage(file, gradcam);
      if (res.type === "gradcam") gradcamUrlRef.current = res.data.imageUrl;
      setResult(res);
      setStatus("success");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Inference failed");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, apiOnline, runInference, reset };
}
