import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bluetooth, BluetoothConnected, BluetoothSearching, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BluetoothStatus({ 
  isConnected, 
  bottleName, 
  batteryLevel, 
  onConnect, 
  onDisconnect,
  signalStrength = 3,
  firmwareVersion = "2.1.4",
  lastSync = new Date(),
  temperature = 18
}) {
  const [isSearching, setIsSearching] = useState(false);
  
  const handleConnect = async () => {
    setIsSearching(true);
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsSearching(false);
    onConnect?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 p-6"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl ${
            isConnected ? 'bg-cyan-500/20' : 'bg-slate-500/10'
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10">
        {/* Status header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${
              isConnected 
                ? 'bg-cyan-500/20' 
                : isSearching 
                  ? 'bg-amber-500/20' 
                  : 'bg-slate-500/20'
            }`}>
              <AnimatePresence mode="wait">
                {isSearching ? (
                  <motion.div
                    key="searching"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 180 }}
                  >
                    <BluetoothSearching className="w-6 h-6 text-amber-400 animate-pulse" />
                  </motion.div>
                ) : isConnected ? (
                  <motion.div
                    key="connected"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <BluetoothConnected className="w-6 h-6 text-cyan-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="disconnected"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Bluetooth className="w-6 h-6 text-slate-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div>
              <h3 className="text-white font-semibold">
                {isSearching ? 'Searching...' : isConnected ? bottleName : 'No Device'}
              </h3>
              <p className="text-slate-400 text-sm">
                {isSearching 
                  ? 'Looking for nearby bottles' 
                  : isConnected 
                    ? 'Connected via Bluetooth' 
                    : 'Tap to connect your bottle'}
              </p>
            </div>
          </div>
          
          {/* Connection indicator */}
          <div className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-cyan-400' : isSearching ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'
          }`}>
            {isConnected && (
              <motion.div
                className="w-full h-full rounded-full bg-cyan-400"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
        </div>

        {/* Battery and details when connected */}
        <AnimatePresence>
          {isConnected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="space-y-3">
                {/* Battery and Signal Row */}
                <div className="flex items-center gap-4 py-3 px-4 rounded-2xl bg-white/5">
                  <div className="flex-1">
                    <p className="text-slate-400 text-xs mb-1">Battery</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-700 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            batteryLevel > 20 ? 'bg-gradient-to-r from-cyan-500 to-cyan-400' : 'bg-rose-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${batteryLevel}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <span className="text-white text-sm font-medium">{batteryLevel}%</span>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Signal</p>
                    <div className="flex items-end gap-0.5">
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          className={`w-1.5 rounded-sm ${bar <= signalStrength ? 'bg-cyan-400' : 'bg-slate-600'}`}
                          style={{ height: bar * 4 + 4 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="py-3 px-3 rounded-xl bg-white/5 text-center">
                    <p className="text-slate-400 text-xs mb-0.5">Firmware</p>
                    <p className="text-white text-sm font-medium">v{firmwareVersion}</p>
                  </div>
                  <div className="py-3 px-3 rounded-xl bg-white/5 text-center">
                    <p className="text-slate-400 text-xs mb-0.5">Water Temp</p>
                    <p className="text-white text-sm font-medium">{temperature}°C</p>
                  </div>
                  <div className="py-3 px-3 rounded-xl bg-white/5 text-center">
                    <p className="text-slate-400 text-xs mb-0.5">Last Sync</p>
                    <p className="text-white text-sm font-medium">
                      {Math.floor((Date.now() - new Date(lastSync).getTime()) / 60000)}m ago
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action button */}
        <Button
          onClick={isConnected ? onDisconnect : handleConnect}
          disabled={isSearching}
          className={`w-full h-12 rounded-2xl font-semibold transition-all duration-300 ${
            isConnected
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              : 'bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-900'
          }`}
        >
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isConnected ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Disconnect
            </>
          ) : (
            <>
              <Bluetooth className="w-4 h-4 mr-2" />
              Connect Bottle
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}