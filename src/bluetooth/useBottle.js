import { useEffect, useRef, useState, useCallback } from 'react';
import { BottleBLE } from './bottleBLE';
import { HydrationTracker } from './hydrationTracker';

/**
 * High-level bottle hook. Wires BLE -> HydrationTracker -> onDrink callback.
 *
 *   const bottle = useBottle({ onDrink: ({ amount_ml, timestamp }) => ... });
 */
export function useBottle({ onDrink, minDrinkMl = 5 } = {}) {
  const bleRef     = useRef(null);
  const trackerRef = useRef(null);
  const onDrinkRef = useRef(onDrink);
  onDrinkRef.current = onDrink;   // keep latest cb without retriggering effect

  const [supported,  setSupported]  = useState(BottleBLE.isSupported());
  const [connected,  setConnected]  = useState(false);
  const [deviceName, setDeviceName] = useState(null);
  const [weightG,    setWeightG]    = useState(null);
  const [batteryPct, setBatteryPct] = useState(null);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    bleRef.current = new BottleBLE();
    trackerRef.current = new HydrationTracker({
      minDrinkMl,
      onDrink: (ml) =>
        onDrinkRef.current?.({
          amount_ml: ml,
          timestamp: new Date().toISOString(),
        }),
    });

    const ble = bleRef.current;

    const onWeight  = (e) => {
      setWeightG(e.detail);
      trackerRef.current.push(e.detail);
    };
    const onBattery = (e) => setBatteryPct(e.detail);
    const onConn    = () => { setConnected(true);  setError(null); };
    const onDisc    = () => {
      setConnected(false);
      setWeightG(null);
      trackerRef.current.reset();      // fresh baseline next session
    };

    ble.addEventListener('weight',       onWeight);
    ble.addEventListener('battery',      onBattery);
    ble.addEventListener('connected',    onConn);
    ble.addEventListener('disconnected', onDisc);

    return () => {
      ble.removeEventListener('weight',       onWeight);
      ble.removeEventListener('battery',      onBattery);
      ble.removeEventListener('connected',    onConn);
      ble.removeEventListener('disconnected', onDisc);
      ble.disconnect().catch(() => {});
    };
  }, [minDrinkMl]);

  const connect = useCallback(async () => {
    setError(null);
    try {
      const name = await bleRef.current.connect();
      setDeviceName(name);
    } catch (err) {
      // User cancelling the chooser also throws — don't treat as a real error.
      if (err?.name === 'NotFoundError') return;
      setError(err.message ?? String(err));
    }
  }, []);

  const disconnect = useCallback(() => bleRef.current?.disconnect(), []);
  const tare       = useCallback(() => bleRef.current?.tare(),       []);

  return {
    supported, connected, deviceName,
    weightG, batteryPct, error,
    connect, disconnect, tare,
  };
}