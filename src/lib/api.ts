const API_BASE = import.meta.env.VITE_API_URL as string;

export interface PredictResponse {
  probability: number;
  predicted_class: 0 | 1;
  label: "Cancer" | "Normal";
  threshold_used: number;
}

export interface GradCamResponse {
  imageUrl: string;
  label: string;
  probability: number;
  threshold_used: number;
}

export type InferenceResult =
  | { type: "json"; data: PredictResponse }
  | { type: "gradcam"; data: GradCamResponse };

export async function predictImage(
  file: File,
  gradcam = false
): Promise<InferenceResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/predict?gradcam=${gradcam}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown server error" }));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }

  const contentType = res.headers.get("content-type") ?? "";

  if (gradcam && contentType.includes("image/png")) {
    const blob = await res.blob();
    return {
      type: "gradcam",
      data: {
        imageUrl:      URL.createObjectURL(blob),
        label:         res.headers.get("X-Prediction") ?? "",
        probability:   parseFloat(res.headers.get("X-Probability") ?? "0"),
        threshold_used: parseFloat(res.headers.get("X-Threshold") ?? "0.46"),
      },
    };
  }

  const json: PredictResponse = await res.json();
  return { type: "json", data: json };
}

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch {
    return false;
  }
}
