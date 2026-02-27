export interface PreprocessingStep {
  label: string;
  description: string;
}

export interface DatasetData {
  totalImages: number;
  cancerImages: number;
  normalImages: number;
  testSetSize: number;
  imageSize: string;
  source: string;
  imbalanceRatio: string;
  preprocessingSteps: PreprocessingStep[];
}

export interface WorkflowStep {
  step: number;
  icon: string;
  label: string;
  description: string;
}

export interface ArchitectureData {
  name: string;
  description: string;
  highlights: string[];
}

export interface ProposedMetrics {
  accuracy: number;
  sensitivity: number;
  specificity: number;
  f1: number;
  auc: number;
}

export interface ConfusionMatrix {
  truePositive: number;
  falseNegative: number;
  falsePositive: number;
  trueNegative: number;
  total: number;
}

export interface AblationRow {
  model: string;
  accuracy: number;
  sensitivity: number;
  specificity: number;
  f1: number;
  auc: number;
  isProposed?: boolean;
}

export interface MetricsData {
  proposed: ProposedMetrics;
  confusionMatrix: ConfusionMatrix;
  ablation: AblationRow[];
}

export interface GradCamData {
  label: string;
  description: string;
}

export interface EncoderStage {
  stage: number;
  channels: number;
  resolution: string;
}

export interface MethodologyData {
  sectionHeading: string;
  sectionSubtext: string;
  dataset: DatasetData;
  workflow: WorkflowStep[];
  architecture: ArchitectureData;
  metrics: MetricsData;
  gradCam: GradCamData;
  encoderStages: EncoderStage[];
  classificationHead: string;
  colors: {
    primary: string;
    accent: string;
    sectionBg: string;
  };
}

export const methodologyData: MethodologyData = {
  sectionHeading: "How The AI Model Works",
  sectionSubtext:
    "A dual-pathway attention-enhanced deep learning framework for automated gallbladder carcinoma detection from CT imaging.",
  dataset: {
    totalImages: 1184,
    cancerImages: 333,
    normalImages: 851,
    testSetSize: 100,
    imageSize: "448 × 448 px",
    source: "All India Institute of Medical Sciences (AIIMS), New Delhi",
    imbalanceRatio: "1:2.56 (Cancer:Normal)",
    preprocessingSteps: [
      {
        label: "ROI Cropping",
        description:
          "Top 10% and bottom 5% of image height removed to eliminate padding-induced artifacts and spurious correlations.",
      },
      {
        label: "CLAHE Enhancement",
        description:
          "Contrast Limited Adaptive Histogram Equalization with 8×8 tile grid and clip limit 2.0 for local contrast boosting.",
      },
      {
        label: "Normalization",
        description:
          "Dataset-specific mean and standard deviation computed from training set only — preventing data leakage during evaluation.",
      },
      {
        label: "Augmentation",
        description:
          "Random crops, rotations (±15°), flips, elastic deformations, brightness/contrast shifts, Gaussian noise, MixUp (Beta 0.2) and coarse dropout.",
      },
    ],
  },
  workflow: [
    {
      step: 1,
      icon: "upload-cloud",
      label: "CT Scan Input",
      description:
        "Grayscale CT scan uploaded and validated for anatomical region.",
    },
    {
      step: 2,
      icon: "sliders",
      label: "Preprocessing",
      description:
        "ROI cropping, CLAHE enhancement, resize to 448×448, and normalization applied.",
    },
    {
      step: 3,
      icon: "cpu",
      label: "Model Inference",
      description:
        "Dual-pathway attention network with CBAM + MSAM processes the scan across 4 encoder stages.",
    },
    {
      step: 4,
      icon: "activity",
      label: "Risk Prediction",
      description:
        "Proposed model outputs binary classification with confidence score and Grad-CAM overlay.",
    },
  ],
  architecture: {
    name: "Dual-Pathway Multi-Scale Attention Network",
    description:
      "A lightweight hierarchical convolutional encoder with 4 progressive stages, enhanced by sequential CBAM (channel-spatial attention) and MSAM (multi-scale texture attention at 4 kernel scales: 1×1, 3×3, 5×5, 7×7) at each stage.",
    highlights: [
      "Lightweight hierarchical CNN encoder (not a heavy pretrained backbone)",
      "CBAM for channel + spatial feature refinement",
      "MSAM for multi-scale texture capture at 4 receptive field sizes",
      "Two-phase training: frozen warmup (10 epochs) + full fine-tuning (up to 190 epochs)",
      "Focal Loss (γ=1.5, α=0.75) + MixUp augmentation for class imbalance",
      "5-fold stratified cross-validation ensemble (5 models averaged)",
    ],
  },
  metrics: {
    proposed: {
      accuracy: 86.0,
      sensitivity: 88.0,
      specificity: 84.0,
      f1: 85.91,
      auc: 0.893,
    },
    confusionMatrix: {
      truePositive: 44,
      falseNegative: 6,
      falsePositive: 8,
      trueNegative: 42,
      total: 100,
    },
    ablation: [
      { model: "DenseNet201", accuracy: 83.0, sensitivity: 82.0, specificity: 84.0, f1: 83.0, auc: 0.872 },
      { model: "EfficientNet-B0", accuracy: 82.0, sensitivity: 92.0, specificity: 72.0, f1: 81.82, auc: 0.8708 },
      { model: "ResNet50", accuracy: 70.0, sensitivity: 88.0, specificity: 52.0, f1: 69.0, auc: 0.7592 },
      { model: "MobileNetV2", accuracy: 76.0, sensitivity: 86.0, specificity: 66.0, f1: 75.76, auc: 0.826 },
      { model: "GhostNet", accuracy: 81.0, sensitivity: 74.0, specificity: 88.0, f1: 80.91, auc: 0.8424 },
      { model: "ConvNeXt-Tiny (Base)", accuracy: 80.0, sensitivity: 88.0, specificity: 72.0, f1: 79.87, auc: 0.8588 },
      { model: "Proposed Model", accuracy: 86.0, sensitivity: 88.0, specificity: 84.0, f1: 85.91, auc: 0.8848, isProposed: true },
    ],
  },
  gradCam: {
    label: "Grad-CAM Interpretability",
    description:
      "Activation maps confirm predictions focus on anatomically relevant gallbladder regions — not imaging artifacts or padding borders.",
  },
  encoderStages: [
    { stage: 1, channels: 96, resolution: "112×112" },
    { stage: 2, channels: 192, resolution: "56×56" },
    { stage: 3, channels: 384, resolution: "28×28" },
    { stage: 4, channels: 768, resolution: "14×14" },
  ],
  classificationHead: "Global Avg Pool → Dropout (0.5) → Sigmoid",
  colors: {
    primary: "#0F2C59",
    accent: "#3AAFA9",
    sectionBg: "#F7FAFC",
  },
};
