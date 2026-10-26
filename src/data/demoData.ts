export interface SampleImage {
  image: string;
  text: string;
}

export interface ApiStatusMessages {
  checking: string;
  online: string;
  offline: string;
}

export interface GradCamToggleData {
  label: string;
  description: string;
}

/** Progressive loading copy — the result (and whether stage 2 runs) is unknown until the response arrives, so keep it neutral. */
export interface LoadingMessages {
  initial: string;   // 0–4 s
  detailed: string;  // after ~4 s
  waking: string;    // after ~30 s
}

export interface FindingsData {
  title: string;
  detected: string;
  notDetected: string;
  noneDetected: string;
  unavailable: string;
  disclaimer: string;
}

export interface DemoData {
  title: string;
  subtitle: string;
  apiStatus: ApiStatusMessages;
  gradCamToggle: GradCamToggleData;
  loading: LoadingMessages;
  sampleImages: SampleImage[];
  galleryLabel: string;
  findings: FindingsData;
}

export const demoData: DemoData = {
  title: "Gallbladder Cancer",
  subtitle: "Detection System",
  apiStatus: {
    checking: "Checking API…",
    online: "API Online",
    offline: "API Offline — check HF Space",
  },
  gradCamToggle: {
    label: "Show GradCAM++ Heatmap",
    description: "Visualizes model attention · ~15s on CPU",
  },
  loading: {
    initial: "Analysing scan…",
    detailed: "Running detailed analysis… this can take up to 20 seconds.",
    waking: "The server may be waking up, please wait…",
  },
  galleryLabel: "Try a Sample CT Scan",
  findings: {
    title: "Radiological findings (AI-suggested)",
    detected: "Detected",
    notDetected: "Not detected",
    noneDetected: "No specific findings identified by the attribute model.",
    unavailable: "Detailed findings are unavailable for this scan.",
    disclaimer: "AI-generated findings for research and decision support only. Not a diagnosis.",
  },
  // Add your sample images to public/test_images/ and list them here
  sampleImages: [
    { image: "/test_images/sample1.png", text: "Sample 1" },
    { image: "/test_images/sample2.png", text: "Sample 2" },
    { image: "/test_images/sample3.png", text: "Sample 3" },
    { image: "/test_images/sample4.png", text: "Sample 4" },
    { image: "/test_images/Nsample1 (1).png", text: "Sample 5" },
    { image: "/test_images/Nsample1 (2).png", text: "Sample 6" },
    { image: "/test_images/Nsample1 (3).png", text: "Sample 7" },
    { image: "/test_images/Nsample1 (4).png", text: "Sample 8" },
  ],
};
