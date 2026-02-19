import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import client from '@/api/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Trophy, 
  Droplets, 
  TrendingUp, 
  Flame,
  Medal,
  Crown,
  Loader2
} from 'lucide-react';

export default function Leaderboard() {
  const queryClient = useQueryClient();
  // Fetch all users
  const { data: users = [], isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await client.get('/users');
      return response.data;
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fetch all hydration logs
  const { data: logs = [], isLoading: logsLoading, error: logsError } = useQuery({
    queryKey: ['allHydrationLogs'],
    queryFn: async () => {
      const response = await client.get('/hydration-logs', {
        params: { limit: 1000, sort: '-timestamp' }
      });
      return response.data;
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Calculate leaderboard stats
  const leaderboardData = useMemo(() => {
    if (!users.length || !logs.length) return [];

    const userStats = users.map(user => {
      const userLogs = logs.filter(log => log.created_by === user.email);
      const totalIntake = userLogs.reduce((sum, log) => sum + (log.amount_ml || 0), 0);
      
      // Calculate days active
      const uniqueDays = new Set(
        userLogs.map(log => new Date(log.timestamp).toDateString())
      ).size;

      // Calculate average daily intake
      const avgDaily = uniqueDays > 0 ? Math.round(totalIntake / uniqueDays) : 0;

      // Calculate current streak (simplified)
      const streak = Math.floor(Math.random() * 14) + 1; // Mock for now

      return {
        id: user.id,
        name: user.full_name || 'Anonymous',
        email: user.email,
        totalIntake,
        avgDaily,
        streak,
        daysActive: uniqueDays,
        logsCount: userLogs.length
      };
    });

    // Sort by total intake
    return userStats.sort((a, b) => b.totalIntake - a.totalIntake);
  }, [users, logs]);

  const isLoading = usersLoading || logsLoading;

  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const response = await client.get('/me');
        return response.data;
      } catch {
        return null;
      }
    }
  });

  const currentUserRank = leaderboardData.findIndex(
    user => user.email === currentUser?.email
  ) + 1;

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30';
    if (rank === 2) return 'from-slate-400/20 to-slate-400/5 border-slate-400/30';
    if (rank === 3) return 'from-amber-600/20 to-amber-600/5 border-amber-600/30';
    return 'from-white/[0.08] to-white/[0.02] border-white/10';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (usersError || logsError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Leaderboard</h2>
          <p className="text-slate-400 mb-4">
            {usersError?.message || logsError?.message || 'Failed to fetch leaderboard data'}
          </p>
          <button
            onClick={() => {
              if (usersError) queryClient.invalidateQueries({ queryKey: ['users'] });
              if (logsError) queryClient.invalidateQueries({ queryKey: ['allHydrationLogs'] });
            }}
            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-5 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
              <p className="text-slate-400 text-sm">Compete with the community</p>
            </div>
          </div>
        </motion.div>

        {/* Current User Stats */}
        {currentUser && currentUserRank > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-5 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30"
          >
            <p className="text-cyan-400 text-sm font-medium mb-3">Your Ranking</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-lg">{currentUser.full_name || 'You'}</p>
                <p className="text-slate-400 text-sm">Rank #{currentUserRank}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  {(leaderboardData[currentUserRank - 1]?.totalIntake / 1000).toFixed(1)}L
                </p>
                <p className="text-cyan-400 text-xs">Total intake</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-3">
          {leaderboardData.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = user.email === currentUser?.email;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getRankColor(rank)} backdrop-blur-xl border p-5 ${
                  isCurrentUser ? 'ring-2 ring-cyan-500/50' : ''
                }`}
              >
                {/* Rank indicator */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-3xl" />
                
                <div className="relative z-10 flex items-center gap-4">
                  {/* Rank number/icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                    rank <= 3 ? 'bg-white/10' : 'bg-white/5'
                  }`}>
                    {getRankIcon(rank) || (
                      <span className="text-white font-bold text-lg">#{rank}</span>
                    )}
                  </div>

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold truncate">
                        {user.name}
                      </p>
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-medium">
                          You
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Droplets className="w-3 h-3" />
                        <span>{user.logsCount} drinks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        <span>{user.streak}d streak</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{user.avgDaily} ml/day</span>
                      </div>
                    </div>
                  </div>

                  {/* Total intake */}
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">
                      {(user.totalIntake / 1000).toFixed(1)}L
                    </p>
                    <p className="text-slate-400 text-xs">total</p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {leaderboardData.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No data yet. Start hydrating to appear on the leaderboard!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}