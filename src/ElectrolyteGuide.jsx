import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Droplets, Zap, Heart, Brain, Gauge, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import client from '@/api/client';

export default function ElectrolyteGuide() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['userSettings'],
    queryFn: async () => {
      const response = await client.get('/user-settings');
      return response.data[0] || { user_mode: 'default' };
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  const userMode = settings?.user_mode || 'default';
  const electrolytes = [
    {
      name: 'Sodium (Na+)',
      icon: Gauge,
      color: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
      textColor: 'text-blue-400',
      functions: [
        'Maintains fluid balance',
        'Supports nerve transmission',
        'Regulates blood pressure',
        'Essential for muscle contractions'
      ],
      sources: ['Salt, cheese, bread', 'Cured meats', 'Salted nuts', 'Sports drinks']
    },
    {
      name: 'Potassium (K+)',
      icon: Heart,
      color: 'from-red-500/20 to-red-500/5 border-red-500/30',
      textColor: 'text-red-400',
      functions: [
        'Regulates heartbeat',
        'Controls muscle contractions',
        'Balances fluid and electrolytes',
        'Reduces blood pressure'
      ],
      sources: ['Bananas', 'Potatoes', 'Spinach', 'Avocados', 'Coconut water']
    },
    {
      name: 'Calcium (Ca2+)',
      icon: Droplets,
      color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
      textColor: 'text-emerald-400',
      functions: [
        'Builds strong bones and teeth',
        'Essential for muscle function',
        'Supports nerve transmission',
        'Aids blood clotting'
      ],
      sources: ['Milk', 'Yogurt', 'Cheese', 'Leafy greens', 'Tofu']
    },
    {
      name: 'Magnesium (Mg2+)',
      icon: Brain,
      color: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
      textColor: 'text-purple-400',
      functions: [
        'Protein synthesis',
        'Energy production',
        'Muscle and nerve function',
        'Regulates blood sugar'
      ],
      sources: ['Nuts and seeds', 'Leafy greens', 'Whole grains', 'Dark chocolate']
    },
    {
      name: 'Chloride (Cl-)',
      icon: Zap,
      color: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30',
      textColor: 'text-cyan-400',
      functions: [
        'Maintains proper hydration',
        'Supports stomach acid production',
        'Aids nutrient absorption',
        'Balances pH levels'
      ],
      sources: ['Salt', 'Seaweed', 'Olives', 'Tomatoes']
    }
  ];

  const tips = [
    { title: '💧 Stay Hydrated', description: 'Balance water intake with electrolyte-rich foods and drinks' },
    { title: '🏃 Post-Workout', description: 'Replenish electrolytes after intense exercise or sweating' },
    { title: '⚖️ Balance Intake', description: 'Avoid excessive salt; aim for natural electrolyte sources' },
    { title: '🥤 Sports Drinks', description: 'Consider electrolyte drinks during prolonged intense activity' },
    { title: '🏥 Listen to Body', description: 'Cramping or fatigue may indicate electrolyte imbalance' },
    { title: '🌡️ Seasonal Needs', description: 'Increase electrolyte intake during hot weather or intense training' }
  ];

  // Mode-specific recommendations
  const modeRecommendations = {
    athlete: {
      title: '🏃 Athlete Mode Recommendations',
      description: 'Optimized for high-intensity training and recovery',
      color: 'from-red-500/20 to-red-500/5 border-red-500/30',
      tips: [
        { title: '⚡ Pre-Workout', description: 'Consume electrolytes 2-3 hours before training (200-300mg sodium)' },
        { title: '💪 During Exercise', description: 'Take electrolyte drinks every 20-30 minutes during intense sessions' },
        { title: '🔄 Post-Workout Recovery', description: 'Replenish within 30 mins: 3-4mg sodium per kg body weight' },
        { title: '🏋️ Strength Training', description: 'Extra potassium needed (900mg+) for muscle repair and protein synthesis' },
        { title: '🥵 Heavy Sweating', description: 'Increase sodium intake by 500mg-1000mg on high-sweat training days' },
        { title: '📊 Monitor Performance', description: 'Track cramping, fatigue, or dizziness to optimize electrolyte intake' }
      ]
    },
    student: {
      title: '📚 Student Mode Recommendations',
      description: 'Designed for busy study schedules and mental focus',
      color: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
      tips: [
        { title: '🧠 Mental Focus', description: 'Magnesium (400mg+) supports concentration and reduces brain fog' },
        { title: '☕ Caffeine Balance', description: 'Pair coffee with electrolytes to prevent dehydration and jitters' },
        { title: '🌙 All-Nighter Support', description: 'Potassium-rich snacks (bananas, nuts) for sustained energy' },
        { title: '⏰ Study Breaks', description: 'Hydrate with electrolytes every 1-2 hours during study sessions' },
        { title: '😰 Stress Management', description: 'Calcium and magnesium help reduce stress and anxiety' },
        { title: '💤 Better Sleep', description: 'Magnesium in evening (not coffee-based drinks) improves sleep quality' }
      ]
    },
    professional: {
      title: '💼 Professional Mode Recommendations',
      description: 'Tailored for desk-based work and sustained energy',
      color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
      tips: [
        { title: '☀️ Morning Routine', description: 'Start with mineral water & citrus for morning energy (120mg sodium)' },
        { title: '☕ Afternoon Energy Slump', description: 'Prevent 3pm slump with potassium-rich snack + water' },
        { title: '💼 Desk Hydration', description: 'Keep coconut water or electrolyte drink at desk; sip every 1-2 hours' },
        { title: '🍽️ Lunch Strategy', description: 'Include salt in lunch to maintain afternoon focus and alertness' },
        { title: '🎯 Sustained Performance', description: 'Magnesium (400mg) supports attention span and mental clarity' },
        { title: '🚶 Movement Breaks', description: 'Hydrate and electrolyte-up during walking meetings for better mood' }
      ]
    },
    default: {
      title: '⚙️ General Recommendations',
      description: 'Balanced electrolyte approach for everyday health',
      color: 'from-white/[0.08] to-white/[0.02] border-white/10',
      tips: [
        { title: '💧 Daily Hydration', description: 'Drink 8-10 glasses of water daily with natural electrolyte sources' },
        { title: '🍎 Balanced Diet', description: 'Include fruits, vegetables, and whole grains for daily electrolytes' },
        { title: '🧂 Salt Intake', description: 'Use salt naturally in food; aim for 2-3g sodium per day' },
        { title: '🥛 Dairy & Alternatives', description: 'Include milk or fortified alternatives for calcium intake' },
        { title: '🥗 Plant-Based', description: 'Leafy greens, legumes provide crucial magnesium and potassium' },
        { title: '📅 Consistency', description: 'Maintain steady electrolyte intake throughout the day' }
      ]
    }
  };

  const currentMode = modeRecommendations[userMode] || modeRecommendations.default;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
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
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Zap className="w-7 h-7 text-yellow-400" />
              Electrolyte Guide
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {userMode === 'athlete' && '🏃 Personalized for Athlete training profiles'}
              {userMode === 'student' && '📚 Personalized for Student lifestyles'}
              {userMode === 'professional' && '💼 Personalized for Professional work'}
              {userMode === 'default' && 'General electrolyte tracking guidance'}
            </p>
          </div>
        </motion.div>

        {/* Intro Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 p-6 mb-8"
        >
          <p className="text-slate-300 leading-relaxed">
            Electrolytes are minerals that carry electric charges and are essential for proper hydration, muscle function, and overall health. They work together to regulate fluid balance, nerve impulses, and muscle contractions.
          </p>
          <p className="text-slate-400 text-sm mt-4">
            The main electrolytes your body needs are sodium, potassium, calcium, magnesium, and chloride.
          </p>
        </motion.div>

        {/* Main Electrolytes */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Droplets className="w-6 h-6 text-cyan-400" />
            Essential Electrolytes
          </h2>
          
          <div className="space-y-4">
            {electrolytes.map((electrolyte, idx) => {
              const Icon = electrolyte.icon;
              return (
                <motion.div
                  key={electrolyte.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.05 }}
                  className={`rounded-2xl bg-gradient-to-br ${electrolyte.color} backdrop-blur-xl border p-5`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl bg-white/5 flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${electrolyte.textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${electrolyte.textColor} mb-2`}>
                        {electrolyte.name}
                      </h3>
                      
                      <div className="mb-3">
                        <p className="text-slate-400 text-sm font-medium mb-1">Functions:</p>
                        <ul className="space-y-1">
                          {electrolyte.functions.map((fn, i) => (
                            <li key={i} className="text-slate-300 text-xs flex items-start gap-2">
                              <span className="text-cyan-400 mt-0.5">•</span>
                              <span>{fn}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Food Sources:</p>
                        <div className="flex flex-wrap gap-2">
                          {electrolyte.sources.map((source, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-full bg-white/5 text-slate-300 text-xs border border-white/10"
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mode-Specific Recommendations */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`rounded-3xl bg-gradient-to-br ${currentMode.color} backdrop-blur-xl border p-6 mb-6`}
          >
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              {currentMode.title}
            </h2>
            <p className="text-slate-300 text-sm">{currentMode.description}</p>
          </motion.div>

          <h3 className="text-lg font-bold text-white mb-4">
            {userMode === 'athlete' && '⚡ Training-Focused Strategies'}
            {userMode === 'student' && '🧠 Study & Focus Optimization'}
            {userMode === 'professional' && '💼 Workplace Performance Tips'}
            {userMode === 'default' && '📋 Daily Best Practices'}
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {currentMode.tips.map((tip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + idx * 0.05 }}
                className="rounded-2xl bg-gradient-to-r from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 p-4"
              >
                <p className="font-semibold text-white text-sm mb-1">{tip.title}</p>
                <p className="text-slate-400 text-xs">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Water Additives Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Droplets className="w-6 h-6 text-cyan-400" />
            Popular Water Additives
          </h2>

          <div className="space-y-4">
            {/* Lemon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 backdrop-blur-xl border p-5"
            >
              <h3 className="text-yellow-400 font-semibold mb-3">🍋 Lemon Water</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">What It Adds:</p>
                  <p className="text-slate-300 text-xs">Vitamin C, citric acid, potassium, polyphenols</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Benefits:</p>
                  <ul className="space-y-1">
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-yellow-400">✓</span>Enhances water absorption</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-yellow-400">✓</span>Boosts vitamin C intake & immunity</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-yellow-400">✓</span>Aids digestion and detoxification</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-yellow-400">✓</span>Improves taste, encourages hydration</li>
                  </ul>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Disadvantages:</p>
                  <ul className="space-y-1">
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>Can erode tooth enamel (acidic)</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>May cause heartburn in sensitive individuals</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>Photosensitivity with certain skin conditions</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Coconut Water */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/30 backdrop-blur-xl p-5"
            >
              <h3 className="text-orange-400 font-semibold mb-3">🥥 Coconut Water</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">What It Adds:</p>
                  <p className="text-slate-300 text-xs">Potassium, sodium, magnesium, calcium, natural electrolytes</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Benefits:</p>
                  <ul className="space-y-1">
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-orange-400">✓</span>Natural electrolyte replacement</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-orange-400">✓</span>Ideal for post-workout recovery</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-orange-400">✓</span>Better than sport drinks (no artificial additives)</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-orange-400">✓</span>High in antioxidants</li>
                  </ul>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Disadvantages:</p>
                  <ul className="space-y-1">
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>High in natural sugars (6-9g per cup)</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>More expensive than plain water</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>May cause digestive issues in excess</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>Lower sodium than sports drinks</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Apple Cider Vinegar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 backdrop-blur-xl p-5"
            >
              <h3 className="text-amber-400 font-semibold mb-3">🍎 Apple Cider Vinegar (ACV) Water</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">What It Adds:</p>
                  <p className="text-slate-300 text-xs">Acetic acid, probiotics, potassium, enzymes</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Benefits:</p>
                  <ul className="space-y-1">
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-amber-400">✓</span>Improves blood sugar regulation</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-amber-400">✓</span>Aids digestion & gut health</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-amber-400">✓</span>May improve metabolism</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-amber-400">✓</span>Very affordable & shelf-stable</li>
                  </ul>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Disadvantages:</p>
                  <ul className="space-y-1">
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>Strong, unpleasant taste for many</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>Can erode tooth enamel (highly acidic)</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>May cause throat burning if undiluted</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>Not ideal for pre-workout (acidic)</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Chia Seeds */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="rounded-2xl bg-gradient-to-br from-slate-500/20 to-slate-500/5 border border-slate-500/30 backdrop-blur-xl p-5"
            >
              <h3 className="text-slate-300 font-semibold mb-3">🌱 Chia Seed Water</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">What It Adds:</p>
                  <p className="text-slate-300 text-xs">Fiber, omega-3 fatty acids, protein, calcium, magnesium, potassium</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Benefits:</p>
                  <ul className="space-y-1">
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-slate-300">✓</span>Absorbs 10x its weight in water (hydrating)</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-slate-300">✓</span>Sustained energy release (perfect pre-workout)</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-slate-300">✓</span>High in plant-based protein & omega-3s</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-slate-300">✓</span>Great for satiety and digestion</li>
                  </ul>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Disadvantages:</p>
                  <ul className="space-y-1">
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>Takes 15-20 min to absorb water properly</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>Texture can be off-putting to some</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>Can cause bloating if consumed too quickly</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>More expensive per serving</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Orange Water */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/30 backdrop-blur-xl p-5"
            >
              <h3 className="text-orange-300 font-semibold mb-3">🍊 Orange Water/Fresh OJ</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">What It Adds:</p>
                  <p className="text-slate-300 text-xs">Vitamin C, folate, potassium, natural sugars, antioxidants, fiber (if pulp included)</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Benefits:</p>
                  <ul className="space-y-1">
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-orange-400">✓</span>Excellent source of vitamin C (immunity)</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-orange-400">✓</span>Natural sugars for quick energy</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-orange-400">✓</span>Good potassium content for electrolytes</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-orange-400">✓</span>Great taste, encourages hydration</li>
                  </ul>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Disadvantages:</p>
                  <ul className="space-y-1">
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>High sugar content (12-15g per 8oz cup)</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>Can erode tooth enamel (acidic)</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>Not ideal for blood sugar control</li>
                    <li className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400">✗</span>Processed OJ lacks fiber of whole fruit</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Warning Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 backdrop-blur-xl border border-amber-500/30 p-5 mb-8"
        >
          <p className="text-amber-400 font-semibold mb-2">⚠️ Important Note</p>
          <p className="text-amber-300/80 text-sm leading-relaxed">
            While electrolytes are essential, excessive intake can be harmful. Maintain balance through a varied diet of whole foods. If you experience severe symptoms like extreme thirst, weakness, or irregular heartbeat, consult a healthcare professional.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
