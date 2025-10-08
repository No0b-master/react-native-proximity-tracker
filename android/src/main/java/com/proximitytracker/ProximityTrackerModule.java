// android/src/main/java/com/proximitytracker/ProximityTrackerModule.java
package com.proximitytracker;

import android.util.Log;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class ProximityTrackerModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private BluetoothHandler bluetoothHandler;
    private WifiDirectHandler wifiHandler;

    public ProximityTrackerModule(@NonNull ReactApplicationContext context) {
        super(context);
        reactContext = context;
        bluetoothHandler = new BluetoothHandler(context, this::sendDeviceEvent);
        wifiHandler = new WifiDirectHandler(context, this::sendDeviceEvent);
    }

    @NonNull
    @Override
    public String getName() {
        return "ProximityTrackerModule";
    }

    @ReactMethod
    public void configure(ReadableMap config) {
        bluetoothHandler.configure(config);
        wifiHandler.configure(config);
    }

    @ReactMethod
    public void startScanning() {
        bluetoothHandler.startScanning();
        wifiHandler.startScanning();
    }

    @ReactMethod
    public void stopScanning() {
        bluetoothHandler.stopScanning();
        wifiHandler.stopScanning();
    }

    private void sendDeviceEvent(String name, String id, int rssi, String type) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onDeviceDetected", createDeviceMap(name, id, rssi, type));
    }

    private WritableMap createDeviceMap(String name, String id, int rssi, String type) {
        WritableMap map = Arguments.createMap();
        map.putString("name", name);
        map.putString("id", id);
        map.putInt("rssi", rssi);
        map.putString("type", type);
        return map;
    }
}
