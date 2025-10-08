// src/types.ts

export interface ProximityTrackerConfig {
  /** Signal strength threshold in dBm (e.g., -70) */
  threshold?: number;

  /** Enable low energy (battery saving) mode */
  lowEnergyMode?: boolean;

  /** Time interval between scans in milliseconds */
  scanInterval?: number;
}

export interface NearbyDevice {
  /** Public name of the detected device */
  name: string | null;

  /** MAC address or unique identifier */
  id: string;

  /** Received Signal Strength Indicator */
  rssi: number;

  /** Type of connection: BLE or WIFI */
  type: 'BLE' | 'WIFI';
}

/** Callback when a new nearby device is detected */
export type OnDetectNearbyDeviceCallback = (device: NearbyDevice) => void;
