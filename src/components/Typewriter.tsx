import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface TypewriterProps {
  text: string;
  delay?: number;
  className?: string;
}

export const Typewriter = ({ text, delay = 0, className = "" }: TypewriterProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) => text.slice(0, latest));
  const showCursor = useMotionValue(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const controls = animate(count, text.length, {
        type: "tween",
        duration: text.length * 0.07,
        ease: "linear",
        onComplete: () => {
          // Blink cursor then hide
          setTimeout(() => showCursor.set(false), 2000);
        },
      });
      return () => controls.stop();
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [count, text, delay, showCursor]);

  return (
    <span className={className}>
      <motion.span>{displayText}</motion.span>
      <motion.span
        className="inline-block w-[2px] h-[1em] ml-1 align-middle"
        style={{
          backgroundColor: "hsl(var(--gold) / 0.6)",
        }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "steps(2)" }}
      />
    </span>
  );
};
