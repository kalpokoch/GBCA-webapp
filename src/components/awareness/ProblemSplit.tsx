import { motion } from "framer-motion";
import { MdVisibilityOff, MdSchedule, MdMemory } from "react-icons/md";
import { awarenessData } from "@/data/awarenessData";
import type { ProblemBlock, Stage } from "@/data/awarenessData";

const iconMap: Record<string, React.ElementType> = {
  "eye-off": MdVisibilityOff,
  clock: MdSchedule,
  cpu: MdMemory,
};

const ProblemCard = ({ block, index }: { block: ProblemBlock; index: number }) => {
  const { colors } = awarenessData;
  const Icon = iconMap[block.icon];

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.15 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 flex items-start gap-4 transition-transform hover:scale-[1.02]"
    >
      <div
        className="flex-shrink-0 w-12 h-12 rounded-full border flex items-center justify-center p-3"
        style={{ borderColor: colors.accent, color: colors.accent }}
      >
        {Icon && <Icon size={20} />}
      </div>
      <div>
        <h3 className="font-body font-semibold text-base" style={{ color: colors.primary }}>
          {block.heading}
        </h3>
        <p className="font-body font-light text-sm text-gray-500 mt-1">
          {block.description}
        </p>
      </div>
    </motion.div>
  );
};

const StageCard = ({ stage, index }: { stage: Stage; index: number }) => {
  const { colors } = awarenessData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: 0.8 + index * 0.2 }}
      className={`rounded-2xl p-6 shadow-md text-center flex-1 ${
        stage.highlight
          ? "border-l-4 bg-[#FFF5F5]"
          : "bg-white"
      }`}
      style={stage.highlight ? { borderLeftColor: colors.danger } : undefined}
    >
      <p className="font-body font-bold" style={{ color: colors.primary }}>
        {stage.label}
      </p>
      <p className="font-body font-light text-sm text-gray-500 mt-2">
        {stage.description}
      </p>
    </motion.div>
  );
};

const ProblemSplit = () => {
  const { problemBlocks, stages, colors } = awarenessData;

  return (
    <section className="py-section" style={{ backgroundColor: colors.sectionBg }}>
      <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left — Problem Cards */}
        <div className="flex flex-col gap-6">
          {problemBlocks.map((block, i) => (
            <ProblemCard key={i} block={block} index={i} />
          ))}
        </div>

        {/* Right — Stage Progression */}
        <div>
          <p className="font-body font-light text-sm uppercase text-gray-400 tracking-wider mb-6">
            Understanding Progression
          </p>

          {/* Connecting line */}
          <div className="relative mb-4 h-[2px] rounded overflow-hidden" style={{ backgroundColor: `${colors.accent}22` }}>
            <motion.div
              className="absolute inset-y-0 left-0 h-full"
              style={{ backgroundColor: colors.accent }}
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {stages.map((stage, i) => (
              <StageCard key={i} stage={stage} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSplit;
