import { motion } from "framer-motion";
import { awarenessData } from "@/data/awarenessData";

const ClosingBanner = () => {
  const { closingBanner } = awarenessData;

  // const handleScroll = () => {
  //   const el = document.querySelector(closingBanner.ctaScrollTarget);
  //   el?.scrollIntoView({ behavior: "smooth" });
  // };

  const handleScroll = () => {
  if (closingBanner.ctaScrollTarget.startsWith("#")) {
    // Handle anchor links
    const el = document.querySelector(closingBanner.ctaScrollTarget);
    el?.scrollIntoView({ behavior: "smooth" });
  } else {
    // Handle routes
    window.location.href = closingBanner.ctaScrollTarget;
  }
};

  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-shift {
          background: linear-gradient(135deg, #0F2C59, #1a4a8a, #0F2C59);
          background-size: 200% 200%;
          animation: gradientShift 6s ease infinite;
        }
      `}</style>
      <section className="gradient-shift py-section">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="font-display font-bold text-3xl text-white"
          >
            {closingBanner.heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="font-body font-light text-lg text-white/80 mt-4"
          >
            {closingBanner.subtext}
          </motion.p>
          <button
            onClick={handleScroll}
            className="mt-8 border border-white text-white bg-transparent rounded-full px-8 py-3 font-body tracking-wide transition-all hover:bg-white hover:text-[#0F2C59] hover:shadow-[0_0_16px_rgba(255,255,255,0.4)]"
          >
            {closingBanner.ctaLabel}
          </button>
        </div>
      </section>
    </>
  );
};

export default ClosingBanner;
