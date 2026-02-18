import React from 'react';
import { motion } from 'framer-motion';

export default function BiometricCard({ icon: Icon, label, value, unit, trend, delay = 0 }) {
  const isPositive = trend && trend > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 p-5"
    >
      {/* Subtle glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-xl bg-cyan-500/10">
            <Icon className="w-5 h-5 text-cyan-400" />
          </div>
          {trend !== undefined && (
            <span className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        
        <p className="text-slate-400 text-sm mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white">{value}</span>
          {unit && <span className="text-cyan-400/60 text-sm">{unit}</span>}
        </div>
      </div>
    </motion.div>
  );
}