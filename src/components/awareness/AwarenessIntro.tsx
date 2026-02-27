import { motion } from "framer-motion";
import { awarenessData } from "@/data/awarenessData";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.4, delay: delay / 1000 },
});

const AwarenessIntro = () => {
  const { intro, colors } = awarenessData;

  return (
    <section className="py-[120px] bg-white">
      <div className="max-w-[1100px] mx-auto px-6 text-center">
        <motion.h2
          {...fadeUp(0)}
          className="font-display font-bold text-4xl uppercase tracking-wider"
          style={{ color: colors.primary }}
        >
          {intro.heading}
        </motion.h2>
        <motion.p
          {...fadeUp(150)}
          className="font-body font-light text-lg text-gray-600 mt-6"
        >
          {intro.paragraph1}
        </motion.p>
        <motion.p
          {...fadeUp(300)}
          className="font-body font-light text-lg text-gray-600 mt-2"
        >
          {intro.paragraph2}
        </motion.p>
      </div>
    </section>
  );
};

export default AwarenessIntro;
