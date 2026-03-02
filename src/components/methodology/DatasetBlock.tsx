import { motion } from "framer-motion";
import { methodologyData } from "@/data/methodologyData";

const DatasetBlock = () => {
  const { dataset, colors } = methodologyData;

  const statPills = [
    { value: dataset.totalImages.toLocaleString(), label: "Total Images" },
    { value: dataset.cancerImages.toLocaleString(), label: "Cancer Cases" },
    { value: dataset.normalImages.toLocaleString(), label: "Normal Cases" },
  ];

  return (
    <section className="py-section" style={{ backgroundColor: colors.sectionBg }}>
      <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left — Dataset Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap gap-3 mb-6">
            {statPills.map((pill, i) => (
              <div
                key={i}
                className="bg-white rounded-full px-4 py-2 border flex flex-col items-center min-w-[120px]"
                style={{ borderColor: colors.accent }}
              >
                <span className="font-display font-bold text-lg" style={{ color: colors.primary }}>
                  {pill.value}
                </span>
                <span className="font-body font-light text-xs text-gray-500">
                  {pill.label}
                </span>
              </div>
            ))}
          </div>

          <p className="font-body font-light text-sm text-gray-500 mb-3">
            Source: {dataset.source}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-block bg-yellow-50 text-xs px-3 py-1 rounded-full font-body" style={{ color: colors.primary }}>
              {dataset.imbalanceRatio}
            </span>
            <span className="inline-block bg-gray-100 text-xs px-3 py-1 rounded-full font-body text-gray-600">
              {dataset.imageSize}
            </span>
            <span className="inline-block bg-gray-100 text-xs px-3 py-1 rounded-full font-body text-gray-600">
              Test Set: {dataset.testSetSize}
            </span>
          </div>
        </motion.div>

        {/* Right — Preprocessing Steps */}
        <div className="flex flex-col gap-4">
          {dataset.preprocessingSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="flex items-start gap-4"
            >
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: colors.accent }}
              >
                {i + 1}
              </div>
              <div>
                <p className="font-body font-semibold text-sm" style={{ color: colors.primary }}>
                  {step.label}
                </p>
                <p className="font-body font-light text-sm text-gray-500 mt-1">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DatasetBlock;
