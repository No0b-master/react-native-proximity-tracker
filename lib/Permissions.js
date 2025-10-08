var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/Permissions.ts
import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, } from 'react-native-permissions';
export function checkAndRequestPermissions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // iOS Permissions
            if (Platform.OS === 'ios') {
                const bluetoothStatus = yield check(PERMISSIONS.IOS.BLUETOOTH);
                if (bluetoothStatus !== RESULTS.GRANTED) {
                    const btRequest = yield request(PERMISSIONS.IOS.BLUETOOTH);
                    if (btRequest !== RESULTS.GRANTED)
                        return false;
                }
                const locationStatus = yield check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
                if (locationStatus !== RESULTS.GRANTED) {
                    const locRequest = yield request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
                    if (locRequest !== RESULTS.GRANTED)
                        return false;
                }
            }
            // Android Permissions
            if (Platform.OS === 'android') {
                const permissions = [
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                    PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
                    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
                ];
                for (const perm of permissions) {
                    const status = yield check(perm);
                    if (status !== RESULTS.GRANTED) {
                        const req = yield request(perm);
                        if (req !== RESULTS.GRANTED)
                            return false;
                    }
                }
            }
            return true; // All required permissions granted
        }
        catch (err) {
            console.warn('Permission check failed', err);
            return false;
        }
    });
}
