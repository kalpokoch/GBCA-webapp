import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { methodologyData } from "@/data/methodologyData";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const useCountUp = (target: number, duration: number, start: boolean, isDecimal = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || target === 0) return;
    let startTime: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const val = progress * target;
      setCount(isDecimal ? parseFloat(val.toFixed(3)) : Math.floor(val));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start, isDecimal]);

  return count;
};

const MetricCard = ({
  value,
  label,
  index,
  isDecimal,
  suffix,
}: {
  value: number;
  label: string;
  index: number;
  isDecimal?: boolean;
  suffix: string;
}) => {
  const { colors } = methodologyData;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const count = useCountUp(value, 1500, inView, isDecimal);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 text-center border-t-4 transition-shadow"
      style={{ borderTopColor: colors.accent }}
    >
      <p className="font-display text-4xl font-bold" style={{ color: colors.primary }}>
        {isDecimal ? count.toFixed(3) : count}
        {suffix}
      </p>
      <p className="font-body font-light text-sm text-gray-500 mt-2">{label}</p>
    </motion.div>
  );
};

const MetricsBlock = () => {
  const { metrics, colors } = methodologyData;

  const metricCards = [
    { value: metrics.proposed.accuracy, label: "Accuracy", suffix: "%", isDecimal: false },
    { value: metrics.proposed.sensitivity, label: "Sensitivity", suffix: "%", isDecimal: false },
    { value: metrics.proposed.specificity, label: "Specificity", suffix: "%", isDecimal: false },
    { value: metrics.proposed.f1, label: "F1-Score", suffix: "%", isDecimal: false },
    { value: metrics.proposed.auc, label: "AUC-ROC", suffix: "", isDecimal: true },
  ];

  const cm = metrics.confusionMatrix;

  return (
    <section className="py-[120px] bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
          {metricCards.map((m, i) => (
            <MetricCard
              key={i}
              value={m.value}
              label={m.label}
              index={i}
              isDecimal={m.isDecimal}
              suffix={m.suffix}
            />
          ))}
        </div>

        {/* Confusion Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="max-w-[480px] mx-auto">
            {/* Column labels */}
            <div className="grid grid-cols-[100px_1fr_1fr] gap-2 mb-2">
              <div />
              <p className="font-body font-light text-xs text-gray-400 text-center">Predicted Cancer</p>
              <p className="font-body font-light text-xs text-gray-400 text-center">Predicted Normal</p>
            </div>
            {/* Row 1 */}
            <div className="grid grid-cols-[100px_1fr_1fr] gap-2 mb-2">
              <div className="flex items-center">
                <p className="font-body font-light text-xs text-gray-400">Actual Cancer</p>
              </div>
              <div className="bg-[#F0FFF4] rounded-xl p-4 text-center border border-green-100">
                <p className="font-display font-bold text-2xl" style={{ color: colors.primary }}>{cm.truePositive}</p>
                <p className="font-body font-light text-xs text-gray-500 mt-1">True Positive</p>
              </div>
              <div className="bg-[#FFF5F5] rounded-xl p-4 text-center border border-red-100">
                <p className="font-display font-bold text-2xl" style={{ color: colors.primary }}>{cm.falseNegative}</p>
                <p className="font-body font-light text-xs text-gray-500 mt-1">False Negative</p>
              </div>
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-[100px_1fr_1fr] gap-2">
              <div className="flex items-center">
                <p className="font-body font-light text-xs text-gray-400">Actual Normal</p>
              </div>
              <div className="bg-[#FFF5F5] rounded-xl p-4 text-center border border-red-100">
                <p className="font-display font-bold text-2xl" style={{ color: colors.primary }}>{cm.falsePositive}</p>
                <p className="font-body font-light text-xs text-gray-500 mt-1">False Positive</p>
              </div>
              <div className="bg-[#F0FFF4] rounded-xl p-4 text-center border border-green-100">
                <p className="font-display font-bold text-2xl" style={{ color: colors.primary }}>{cm.trueNegative}</p>
                <p className="font-body font-light text-xs text-gray-500 mt-1">True Negative</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ablation Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-body font-light text-sm uppercase text-gray-400 tracking-wider mb-4">
            Ablation Study &amp; Baseline Comparison
          </p>
          <div className="rounded-2xl overflow-hidden shadow-md">
            <Table>
              <TableHeader>
                <TableRow className="border-b-0" style={{ backgroundColor: colors.primary }}>
                  <TableHead className="text-white text-sm font-body">Model</TableHead>
                  <TableHead className="text-white text-sm font-body text-center">Accuracy</TableHead>
                  <TableHead className="text-white text-sm font-body text-center">Sensitivity</TableHead>
                  <TableHead className="text-white text-sm font-body text-center">Specificity</TableHead>
                  <TableHead className="text-white text-sm font-body text-center">F1</TableHead>
                  <TableHead className="text-white text-sm font-body text-center">AUC-ROC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.ablation.map((row, i) => (
                  <TableRow
                    key={i}
                    className={`${
                      row.isProposed
                        ? "border-l-4 font-bold"
                        : i % 2 === 0
                        ? "bg-white"
                        : ""
                    }`}
                    style={
                      row.isProposed
                        ? {
                            backgroundColor: `${colors.accent}1A`,
                            borderLeftColor: colors.accent,
                          }
                        : i % 2 !== 0
                        ? { backgroundColor: colors.sectionBg }
                        : undefined
                    }
                  >
                    <TableCell className="font-body text-sm" style={{ color: colors.primary }}>
                      {row.model}
                    </TableCell>
                    <TableCell className="font-body text-sm text-center text-gray-600">{row.accuracy}</TableCell>
                    <TableCell className="font-body text-sm text-center text-gray-600">{row.sensitivity}</TableCell>
                    <TableCell className="font-body text-sm text-center text-gray-600">{row.specificity}</TableCell>
                    <TableCell className="font-body text-sm text-center text-gray-600">{row.f1}</TableCell>
                    <TableCell className="font-body text-sm text-center text-gray-600">{row.auc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MetricsBlock;
