import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  const particles = Array.from({ length: 30 });

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#001F3F] to-[#0A2A4A]" />
      
      {particles.map((_, i) => {
        const size = Math.random() * 4 + 2;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20 blur-[1px]"
            style={{ width: size, height: size }}
            initial={{
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{
              y: [`${Math.random() * 100}vh`, `-10vh`],
              opacity: [0.1, 0.6, 0.1]
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
          />
        );
      })}
    </div>
  );
}
