import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { awarenessData } from "@/data/awarenessData";
import type { Stat } from "@/data/awarenessData";

const useCountUp = (target: number, duration: number, start: boolean) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || target === 0) return;
    let startTime: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return count;
};

const StatCard = ({ stat, index }: { stat: Stat; index: number }) => {
  const { colors } = awarenessData;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const count = useCountUp(stat.countTarget, 1500, inView);
  const isAI = stat.countTarget === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg p-8 text-center border-t-4 transition-shadow"
      style={{ borderTopColor: colors.accent }}
    >
      <p className="font-display text-4xl font-bold" style={{ color: colors.primary }}>
        {isAI ? stat.value : `${count}${stat.suffix}`}
      </p>
      <p className="font-body font-light text-sm text-gray-500 mt-2">
        {stat.label}
      </p>
    </motion.div>
  );
};

const StatisticsSection = () => {
  const { stats } = awarenessData;

  return (
    <section className="py-section bg-white">
      <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} stat={stat} index={i} />
        ))}
      </div>
    </section>
  );
};

export default StatisticsSection;
