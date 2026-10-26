import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const BASE = "https://amitycentreforai-gbca.hf.space";

const ATTRS = {
  wall_thickening:            { probability: 0.3992, present: false, threshold: 0.46 },
  mass_replacing_gb:          { probability: 0.7262, present: true,  threshold: 0.62 },
  polypoidal_lesion:          { probability: 0.457,  present: false, threshold: 0.56 },
  liver_invasion:             { probability: 0.5578, present: true,  threshold: 0.51 },
  lymph_node_involvement:     { probability: 0.4428, present: false, threshold: 0.6 },
  biliary_obstruction:        { probability: 0.4444, present: false, threshold: 0.62 },
  adjacent_organ_involvement: { probability: 0.4829, present: false, threshold: 0.5 },
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const png = (headers: Record<string, string>) =>
  new Response(new Blob([new Uint8Array([137, 80, 78, 71])]), {
    status: 200,
    headers: { "content-type": "image/png", ...headers },
  });

const file = () => new File([new Uint8Array([1, 2, 3])], "scan.png", { type: "image/png" });

let fetchMock: ReturnType<typeof vi.fn>;

// api.ts reads VITE_API_URL at import time, so re-import after stubbing the env.
async function loadApi() {
  vi.resetModules();
  return import("./api");
}

beforeEach(() => {
  vi.stubEnv("VITE_API_URL", BASE);
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  URL.createObjectURL = vi.fn(() => "blob:overlay");
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("predictImage: JSON mode", () => {
  it("Normal: attributes is null and the stage-1 fields are unchanged", async () => {
    fetchMock.mockResolvedValue(json({ probability: 0.605, predicted_class: 0, label: "Normal", threshold_used: 0.62, attributes: null }));
    const { predictImage } = await loadApi();
    const res = await predictImage(file(), false);
    expect(res).toEqual({
      type: "json",
      data: { probability: 0.605, predicted_class: 0, label: "Normal", threshold_used: 0.62, attributes: null },
    });
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("Cancer with findings: passes the attributes through", async () => {
    fetchMock.mockResolvedValue(json({ probability: 0.8731, predicted_class: 1, label: "Cancer", threshold_used: 0.62, attributes: ATTRS }));
    const { predictImage } = await loadApi();
    const res = await predictImage(file(), false);
    expect(res.type).toBe("json");
    expect(res.data.attributes).toEqual(ATTRS);
  });

  it("Cancer with all findings absent", async () => {
    const none = Object.fromEntries(Object.entries(ATTRS).map(([k, v]) => [k, { ...v, present: false }]));
    fetchMock.mockResolvedValue(json({ probability: 0.8, predicted_class: 1, label: "Cancer", threshold_used: 0.62, attributes: none }));
    const { predictImage } = await loadApi();
    const res = await predictImage(file(), false);
    expect(Object.values(res.data.attributes!).every((a) => !a.present)).toBe(true);
  });

  it("Cancer with attributes_error: keeps the result, attributes null, logs the error", async () => {
    fetchMock.mockResolvedValue(json({ probability: 0.8731, predicted_class: 1, label: "Cancer", threshold_used: 0.62, attributes: null, attributes_error: "boom" }));
    const { predictImage } = await loadApi();
    const res = await predictImage(file(), false);
    expect(res.data.label).toBe("Cancer");
    expect(res.data.attributes).toBeNull();
    expect(console.warn).toHaveBeenCalledWith(expect.any(String), "boom");
  });
});

describe("predictImage: Grad-CAM mode", () => {
  const baseHeaders = { "X-Probability": "0.8731", "X-Threshold": "0.62" };

  it("Normal: no X-Attributes header gives attributes null", async () => {
    fetchMock.mockResolvedValue(png({ ...baseHeaders, "X-Prediction": "Normal" }));
    const { predictImage } = await loadApi();
    const res = await predictImage(file(), true);
    expect(res).toEqual({
      type: "gradcam",
      data: { imageUrl: "blob:overlay", label: "Normal", probability: 0.8731, threshold_used: 0.62, attributes: null },
    });
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("Cancer: parses X-Attributes", async () => {
    fetchMock.mockResolvedValue(png({ ...baseHeaders, "X-Prediction": "Cancer", "X-Attributes": JSON.stringify(ATTRS) }));
    const { predictImage } = await loadApi();
    const res = await predictImage(file(), true);
    expect(res.type).toBe("gradcam");
    expect(res.data.attributes).toEqual(ATTRS);
  });

  it("Cancer with malformed X-Attributes: findings unavailable, no crash", async () => {
    fetchMock.mockResolvedValue(png({ ...baseHeaders, "X-Prediction": "Cancer", "X-Attributes": "{not json" }));
    const { predictImage } = await loadApi();
    const res = await predictImage(file(), true);
    expect(res.data.label).toBe("Cancer");
    expect(res.data.attributes).toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });
});

describe("predictImage: request shape", () => {
  it("makes exactly one non-credentialed POST to /predict with a timeout of at least 90 s", async () => {
    fetchMock.mockResolvedValue(png({ "X-Prediction": "Normal", "X-Probability": "0.6", "X-Threshold": "0.62" }));
    const { predictImage, REQUEST_TIMEOUT_MS } = await loadApi();
    await predictImage(file(), true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BASE}/predict?gradcam=true`);
    expect(init.method).toBe("POST");
    expect(init.credentials).toBe("omit");
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(REQUEST_TIMEOUT_MS).toBeGreaterThanOrEqual(90_000);
  });

  it("does not abort a slow (25 s) response", async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation((_url: string, init: RequestInit) =>
      new Promise((resolve, reject) => {
        init.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
        setTimeout(() => resolve(json({ probability: 0.9, predicted_class: 1, label: "Cancer", threshold_used: 0.62, attributes: ATTRS })), 25_000);
      })
    );
    const { predictImage } = await loadApi();
    const pending = predictImage(file(), false);
    await vi.advanceTimersByTimeAsync(25_000);
    await expect(pending).resolves.toMatchObject({ type: "json", data: { label: "Cancer" } });
  });

  it.each([
    [422, "Upload must be an image file."],
    [413, "Image must be under 10MB."],
    [500, "Inference failed: oops"],
  ])("surfaces the backend detail for HTTP %i", async (status, detail) => {
    fetchMock.mockResolvedValue(json({ detail }, status));
    const { predictImage } = await loadApi();
    await expect(predictImage(file(), true)).rejects.toThrow(detail);
  });
});

describe("attribute helpers", () => {
  it("uses the product display names and humanises unknown keys", async () => {
    const { attributeLabel } = await loadApi();
    expect(attributeLabel("mass_replacing_gb")).toBe("Mass replacing the gallbladder");
    expect(attributeLabel("wall_thickening")).toBe("Gallbladder wall thickening");
    expect(attributeLabel("portal_vein_invasion")).toBe("Portal vein invasion");
  });

  it("parseAttributes rejects non-objects and malformed entries", async () => {
    const { parseAttributes } = await loadApi();
    expect(parseAttributes(null)).toBeNull();
    expect(parseAttributes("[]")).toBeNull();
    expect(parseAttributes({ a: { probability: 1 } })).toBeNull();
    expect(parseAttributes({ a: { present: true }, b: "x" })).toEqual({ a: { present: true } });
  });
});
