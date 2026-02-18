import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import client from '@/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Target, 
  Bell, 
  Scale, 
  Droplets,
  Save,
  Check,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export default function Settings() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  
  const { data: settings, isLoading } = useQuery({
    queryKey: ['userSettings'],
    queryFn: async () => {
      const response = await client.get('/user-settings');
      return response.data[0] || null;
    }
  });

  const [formData, setFormData] = useState({
    daily_goal_ml: 2500,
    bottle_capacity_ml: 750,
    reminder_interval_minutes: 60,
    reminders_enabled: true,
    weight_kg: 70
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        daily_goal_ml: settings.daily_goal_ml || 2500,
        bottle_capacity_ml: settings.bottle_capacity_ml || 750,
        reminder_interval_minutes: settings.reminder_interval_minutes || 60,
        reminders_enabled: settings.reminders_enabled ?? true,
        weight_kg: settings.weight_kg || 70
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (settings?.id) {
        await client.put(`/user-settings/${settings.id}`, data);
      } else {
        await client.post('/user-settings', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  // Calculate recommended intake based on weight
  const recommendedIntake = Math.round(formData.weight_kg * 35);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
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
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-slate-400 text-sm">Personalize your experience</p>
          </div>
        </motion.div>

        {/* Daily Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-cyan-500/20">
              <Target className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Daily Goal</h3>
              <p className="text-slate-400 text-sm">Set your hydration target</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Target intake</span>
              <span className="text-white font-semibold">{formData.daily_goal_ml} ml</span>
            </div>
            
            <Slider
              value={[formData.daily_goal_ml]}
              onValueChange={(value) => setFormData({ ...formData, daily_goal_ml: value[0] })}
              min={1000}
              max={5000}
              step={100}
              className="w-full"
            />

            <div className="flex justify-between text-xs text-slate-500">
              <span>1L</span>
              <span>5L</span>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
              <p className="text-cyan-400 text-sm">
                💡 Based on your weight, we recommend <strong>{recommendedIntake}ml</strong> daily
              </p>
            </div>
          </div>
        </motion.div>

        {/* Body Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-blue-500/20">
              <Scale className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Body Metrics</h3>
              <p className="text-slate-400 text-sm">For personalized recommendations</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm mb-2 block">Weight (kg)</label>
              <Input
                type="number"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: parseInt(e.target.value) || 0 })}
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Bottle Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-emerald-500/20">
              <Droplets className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Bottle Settings</h3>
              <p className="text-slate-400 text-sm">Configure your bottle</p>
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-2 block">Bottle Capacity (ml)</label>
            <Input
              type="number"
              value={formData.bottle_capacity_ml}
              onChange={(e) => setFormData({ ...formData, bottle_capacity_ml: parseInt(e.target.value) || 0 })}
              className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
            />
          </div>
        </motion.div>

        {/* Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-amber-500/20">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Reminders</h3>
              <p className="text-slate-400 text-sm">Stay on track with notifications</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-white">Enable reminders</span>
              <Switch
                checked={formData.reminders_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, reminders_enabled: checked })}
              />
            </div>

            {formData.reminders_enabled && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-400 text-sm">Reminder interval</span>
                  <span className="text-white font-semibold">{formData.reminder_interval_minutes} min</span>
                </div>
                
                <Slider
                  value={[formData.reminder_interval_minutes]}
                  onValueChange={(value) => setFormData({ ...formData, reminder_interval_minutes: value[0] })}
                  min={15}
                  max={120}
                  step={15}
                  className="w-full"
                />

                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>15 min</span>
                  <span>2 hrs</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className={`w-full h-14 rounded-2xl font-semibold text-lg transition-all duration-300 ${
              saved 
                ? 'bg-emerald-500 hover:bg-emerald-500'
                : 'bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-900'
            }`}
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : saved ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}