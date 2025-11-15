import { motion } from "framer-motion";

export function RisingSun() {
  return (
    <motion.div
      className="flex justify-center items-end h-32 md:h-40 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        className="md:w-[140px] md:h-[140px]"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <defs>
          <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(45, 100%, 60%)" />
            <stop offset="50%" stopColor="hsl(35, 100%, 55%)" />
            <stop offset="100%" stopColor="hsl(25, 100%, 50%)" />
          </radialGradient>
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(200, 95%, 55%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(200, 95%, 55%)" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Glow effect */}
        <circle cx="60" cy="60" r="45" fill="url(#glowGradient)" />
        
        {/* Sun rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <motion.line
            key={i}
            x1="60"
            y1="60"
            x2={60 + Math.cos((angle * Math.PI) / 180) * 50}
            y2={60 + Math.sin((angle * Math.PI) / 180) * 50}
            stroke="hsl(45, 100%, 60%)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 0.7, pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
          />
        ))}
        
        {/* Sun circle */}
        <motion.circle
          cx="60"
          cy="60"
          r="28"
          fill="url(#sunGradient)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </motion.svg>
    </motion.div>
  );
}
