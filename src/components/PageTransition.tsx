import { motion } from "framer-motion";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const { lowPerformanceMode } = usePerformanceMode();

  return (
    <motion.div
      initial={{ opacity: lowPerformanceMode ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: lowPerformanceMode ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};
