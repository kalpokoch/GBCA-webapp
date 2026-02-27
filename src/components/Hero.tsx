import { heroData } from "@/data/heroData";

const Hero = () => {
  return (
    <section
      className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${heroData.backgroundImage})` }}
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

        <p className="font-body font-light text-white/80 text-sm">
          {/* {heroData.sanskritMotto} */}
        </p>
      </div>
    </section>
  );
};

export default Hero;
