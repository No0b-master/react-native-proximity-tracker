import { ProximityTrackerConfig, OnDetectNearbyDeviceCallback } from './types';
declare class ProximityTracker {
    private config;
    private callback?;
    private subscription;
    /**
     * Configure the proximity tracker
     */
    configure(config: ProximityTrackerConfig): void;
    /**
     * Register callback when a nearby device is detected
     */
    onDetectNearbyDevice(callback: OnDetectNearbyDeviceCallback): void;
    /**
     * Start scanning for nearby devices
     */
    startScanning(): Promise<void>;
    /**
     * Stop scanning for nearby devices
     */
    stopScanning(): void;
}
declare const _default: ProximityTracker;
export default _default;
