// Must match firmware UUIDs exactly.
export const BOTTLE_BLE = {
  SERVICE_UUID:       '7a0247e7-8e88-409b-a959-ab5092ddb03e',
  WEIGHT_UUID:        '7a0247e7-8e88-409b-a959-ab5092ddb03f',
  BATTERY_UUID:       '7a0247e7-8e88-409b-a959-ab5092ddb040',
  COMMAND_UUID:       '7a0247e7-8e88-409b-a959-ab5092ddb041',
  DEVICE_NAME_PREFIX: 'AquaFlow',
};

export const CMD = {
  TARE:   0x01,
  REBOOT: 0x02,
};