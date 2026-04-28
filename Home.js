import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import client from '@/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Droplets, 
  Flame, 
  Activity, 
  Clock, 
  Target, 
  TrendingUp,
  Sparkles
} from 'lucide-react';

import HydrationRing from '@/components/hydration/HydrationRing';
import BiometricCard from '@/components/hydration/BiometricCard';
import BluetoothStatus from '@/components/hydration/BluetoothStatus';
import IntakeChart from '@/components/hydration/IntakeChart';


export default function Home() {
  const [isBottleConnected, setIsBottleConnected] = useState(false);
  const [bottleBattery, setBottleBattery] = useState(85);
  const queryClient = useQueryClient();

  // Fetch today's logs
  const { data: todayLogs = [] } = useQuery({
    queryKey: ['hydrationLogs', 'today'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const response = await client.get('/hydration-logs', {
        params: { startDate: today.toISOString() }
      });
      return response.data;
    }
  });

  // Fetch user settings
  const { data: settings } = useQuery({
    queryKey: ['userSettings'],
    queryFn: async () => {
      const response = await client.get('/user-settings');
      return response.data[0] || { daily_goal_ml: 2500 };
    }
  });

  // Generate weekly data for chart
  const { data: weeklyData = [] } = useQuery({
    queryKey: ['weeklyData'],
    queryFn: async () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const today = new Date().getDay();
      
      // Generate sample data (in real app would fetch actual data)
      return days.map((day, index) => ({
        day,
        intake: index <= today 
          ? Math.floor(Math.random() * 1500) + 1500
          : 0
      }));
    }
  });

  // Add hydration mutation
  const addHydration = useMutation({
    mutationFn: async (amount) => {
      await client.post('/hydration-logs', {
        amount_ml: amount,
        timestamp: new Date().toISOString(),
        source: isBottleConnected ? 'bottle_sync' : 'manual'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hydrationLogs'] });
    }
  });

  const dailyGoal = settings?.daily_goal_ml || 2500;
  const totalToday = todayLogs.reduce((sum, log) => sum + (log.amount_ml || 0), 0);
  const hydrationPercentage = Math.min(100, (totalToday / dailyGoal) * 100);
  
  // Calculate biometrics
  const avgHourlyIntake = totalToday / Math.max(1, new Date().getHours());
  const remainingToGoal = Math.max(0, dailyGoal - totalToday);
  const hydrationScore = Math.min(100, Math.round(hydrationPercentage * 0.8 + 20));

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-32">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-5 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Droplets className="w-7 h-7 text-cyan-400" />
              AquaFlow
            </h1>
            <p className="text-slate-400 text-sm mt-1">Stay hydrated, stay healthy</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/20"
          >
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </motion.div>
        </motion.div>

        {/* Main hydration display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-10"
        >
          <HydrationRing percentage={hydrationPercentage} size={220} strokeWidth={14} />
          
          <div className="mt-8 text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-white">{totalToday}</span>
              <span className="text-cyan-400/60">/ {dailyGoal} ml</span>
            </div>
            <p className="text-slate-400 text-sm mt-2">
              {remainingToGoal > 0 
                ? `${remainingToGoal} ml to reach your goal`
                : "🎉 Daily goal achieved!"}
            </p>
          </div>
        </motion.div>

        {/* Biometric cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <BiometricCard
            icon={Target}
            label="Hydration Score"
            value={hydrationScore}
            unit="/100"
            trend={12}
            delay={0.1}
          />
          <BiometricCard
            icon={Flame}
            label="Streak"
            value={7}
            unit="days"
            delay={0.2}
          />
          <BiometricCard
            icon={Activity}
            label="Avg Intake"
            value={Math.round(avgHourlyIntake)}
            unit="ml/hr"
            delay={0.3}
          />
          <BiometricCard
            icon={Clock}
            label="Last Drink"
            value={todayLogs.length > 0 ? "12m" : "—"}
            unit="ago"
            delay={0.4}
          />
        </div>

        {/* Bluetooth connection */}
        <div className="mb-8">
          <BluetoothStatus
            isConnected={isBottleConnected}
            bottleName="Hydro Core"
            batteryLevel={bottleBattery}
            onConnect={() => setIsBottleConnected(true)}
            onDisconnect={() => setIsBottleConnected(false)}
          />
        </div>

        {/* Weekly chart */}
        <IntakeChart data={weeklyData} dailyGoal={dailyGoal} />

        {/* Insights section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-5 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-cyan-500/20">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Daily Insight</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {hydrationPercentage >= 80 
                  ? "Great job! You're well on track to meet your hydration goal today. Keep it up!"
                  : hydrationPercentage >= 50
                  ? "You're halfway there! Remember to drink water regularly throughout the day."
                  : "Time to hydrate! Try to drink more water to maintain optimal hydration levels."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>


    </div>
  );
}