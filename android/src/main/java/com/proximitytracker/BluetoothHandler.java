// android/src/main/java/com/proximitytracker/BluetoothHandler.java
package com.proximitytracker;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.*;
import android.content.Context;
import android.os.ParcelUuid;
import android.util.Log;

import com.facebook.react.bridge.ReadableMap;

import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class BluetoothHandler {

    private final Context context;
    private final DeviceDetectedCallback callback;

    private BluetoothAdapter bluetoothAdapter;
    private BluetoothLeScanner bleScanner;
    private ScanCallback scanCallback;

    private int threshold = -70; // default RSSI threshold
    private boolean scanning = false;

    public interface DeviceDetectedCallback {
        void onDeviceDetected(String name, String id, int rssi, String type);
    }

    public BluetoothHandler(Context context, DeviceDetectedCallback callback) {
        this.context = context;
        this.callback = callback;

        BluetoothManager bluetoothManager = (BluetoothManager) context.getSystemService(Context.BLUETOOTH_SERVICE);
        bluetoothAdapter = bluetoothManager.getAdapter();
        bleScanner = bluetoothAdapter.getBluetoothLeScanner();
    }

    public void configure(ReadableMap config) {
        if (config.hasKey("threshold")) {
            threshold = config.getInt("threshold");
        }
    }

    public void startScanning() {
        if (scanning || bleScanner == null) return;

        scanCallback = new ScanCallback() {
            @Override
            public void onScanResult(int callbackType, ScanResult result) {
                BluetoothDevice device = result.getDevice();
                int rssi = result.getRssi();
                if (rssi >= threshold) {
                    String name = device.getName();
                    String id = device.getAddress();
                    callback.onDeviceDetected(name, id, rssi, "BLE");
                }
            }

            @Override
            public void onBatchScanResults(List<ScanResult> results) {
                for (ScanResult result : results) {
                    onScanResult(0, result);
                }
            }

            @Override
            public void onScanFailed(int errorCode) {
                Log.w("ProximityTracker", "BLE Scan failed with error: " + errorCode);
            }
        };

        bleScanner.startScan(scanCallback);
        scanning = true;
    }

    public void stopScanning() {
        if (!scanning || bleScanner == null) return;
        bleScanner.stopScan(scanCallback);
        scanning = false;
    }
}
