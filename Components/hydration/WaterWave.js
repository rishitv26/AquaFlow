import React from 'react';
import { motion } from 'framer-motion';

export default function WaterWave({ level = 50, bottleCapacity = 750 }) {
  const fillPercentage = Math.min(100, Math.max(0, level));
  
  return (
    <div className="relative w-32 h-56 mx-auto">
      {/* Bottle outline */}
      <div className="absolute inset-0 rounded-3xl border-2 border-cyan-500/30 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm overflow-hidden">
        {/* Bottle neck */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-6 rounded-t-xl border-2 border-cyan-500/30 border-b-0 bg-slate-900/80" />
        
        {/* Water fill */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500/80 via-cyan-400/60 to-cyan-300/40"
          initial={{ height: 0 }}
          animate={{ height: `${fillPercentage}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Wave animation */}
          <svg 
            className="absolute -top-3 left-0 w-full h-6" 
            viewBox="0 0 128 24" 
            preserveAspectRatio="none"
          >
            <motion.path
              fill="rgba(0, 212, 255, 0.6)"
              animate={{
                d: [
                  "M0 12 Q16 6, 32 12 T64 12 T96 12 T128 12 V24 H0 Z",
                  "M0 12 Q16 18, 32 12 T64 12 T96 12 T128 12 V24 H0 Z",
                  "M0 12 Q16 6, 32 12 T64 12 T96 12 T128 12 V24 H0 Z",
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </svg>
          
          {/* Bubbles */}
          <motion.div 
            className="absolute bottom-2 left-4 w-2 h-2 rounded-full bg-white/40"
            animate={{ y: [-10, -60], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          <motion.div 
            className="absolute bottom-4 right-6 w-1.5 h-1.5 rounded-full bg-white/30"
            animate={{ y: [-5, -50], opacity: [0.5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
          />
        </motion.div>
      </div>
      
      {/* Capacity label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
        <span className="text-xl font-semibold text-white">{Math.round(bottleCapacity * fillPercentage / 100)}</span>
        <span className="text-cyan-400/60 text-sm ml-1">ml</span>
      </div>
    </div>
  );
}