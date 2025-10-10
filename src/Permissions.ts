// src/Permissions.ts
import { Platform } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

export async function checkAndRequestPermissions(): Promise<boolean> {
  try {
    // iOS Permissions
    if (Platform.OS === 'ios') {
      const bluetoothStatus = await check(PERMISSIONS.IOS.BLUETOOTH);
      if (bluetoothStatus !== RESULTS.GRANTED) {
        const btRequest = await request(PERMISSIONS.IOS.BLUETOOTH);
        if (btRequest !== RESULTS.GRANTED) return false;
      }

      const locationStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (locationStatus !== RESULTS.GRANTED) {
        const locRequest = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (locRequest !== RESULTS.GRANTED) return false;
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
        const status = await check(perm);
        if (status !== RESULTS.GRANTED) {
          const req = await request(perm);
          if (req !== RESULTS.GRANTED) return false;
        }
      }
    }

    return true; // All required permissions granted
  } catch (err) {
    console.warn('Permission check failed', err);
    return false;
  }
}
