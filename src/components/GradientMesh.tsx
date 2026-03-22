import { useEffect, useRef } from "react";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

export const GradientMesh = () => {
  const { lowPerformanceMode } = usePerformanceMode();
  const meshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lowPerformanceMode) return;

    const node = meshRef.current;
    if (!node) return;

    let frameId = 0;

    const updatePosition = (xPercent: number, yPercent: number) => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        node.style.setProperty("--mesh-x", `${xPercent}%`);
        node.style.setProperty("--mesh-y", `${yPercent}%`);
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      updatePosition(x, y);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [lowPerformanceMode]);

  if (lowPerformanceMode) {
    return null;
  }

  return (
    <div ref={meshRef} className="gradient-mesh fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="mesh-orb mesh-orb-primary" />
      <div className="mesh-orb mesh-orb-accent" />
      <div className="mesh-orb mesh-orb-gold" />
    </div>
  );
};
