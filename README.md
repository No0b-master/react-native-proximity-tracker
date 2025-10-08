# react-native-proximity-tracker

React Native package to detect nearby devices using **BLE** and **Wi-Fi Direct** (Android only).  
Provides a simple callback when a device is nearby and allows configuration for detection threshold and scan interval.

---

## Features

- Detect nearby devices over **Bluetooth Low Energy (BLE)** (iOS + Android)  
- Detect nearby devices over **Wi-Fi Direct** (Android only)  
- Configure **RSSI threshold**, **scan interval**, and **low-energy mode**  
- Handles **permissions automatically**  
- Simple **callback API** for detected devices  

---

## Installation

```bash
npm install react-native-proximity-tracker react-native-permissions
# or
yarn add react-native-proximity-tracker react-native-permissions

```

Linking (React Native <0.60)

```bash
react-native link react-native-permissions
react-native link react-native-proximity-tracker
```
## Usage
```bash
import ProximityTracker, { NearbyDevice } from 'react-native-proximity-tracker';

ProximityTracker.configure({
  threshold: -70,
  lowEnergyMode: true,
  scanInterval: 5000,
});

ProximityTracker.onDetectNearbyDevice((device: NearbyDevice) => {
  console.log('Nearby device detected:', device);
});

ProximityTracker.startScanning();

// Stop scanning
// ProximityTracker.stopScanning();
```
## API

configure(config: ProximityTrackerConfig)
Configure threshold, scan interval, and low energy mode.

onDetectNearbyDevice(callback: OnDetectNearbyDeviceCallback)
Register a callback for when a nearby device is detected.

startScanning()
Start scanning for nearby devices (requests permissions automatically).

stopScanning()
Stop scanning and remove event listeners.

## 📱 Android Permissions
Add these to AndroidManifest.xml:

```bash

<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.NEARBY_WIFI_DEVICES" />

```

## 📱 iOS Permissions
Add these to Info.plist:
```bash
<key>NSBluetoothAlwaysUsageDescription</key>
<string>Required to detect nearby devices</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Required to detect BLE devices</string>

```