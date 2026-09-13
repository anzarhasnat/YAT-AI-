"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomeScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the welcome screen after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#06130E] overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[rgba(16,185,129,0.15)] via-transparent to-transparent pointer-events-none"></div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center z-10"
          >
            <h1 className="text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-[#34d399] to-[#0ea5e9] mb-6">
              Welcome
            </h1>
            <p className="text-xl md:text-2xl text-[#86efac] max-w-lg mx-auto leading-relaxed">
              Experience the future of interview preparation with our intelligent, adaptive AI.
            </p>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#10b981] to-transparent mt-12"
          ></motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
