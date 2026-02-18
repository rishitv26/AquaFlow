import React from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Droplets, 
  TrendingUp, 
  Calendar, 
  Award,
  Target,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-white font-semibold">{payload[0].value} ml</p>
      </div>
    );
  }
  return null;
};

const COLORS = ['#00D4FF', '#0099FF', '#00FFE0', '#64748b'];

export default function Statistics() {
  const { data: allLogs = [] } = useQuery({
    queryKey: ['allHydrationLogs'],
    queryFn: () => base44.entities.HydrationLog.list('-timestamp', 100)
  });

  const { data: settings } = useQuery({
    queryKey: ['userSettings'],
    queryFn: async () => {
      const allSettings = await base44.entities.UserSettings.list();
      return allSettings[0] || { daily_goal_ml: 2500 };
    }
  });

  const dailyGoal = settings?.daily_goal_ml || 2500;

  // Generate monthly data
  const monthlyData = React.useMemo(() => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    return weeks.map((week, index) => ({
      week,
      intake: Math.floor(Math.random() * 5000) + 12000,
      goal: dailyGoal * 7
    }));
  }, [dailyGoal]);

  // Source distribution (bottle sync vs manual)
  const sourceData = React.useMemo(() => {
    const bottleSync = allLogs.filter(log => log.source === 'bottle_sync').length;
    const manual = allLogs.filter(log => log.source === 'manual').length;
    const total = bottleSync + manual || 1;
    
    return [
      { name: 'Bottle Sync', value: Math.round((bottleSync / total) * 100) || 35 },
      { name: 'Manual', value: Math.round((manual / total) * 100) || 65 }
    ];
  }, [allLogs]);

  // Stats calculations
  const totalThisWeek = allLogs
    .filter(log => {
      const logDate = new Date(log.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return logDate >= weekAgo;
    })
    .reduce((sum, log) => sum + (log.amount_ml || 0), 0);

  const avgDaily = Math.round(totalThisWeek / 7);
  const goalAchievement = Math.round((avgDaily / dailyGoal) * 100);
  const currentStreak = 7; // Simulated

  const stats = [
    { 
      icon: Droplets, 
      label: 'This Week', 
      value: `${(totalThisWeek / 1000).toFixed(1)}L`, 
      color: 'text-cyan-400', 
      bg: 'bg-cyan-500/10' 
    },
    { 
      icon: Target, 
      label: 'Daily Average', 
      value: `${avgDaily}ml`, 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10' 
    },
    { 
      icon: TrendingUp, 
      label: 'Goal Rate', 
      value: `${goalAchievement}%`, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10' 
    },
    { 
      icon: Zap, 
      label: 'Streak', 
      value: `${currentStreak} days`, 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/10' 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-5 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link 
            to={createPageUrl('Home')}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Statistics</h1>
            <p className="text-slate-400 text-sm">Your hydration analytics</p>
          </div>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-slate-400 text-xs">{stat.label}</p>
              <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Monthly chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold text-lg">Monthly Progress</h3>
              <p className="text-slate-400 text-sm">Weekly breakdown</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-xs">This month</span>
            </div>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="week" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => `${value / 1000}L`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="intake" 
                  fill="url(#barGradient)" 
                  radius={[8, 8, 0, 0]}
                  maxBarSize={50}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D4FF" />
                    <stop offset="100%" stopColor="#0099FF" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Source distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 p-6 mb-8"
        >
          <h3 className="text-white font-semibold text-lg mb-6">Input Sources</h3>
          
          <div className="flex items-center gap-8">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex-1 space-y-3">
              {sourceData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-slate-400 text-sm">{item.name}</span>
                  </div>
                  <span className="text-white font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-amber-500/20">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-white font-semibold text-lg">Achievements</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { emoji: '💧', name: 'First Drop', unlocked: true },
              { emoji: '🔥', name: '7 Day Streak', unlocked: true },
              { emoji: '⚡', name: 'Speed Hydrator', unlocked: false },
              { emoji: '🏆', name: 'Champion', unlocked: false },
              { emoji: '🌊', name: 'Ocean Master', unlocked: false },
              { emoji: '⭐', name: 'Perfect Month', unlocked: false },
            ].map((achievement) => (
              <div 
                key={achievement.name}
                className={`p-3 rounded-2xl text-center transition-all ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30' 
                    : 'bg-white/5 border border-white/5 opacity-50'
                }`}
              >
                <span className="text-2xl">{achievement.emoji}</span>
                <p className="text-xs text-slate-400 mt-2">{achievement.name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}