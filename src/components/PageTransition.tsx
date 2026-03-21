import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const { lowPerformanceMode } = usePerformanceMode();
  const location = useLocation();
  const isPrimaryRoute = location.pathname === "/"
    || location.pathname.startsWith("/muasir")
    || location.pathname.startsWith("/selef-incileri")
    || location.pathname.startsWith("/sahabeden");

  if (lowPerformanceMode && isPrimaryRoute) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: lowPerformanceMode ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: lowPerformanceMode ? 0.12 : 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};
