import { motion } from "framer-motion";
import { Check, ArrowDown } from "lucide-react";
import { methodologyData } from "@/data/methodologyData";

const ModelArchitecture = () => {
  const { architecture, encoderStages, classificationHead, colors } = methodologyData;

  return (
    <section className="py-[120px]" style={{ backgroundColor: colors.sectionBg }}>
      <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left — Description */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="font-display font-bold text-2xl"
            style={{ color: colors.primary }}
          >
            {architecture.name}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-body font-light text-sm text-gray-600 mt-4"
          >
            {architecture.description}
          </motion.p>

          <ul className="mt-6 space-y-3">
            {architecture.highlights.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="flex items-start gap-2"
              >
                <Check size={16} className="flex-shrink-0 mt-0.5" style={{ color: colors.accent }} />
                <span className="font-body font-light text-sm text-gray-700">{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Right — Encoder Stages */}
        <div className="flex flex-col items-center gap-0">
          {encoderStages.map((stage, i) => (
            <div key={i} className="flex flex-col items-center w-full max-w-[320px]">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                className="bg-white rounded-xl p-4 shadow-md w-full border-l-4"
                style={{ borderLeftColor: colors.accent }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: colors.primary }}>
                      Stage {stage.stage}
                    </p>
                    <p className="font-body font-light text-xs text-gray-500">
                      {stage.channels} channels · {stage.resolution}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-body"
                    style={{
                      backgroundColor: `${colors.primary}1A`,
                      color: colors.primary,
                    }}
                  >
                    CBAM + MSAM
                  </span>
                </div>
              </motion.div>
              {i < encoderStages.length - 1 && (
                <ArrowDown size={18} className="my-1 text-gray-300" />
              )}
            </div>
          ))}

          {/* Classification Head */}
          <ArrowDown size={18} className="my-1 text-gray-300" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-gray-100 rounded-xl p-4 w-full max-w-[320px] text-center"
          >
            <p className="font-body font-light text-sm text-gray-600">
              {classificationHead}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ModelArchitecture;
