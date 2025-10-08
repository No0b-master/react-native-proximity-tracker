var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/ProximityTracker.ts
import { NativeModules, NativeEventEmitter } from 'react-native';
import { checkAndRequestPermissions } from './Permissions';
const { ProximityTrackerModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(ProximityTrackerModule);
class ProximityTracker {
    constructor() {
        this.config = {};
    }
    /**
     * Configure the proximity tracker
     */
    configure(config) {
        this.config = config;
        if (ProximityTrackerModule === null || ProximityTrackerModule === void 0 ? void 0 : ProximityTrackerModule.configure) {
            ProximityTrackerModule.configure(config);
        }
    }
    /**
     * Register callback when a nearby device is detected
     */
    onDetectNearbyDevice(callback) {
        this.callback = callback;
        // Remove previous subscription if exists
        if (this.subscription)
            this.subscription.remove();
        this.subscription = eventEmitter.addListener('onDeviceDetected', (device) => {
            if (this.callback)
                this.callback(device);
        });
    }
    /**
     * Start scanning for nearby devices
     */
    startScanning() {
        return __awaiter(this, void 0, void 0, function* () {
            const hasPermission = yield checkAndRequestPermissions();
            if (!hasPermission) {
                throw new Error('Required permissions not granted');
            }
            if (ProximityTrackerModule === null || ProximityTrackerModule === void 0 ? void 0 : ProximityTrackerModule.startScanning) {
                ProximityTrackerModule.startScanning();
            }
            else {
                console.warn('Native module not linked');
            }
        });
    }
    /**
     * Stop scanning for nearby devices
     */
    stopScanning() {
        if (ProximityTrackerModule === null || ProximityTrackerModule === void 0 ? void 0 : ProximityTrackerModule.stopScanning) {
            ProximityTrackerModule.stopScanning();
        }
        if (this.subscription) {
            this.subscription.remove();
            this.subscription = null;
        }
    }
}
export default new ProximityTracker();
