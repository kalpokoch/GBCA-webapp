const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

/** Cancer cases run both stages (~10–20 s, more on a cold start), so never time out under 90 s. */
export const REQUEST_TIMEOUT_MS = 120_000;

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = REQUEST_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // credentials must stay "omit": the HF proxy exposes headers via "*", which
    // browsers ignore on credentialed requests (X-Prediction etc. would read as null).
    return await fetch(input, { ...init, credentials: "omit", signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

// ── Stage 2: radiological findings ───────────────────────────────────────────

export type AttributeKey =
  | "wall_thickening"
  | "mass_replacing_gb"
  | "polypoidal_lesion"
  | "liver_invasion"
  | "lymph_node_involvement"
  | "biliary_obstruction"
  | "adjacent_organ_involvement";

export interface AttributeResult {
  probability: number; // research/debug only — not for display
  present: boolean;    // the only per-finding value shown to users
  threshold: number;   // research/debug only — not for display
}

export type Attributes = Record<AttributeKey | string, AttributeResult>;

export const ATTRIBUTE_LABELS: Record<string, string> = {
  wall_thickening: "Gallbladder wall thickening",
  mass_replacing_gb: "Mass replacing the gallbladder",
  polypoidal_lesion: "Polypoidal lesion",
  liver_invasion: "Liver invasion",
  lymph_node_involvement: "Lymph node involvement",
  biliary_obstruction: "Biliary obstruction",
  adjacent_organ_involvement: "Adjacent organ involvement",
};

/** Display name for a finding; unknown keys from a newer backend get a humanised fallback. */
export function attributeLabel(key: string): string {
  if (ATTRIBUTE_LABELS[key]) return ATTRIBUTE_LABELS[key];
  const words = key.replace(/_/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Parses the X-Attributes header (or any untrusted value) into Attributes, or null. */
export function parseAttributes(raw: unknown): Attributes | null {
  let value = raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const out: Attributes = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (entry && typeof entry === "object" && typeof (entry as AttributeResult).present === "boolean") {
      out[key] = entry as AttributeResult;
    }
  }
  return Object.keys(out).length ? out : null;
}

// ── Responses ────────────────────────────────────────────────────────────────

export interface PredictResponse {
  probability: number;
  predicted_class: 0 | 1;
  label: "Cancer" | "Normal";
  threshold_used: number;
  /** null for Normal (stage 2 skipped by design) or when stage 2 failed. */
  attributes: Attributes | null;
  attributes_error?: string;
}

export interface GradCamResponse {
  imageUrl: string;
  label: string;
  probability: number;
  threshold_used: number;
  /** From X-Attributes; null for Normal, or when stage 2 failed / header was malformed. */
  attributes: Attributes | null;
}

export type InferenceResult =
  | { type: "json"; data: PredictResponse }
  | { type: "gradcam"; data: GradCamResponse };

export async function predictImage(
  file: File,
  gradcam = false
): Promise<InferenceResult> {
  if (!API_BASE) {
    throw new Error("API URL is not configured. Set VITE_API_URL.");
  }

  const formData = new FormData();
  formData.append("file", file);

  let res: Response;
  try {
    res = await fetchWithTimeout(`${API_BASE}/predict?gradcam=${gradcam}`, {
      method: "POST",
      body: formData,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new Error("The server took too long to respond. Please try again.");
    }
    throw e;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown server error" }));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }

  const contentType = res.headers.get("content-type") ?? "";

  if (gradcam && contentType.includes("image/png")) {
    const blob = await res.blob();
    const label = res.headers.get("X-Prediction") ?? "";
    const rawAttributes = res.headers.get("X-Attributes");
    const attributes = parseAttributes(rawAttributes);
    if (label === "Cancer" && !attributes) {
      console.warn("Stage 2 findings unavailable (X-Attributes missing or malformed):", rawAttributes);
    }
    return {
      type: "gradcam",
      data: {
        imageUrl:       URL.createObjectURL(blob),
        label,
        probability:    parseFloat(res.headers.get("X-Probability") ?? "0"),
        threshold_used: parseFloat(res.headers.get("X-Threshold") ?? "0.62"),
        attributes,
      },
    };
  }

  const json = await res.json();
  const data: PredictResponse = { ...json, attributes: parseAttributes(json.attributes) };
  if (data.attributes_error) {
    console.warn("Stage 2 findings failed:", data.attributes_error);
  }
  return { type: "json", data };
}

export async function healthCheck(): Promise<boolean> {
  if (!API_BASE) return false;

  try {
    // Also wakes a sleeping Space early; waking can take 30–60 s, so allow that.
    const res = await fetchWithTimeout(`${API_BASE}/health`, {}, REQUEST_TIMEOUT_MS);
    return res.ok;
  } catch {
    return false;
  }
}
