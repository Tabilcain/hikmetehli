import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect } from "react";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

export const GradientMesh = () => {
  const { lowPerformanceMode } = usePerformanceMode();
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const smoothX = useSpring(mouseX, { stiffness: 30, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 30, damping: 30 });

  useEffect(() => {
    if (lowPerformanceMode) return;

    const handler = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 100);
      mouseY.set((e.clientY / window.innerHeight) * 100);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [lowPerformanceMode, mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        className="absolute w-[640px] h-[640px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
          filter: lowPerformanceMode ? "blur(42px)" : "blur(90px)",
          left: lowPerformanceMode ? "50%" : smoothX,
          top: lowPerformanceMode ? "18%" : smoothY,
          x: "-50%",
          y: "-50%",
        }}
      />
      <motion.div
        className="absolute w-[480px] h-[480px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--accent) / 0.1) 0%, transparent 70%)",
          filter: lowPerformanceMode ? "blur(36px)" : "blur(80px)",
          right: lowPerformanceMode ? "12%" : smoothX,
          bottom: lowPerformanceMode ? "8%" : smoothY,
          x: "50%",
          y: "50%",
        }}
      />
      {!lowPerformanceMode && (
        <motion.div
          className="absolute w-[520px] h-[520px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--gold) / 0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, 120, -40, 0],
            y: [0, -90, 70, 0],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
};
