import { motion } from "framer-motion";

interface IslamicPatternProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

export const IslamicPattern = ({ position, className = "" }: IslamicPatternProps) => {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
      className={`absolute ${positionClasses[position]} w-32 h-32 md:w-48 md:h-48 pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer diamond */}
        <path
          d="M100 10L190 100L100 190L10 100Z"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-primary/10"
          fill="none"
        />
        {/* Middle diamond */}
        <path
          d="M100 35L165 100L100 165L35 100Z"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-primary/8"
          fill="none"
        />
        {/* Inner diamond */}
        <path
          d="M100 60L140 100L100 140L60 100Z"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-primary/6"
          fill="none"
        />
        {/* Center star */}
        <path
          d="M100 75L115 100L100 125L85 100Z"
          stroke="currentColor"
          strokeWidth="0.3"
          className="text-primary/5"
          fill="none"
        />
        {/* Horizontal line */}
        <line
          x1="10"
          y1="100"
          x2="190"
          y2="100"
          stroke="currentColor"
          strokeWidth="0.3"
          className="text-primary/5"
        />
        {/* Vertical line */}
        <line
          x1="100"
          y1="10"
          x2="100"
          y2="190"
          stroke="currentColor"
          strokeWidth="0.3"
          className="text-primary/5"
        />
      </svg>
    </motion.div>
  );
};
