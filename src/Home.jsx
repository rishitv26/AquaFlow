import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '@/api/client';
import { useBottle } from '@/bluetooth/useBottle';
import BluetoothStatus from '@/Components/hydration/BluetoothStatus';

export default function Home() {
  const qc = useQueryClient();

  const logDrink = useMutation({
    mutationFn: (drink) =>
      client.post('/hydration-logs', {
        amount_ml: drink.amount_ml,
        timestamp: drink.timestamp,
        source:    'bottle_sync',
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hydration-logs'] }),
  });

  const bottle = useBottle({
    onDrink: (drink) => logDrink.mutate(drink),
  });

  return (
    <>
      {/* …existing Home content… */}

      <BluetoothStatus
        {...bottle}
        onConnect={bottle.connect}
        onDisconnect={bottle.disconnect}
        onTare={bottle.tare}
      />

      {/* …rest of Home… */}
    </>
  );
}