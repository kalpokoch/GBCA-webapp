import { motion } from "framer-motion";
import { MdCloudUpload, MdTune, MdMemory, MdShowChart, MdArrowForward, MdArrowDownward } from "react-icons/md";
import { methodologyData } from "@/data/methodologyData";
import type { WorkflowStep } from "@/data/methodologyData";

const iconMap: Record<string, React.ElementType> = {
  "upload-cloud": MdCloudUpload,
  sliders: MdTune,
  cpu: MdMemory,
  activity: MdShowChart,
};

const StepCard = ({ step, index }: { step: WorkflowStep; index: number }) => {
  const { colors } = methodologyData;
  const Icon = iconMap[step.icon];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: index * 0.15 }}
      className="bg-white rounded-2xl shadow-md p-6 text-center flex-1 relative"
    >
      <div
        className="absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: colors.accent }}
      >
        {step.step}
      </div>
      {Icon && (
        <div className="flex justify-center mb-3">
          <Icon size={32} style={{ color: colors.primary }} />
        </div>
      )}
      <p className="font-body font-semibold" style={{ color: colors.primary }}>
        {step.label}
      </p>
      <p className="font-body font-light text-sm text-gray-500 mt-2">
        {step.description}
      </p>
    </motion.div>
  );
};

const WorkflowDiagram = () => {
  const { workflow, colors } = methodologyData;

  return (
    <section className="py-section bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Desktop horizontal */}
        <div className="hidden md:flex items-stretch gap-0">
          {workflow.map((step, i) => (
            <div key={i} className="flex items-center flex-1">
              <StepCard step={step} index={i} />
              {i < workflow.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3 }}
                  className="mx-2 flex-shrink-0"
                >
                  <MdArrowForward size={24} style={{ color: colors.accent }} />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile vertical */}
        <div className="flex md:hidden flex-col gap-2">
          {workflow.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <StepCard step={step} index={i} />
              {i < workflow.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3 }}
                  className="my-2"
                >
                  <MdArrowDownward size={24} style={{ color: colors.accent }} />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowDiagram;
