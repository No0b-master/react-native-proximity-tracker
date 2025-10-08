// src/ProximityTracker.ts
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { 
  ProximityTrackerConfig, 
  NearbyDevice, 
  OnDetectNearbyDeviceCallback 
} from './types';
import { checkAndRequestPermissions } from './Permissions';

const { ProximityTrackerModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(ProximityTrackerModule);

class ProximityTracker {
  private config: ProximityTrackerConfig = {};
  private callback?: OnDetectNearbyDeviceCallback;
  private subscription: any;

  /**
   * Configure the proximity tracker
   */
  configure(config: ProximityTrackerConfig) {
    this.config = config;
    if (ProximityTrackerModule?.configure) {
      ProximityTrackerModule.configure(config);
    }
  }

  /**
   * Register callback when a nearby device is detected
   */
  onDetectNearbyDevice(callback: OnDetectNearbyDeviceCallback) {
    this.callback = callback;

    // Remove previous subscription if exists
    if (this.subscription) this.subscription.remove();

    this.subscription = eventEmitter.addListener(
      'onDeviceDetected',
      (device: NearbyDevice) => {
        if (this.callback) this.callback(device);
      }
    );
  }

  /**
   * Start scanning for nearby devices
   */
  async startScanning() {
    const hasPermission = await checkAndRequestPermissions();
    if (!hasPermission) {
      throw new Error('Required permissions not granted');
    }

    if (ProximityTrackerModule?.startScanning) {
      ProximityTrackerModule.startScanning();
    } else {
      console.warn('Native module not linked');
    }
  }

  /**
   * Stop scanning for nearby devices
   */
  stopScanning() {
    if (ProximityTrackerModule?.stopScanning) {
      ProximityTrackerModule.stopScanning();
    }
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }
}

export default new ProximityTracker();
