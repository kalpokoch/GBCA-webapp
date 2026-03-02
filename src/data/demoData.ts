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

export interface LoadingMessages {
  default: string;
  withGradCam: string;
}

export interface DemoData {
  title: string;
  subtitle: string;
  apiStatus: ApiStatusMessages;
  gradCamToggle: GradCamToggleData;
  loading: LoadingMessages;
  sampleImages: SampleImage[];
  galleryLabel: string;
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
    default: "Running inference…",
    withGradCam: "Running inference + GradCAM…",
  },
  galleryLabel: "Try a Sample CT Scan",
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
