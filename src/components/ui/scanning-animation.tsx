import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface ScanningAnimationProps {
  /** Controls visibility of the animation */
  isVisible: boolean;
  /** Animation duration in seconds (default: 2.2) */
  duration?: number;
  /** Color of the scan line and brackets - uses Tailwind color names (default: "cyan") */
  color?: "cyan" | "blue" | "green" | "purple" | "red" | "yellow" | "pink";
  /** Show corner brackets (default: true) */
  showBrackets?: boolean;
  /** Show dim overlay background (default: true) */
  showDimOverlay?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
}

const colorMap = {
  cyan: {
    line: "via-cyan-400",
    shadow: "shadow-[0_0_12px_4px_rgba(34,211,238,0.6)]",
    bracket: "border-cyan-400"
  },
  blue: {
    line: "via-blue-400",
    shadow: "shadow-[0_0_12px_4px_rgba(59,130,246,0.6)]",
    bracket: "border-blue-400"
  },
  green: {
    line: "via-green-400",
    shadow: "shadow-[0_0_12px_4px_rgba(34,197,94,0.6)]",
    bracket: "border-green-400"
  },
  purple: {
    line: "via-purple-400",
    shadow: "shadow-[0_0_12px_4px_rgba(168,85,247,0.6)]",
    bracket: "border-purple-400"
  },
  red: {
    line: "via-red-400",
    shadow: "shadow-[0_0_12px_4px_rgba(248,113,113,0.6)]",
    bracket: "border-red-400"
  },
  yellow: {
    line: "via-yellow-400",
    shadow: "shadow-[0_0_12px_4px_rgba(250,204,21,0.6)]",
    bracket: "border-yellow-400"
  },
  pink: {
    line: "via-pink-400",
    shadow: "shadow-[0_0_12px_4px_rgba(244,114,182,0.6)]",
    bracket: "border-pink-400"
  }
};

export const ScanningAnimation: React.FC<ScanningAnimationProps> = ({
  isVisible,
  duration = 2.2,
  color = "cyan",
  showBrackets = true,
  showDimOverlay = true,
  className = ""
}) => {
  const colors = colorMap[color];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="scan-overlay"
          className={`absolute inset-0 rounded-xl overflow-hidden pointer-events-none ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dim tint */}
          {showDimOverlay && (
            <div className="absolute inset-0 bg-black/20 rounded-xl" />
          )}

          {/* Scan line */}
          <motion.div
            className={`absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent ${colors.line} to-transparent ${colors.shadow}`}
            initial={{ top: "0%" }}
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration, repeat: Infinity, ease: "linear" }}
          />

          {/* Corner brackets */}
          {showBrackets && (
            <>
              <div className={`absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 ${colors.bracket} rounded-tl`} />
              <div className={`absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 ${colors.bracket} rounded-tr`} />
              <div className={`absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 ${colors.bracket} rounded-bl`} />
              <div className={`absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 ${colors.bracket} rounded-br`} />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
