
export interface NavLink {
  label: string;
  href: string;
}

export interface LogoData {
  src: string;
  alt: string;
}

export interface HeroData {
  navLinks: NavLink[];
  demoRoute: string;
  institutionLogo: LogoData;
  collaborationLogo: LogoData;
  backgroundImage: string;
  title: string;
  subtitle: string;
  collaborationLabel: string;
  sanskritMotto: string;
}

export const heroData: HeroData = {
  navLinks: [
    { label: "Home", href: "#hero" },
    { label: "Awareness", href: "#awareness" },
    { label: "Methodology", href: "#methodology" },
  ],
  demoRoute: "/demo",
  institutionLogo: {
    src: "/amitylogo.png",
    alt: "Amity Centre for Artificial Intelligence",
  },
  collaborationLogo: {
    src: "/AIIMS.webp",
    alt: "All India Institute of Medical Sciences",
  },
  backgroundImage: "/background.png",
  title: "GallBladder Carcinoma",
  subtitle: "Cancer Detection Using Deep Learning",
  collaborationLabel: "In collaboration with",
  sanskritMotto: "शरीरमाद्यं खलु धर्मसाधनम्",
};
