import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Home, Trophy, Settings } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', icon: Home, path: createPageUrl('Home') },
    { name: 'Leaderboard', icon: Trophy, path: createPageUrl('Leaderboard') },
    { name: 'Settings', icon: Settings, path: createPageUrl('Settings') },
  ];

  const isActive = (path) => {
    const pageName = path.split('/').pop();
    return location.pathname.includes(pageName);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <style>{`
        :root {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
        }
        
        body {
          background-color: #0a0f1a;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 212, 255, 0.3);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 212, 255, 0.5);
        }
      `}</style>
      
      {children}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-lg mx-auto px-4 pb-4">
          <nav className="flex items-center justify-around px-6 py-3 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="relative flex flex-col items-center gap-1 px-4 py-2"
                >
                  {active && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-0 bg-cyan-500/20 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon className={`w-5 h-5 relative z-10 transition-colors ${
                    active ? 'text-cyan-400' : 'text-slate-500'
                  }`} />
                  <span className={`text-xs relative z-10 transition-colors ${
                    active ? 'text-cyan-400 font-medium' : 'text-slate-500'
                  }`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}