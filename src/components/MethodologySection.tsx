import { motion } from "framer-motion";
import { methodologyData } from "@/data/methodologyData";
import DatasetBlock from "@/components/methodology/DatasetBlock";
import WorkflowDiagram from "@/components/methodology/WorkflowDiagram";
import ModelArchitecture from "@/components/methodology/ModelArchitecture";
import MetricsBlock from "@/components/methodology/MetricsBlock";
import ClosingBanner from "@/components/methodology/ClosingBanner";

const MethodologySection = () => {
  const { sectionHeading, sectionSubtext, colors } = methodologyData;

  return (
    <section id="methodology" className="bg-white">
      {/* Section Header */}
      <div className="py-section bg-white">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="font-display font-bold text-4xl"
            style={{ color: colors.primary }}
          >
            {sectionHeading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="font-body font-light text-lg text-gray-500 mt-4"
          >
            {sectionSubtext}
          </motion.p>
        </div>
      </div>

      <DatasetBlock />
      <WorkflowDiagram />
      {/* <ModelArchitecture /> */}
      {/* <MetricsBlock /> */}
      <ClosingBanner />
    </section>
  );
};

export default MethodologySection;
