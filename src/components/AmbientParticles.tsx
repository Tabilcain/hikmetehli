import { motion } from "framer-motion";

const particles = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  size: Math.random() * 200 + 100,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 10 + 15,
  delay: Math.random() * 5,
}));

export const AmbientParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -25, 15, -10, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
            opacity: [0.4, 0.7, 0.5, 0.8, 0.4],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Gold accent orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 150,
          height: 150,
          right: "15%",
          top: "20%",
          background: `radial-gradient(circle, hsl(var(--gold) / 0.05) 0%, transparent 70%)`,
          filter: "blur(50px)",
        }}
        animate={{
          x: [0, -20, 15, 0],
          y: [0, 20, -15, 0],
          scale: [1, 1.3, 0.95, 1],
          opacity: [0.3, 0.6, 0.4, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
