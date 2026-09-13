"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number }[]>([]);
  const bubbleIdCounter = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Create a bubble trail occasionally
      if (Math.random() > 0.6) {
        const id = bubbleIdCounter.current++;
        setBubbles((prev) => [...prev.slice(-15), { id, x: e.clientX, y: e.clientY }]);
        
        // Remove bubble after animation
        setTimeout(() => {
          setBubbles((prev) => prev.filter((b) => b.id !== id));
        }, 1000);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      // Check if we are hovering over an element we want to magnify
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor-magnify]")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Main Cursor / Magnifier */}
      <motion.div
        className="absolute w-12 h-12 rounded-full border border-[#10b981] flex items-center justify-center mix-blend-difference"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? "rgba(16, 185, 129, 0.1)" : "transparent",
          backdropFilter: isHovering ? "blur(4px)" : "none",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 28,
          mass: 0.5,
        }}
      >
        <motion.div 
          className="w-2 h-2 bg-[#34d399] rounded-full"
          animate={{
            scale: isHovering ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Bubble Trail */}
      <AnimatePresence>
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            initial={{ opacity: 0.6, scale: 0.2, x: bubble.x - 8, y: bubble.y - 8 }}
            animate={{ opacity: 0, scale: 1.5, y: bubble.y - 30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute w-4 h-4 rounded-full border border-[#34d399] opacity-50"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
