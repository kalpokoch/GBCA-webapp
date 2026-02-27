export interface IntroData {
  heading: string;
  paragraph1: string;
  paragraph2: string;
}

export interface ProblemBlock {
  icon: string;
  heading: string;
  description: string;
}

export interface Stage {
  label: string;
  description: string;
  highlight: boolean;
}

export interface Stat {
  value: string;
  countTarget: number;
  suffix: string;
  label: string;
}

export interface ClosingBanner {
  heading: string;
  subtext: string;
  ctaLabel: string;
  ctaScrollTarget: string;
}

export interface AwarenessColors {
  primary: string;
  accent: string;
  danger: string;
  sectionBg: string;
}

export interface AwarenessData {
  intro: IntroData;
  problemBlocks: ProblemBlock[];
  stages: Stage[];
  stats: Stat[];
  closingBanner: ClosingBanner;
  colors: AwarenessColors;
}

export const awarenessData: AwarenessData = {
  intro: {
    heading: "WHY EARLY DETECTION MATTERS",
    paragraph1: "Gallbladder cancer often shows no symptoms in its early stages.",
    paragraph2: "By the time it is detected, treatment options become limited.",
  },
  problemBlocks: [
    {
      icon: "eye-off",
      heading: "Silent Symptoms",
      description:
        "Gallbladder cancer rarely causes noticeable symptoms in its early stages, making it hard to detect without screening.",
    },
    {
      icon: "clock",
      heading: "Late Diagnosis",
      description:
        "Most cases are identified only in advanced stages, significantly reducing the effectiveness of treatment.",
    },
    {
      icon: "cpu",
      heading: "Need for AI Support",
      description:
        "AI-assisted analysis helps doctors identify early signs that may be missed in routine examination.",
    },
  ],
  stages: [
    {
      label: "Healthy",
      description: "Normal gallbladder, no abnormalities detected.",
      highlight: false,
    },
    {
      label: "Early Stage",
      description: "Subtle wall thickening, detectable with screening.",
      highlight: false,
    },
    {
      label: "Advanced Stage",
      description: "Tumor spread, limited treatment options.",
      highlight: true,
    },
  ],
  stats: [
    {
      value: "70%+",
      countTarget: 70,
      suffix: "%+",
      label: "Cases diagnosed in late stages",
    },
    {
      value: "~20%",
      countTarget: 20,
      suffix: "%",
      label: "5-year survival rate at advanced stage",
    },
    {
      value: "3x",
      countTarget: 3,
      suffix: "x",
      label: "Better outcomes with early detection",
    },
    {
      value: "AI",
      countTarget: 0,
      suffix: "",
      label: "Can assist in faster, accurate screening",
    },
  ],
  closingBanner: {
    heading: "Early detection can save lives.",
    subtext: "Technology can support faster and more accurate diagnosis.",
    ctaLabel: "See How It Works",
    ctaScrollTarget: "/demo",
  },
  colors: {
    primary: "#0F2C59",
    accent: "#3AAFA9",
    danger: "#E05C5C",
    sectionBg: "#F7FAFC",
  },
};
