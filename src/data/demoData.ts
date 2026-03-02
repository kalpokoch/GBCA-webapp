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
}

export const demoData: DemoData = {
  title: "CT Scan Classifier",
  subtitle: "DenseNet121 + CBAM · Gallbladder Cancer Detection",
  apiStatus: {
    checking: "Checking API…",
    online: "✅ API Online",
    offline: "❌ API Offline — check HF Space",
  },
  gradCamToggle: {
    label: "Show GradCAM++ Heatmap",
    description: "Visualizes model attention · ~15s on CPU",
  },
  loading: {
    default: "Running inference…",
    withGradCam: "Running inference + GradCAM…",
  },
};
