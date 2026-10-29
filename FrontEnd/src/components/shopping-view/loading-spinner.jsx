'use client';

import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <motion.div
        className="flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 1],
        }}
      >
        <img
          src="/logo.jpg"
          alt="Mobiletrends Systems Limited"
          className="w-32 h-32 object-contain rounded-lg"
        />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
