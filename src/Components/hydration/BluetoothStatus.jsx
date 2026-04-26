import {
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  Battery,
} from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function BluetoothStatus({
  supported, connected, deviceName,
  weightG, batteryPct, error,
  onConnect, onDisconnect, onTare,
}) {
  if (!supported) {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <BluetoothOff className="h-5 w-5 shrink-0" />
        <span>
          Bluetooth isn't available in this browser. Use Chrome on desktop or Android.
        </span>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-3 text-slate-700">
          <Bluetooth className="h-5 w-5" />
          <div className="text-sm">
            <div className="font-medium">Smart bottle not paired</div>
            {error && <div className="text-xs text-red-600">{error}</div>}
          </div>
        </div>
        <Button size="sm" onClick={onConnect}>Pair bottle</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3">
      <div className="flex items-center gap-3 text-emerald-900">
        <BluetoothConnected className="h-5 w-5" />
        <div className="text-sm">
          <div className="font-medium">{deviceName ?? 'Bottle'} connected</div>
          <div className="text-xs flex gap-3">
            <span>{weightG != null ? `${weightG} g` : '—'}</span>
            {batteryPct != null && (
              <span className="flex items-center gap-1">
                <Battery className="h-3 w-3" /> {batteryPct}%
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onTare}>Tare</Button>
        <Button size="sm" variant="ghost"   onClick={onDisconnect}>Disconnect</Button>
      </div>
    </div>
  );
}