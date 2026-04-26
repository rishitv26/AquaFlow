import { BOTTLE_BLE, CMD } from './protocol';

/**
 * Web Bluetooth wrapper for the AquaFlow bottle peripheral.
 * Events: 'weight' (grams), 'battery' (0-100), 'connected', 'disconnected'.
 */
export class BottleBLE extends EventTarget {
  constructor() {
    super();
    this.device = null;
    this.weightChar = null;
    this.batteryChar = null;
    this.commandChar = null;
  }

  static isSupported() {
    return typeof navigator !== 'undefined' && !!navigator.bluetooth;
  }

  get connected() {
    return !!this.device?.gatt?.connected;
  }

  async connect() {
    if (!BottleBLE.isSupported()) {
      throw new Error(
        'Web Bluetooth is not supported in this browser. Use Chrome on desktop or Android.'
      );
    }

    // Filter by name prefix; service is also advertised so it's discoverable either way.
    this.device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: BOTTLE_BLE.DEVICE_NAME_PREFIX }],
      optionalServices: [BOTTLE_BLE.SERVICE_UUID],
    });

    this.device.addEventListener('gattserverdisconnected', this._onDisconnect);

    const server = await this.device.gatt.connect();
    const svc    = await server.getPrimaryService(BOTTLE_BLE.SERVICE_UUID);

    this.weightChar  = await svc.getCharacteristic(BOTTLE_BLE.WEIGHT_UUID);
    this.batteryChar = await svc.getCharacteristic(BOTTLE_BLE.BATTERY_UUID);
    this.commandChar = await svc.getCharacteristic(BOTTLE_BLE.COMMAND_UUID);

    this.weightChar.addEventListener('characteristicvaluechanged', this._onWeight);
    this.batteryChar.addEventListener('characteristicvaluechanged', this._onBattery);

    await this.weightChar.startNotifications();
    await this.batteryChar.startNotifications();

    // Initial battery read so UI isn't blank until first notify.
    try {
      const v = await this.batteryChar.readValue();
      this._emitBattery(v);
    } catch { /* non-fatal */ }

    this.dispatchEvent(new Event('connected'));
    return this.device.name ?? 'AquaFlow Bottle';
  }

  async disconnect() {
    if (this.device?.gatt?.connected) this.device.gatt.disconnect();
  }

  tare()   { return this._sendCmd(CMD.TARE); }
  reboot() { return this._sendCmd(CMD.REBOOT); }

  _sendCmd(byte) {
    if (!this.commandChar) return Promise.reject(new Error('not connected'));
    // writeValue (with response) is the most broadly compatible; switch to
    // writeValueWithoutResponse if you ever need lower latency.
    return this.commandChar.writeValue(new Uint8Array([byte]));
  }

  _onWeight = (e) => {
    const dv = e.target.value;            // DataView
    const grams = dv.getInt32(0, true);   // little-endian, matches firmware
    this.dispatchEvent(new CustomEvent('weight', { detail: grams }));
  };

  _onBattery = (e) => this._emitBattery(e.target.value);

  _emitBattery(dv) {
    const pct = dv.getUint8(0);
    this.dispatchEvent(new CustomEvent('battery', { detail: pct }));
  }

  _onDisconnect = () => {
    this.dispatchEvent(new Event('disconnected'));
  };
}