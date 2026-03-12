import { heroData } from "@/data/heroData";
import { useLazyImage } from "@/hooks/useLazyImage";
import { Link } from "react-router-dom";

const Hero = () => {
  const { backgroundImage, isLoaded } = useLazyImage({
    src: heroData.backgroundImage,
  });

  return (
    <section
      className={`relative w-full h-screen bg-cover bg-center flex items-center justify-center transition-all duration-700 ${
        isLoaded ? "blur-0" : "blur-sm"
      }`}
      style={{ 
        backgroundImage,
        backgroundColor: "#1a1a2e", // Fallback color while loading
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-4">
          {heroData.title}
        </h1>

        <p className="font-body font-light text-lg md:text-xl text-white/90 tracking-wide mb-8">
          {heroData.subtitle}
        </p>

        <div className="border border-white/60 rounded px-6 py-2 mb-8">
          <span className="font-body font-light text-white/80 text-sm tracking-wide">
            {heroData.collaborationLabel}
          </span>
        </div>

        <img
          src={heroData.collaborationLogo.src}
          alt={heroData.collaborationLogo.alt}
          className="w-40 mb-3"
        />

        <Link
          to="/demo"
          className="slice-button-inverted font-sans mt-4"
          onClick={(e) => {
            e.preventDefault();
            const demoSection = document.getElementById('demo');
            if (demoSection) {
              demoSection.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.location.href = '/demo';
            }
          }}
        >
          <span className="text">Try Live Demo</span>
        </Link>

        <p className="font-body font-light text-white/80 text-sm">
          {/* {heroData.sanskritMotto} */}
        </p>
      </div>
    </section>
  );
};

export default Hero;
