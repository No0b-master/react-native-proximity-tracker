// android/src/main/java/com/proximitytracker/WifiDirectHandler.java
package com.proximitytracker;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.wifi.p2p.*;
import android.util.Log;

import com.facebook.react.bridge.ReadableMap;

public class WifiDirectHandler {

    private final Context context;
    private final ProximityTrackerModule.DeviceDetectedCallback callback;

    private WifiP2pManager manager;
    private WifiP2pManager.Channel channel;
    private BroadcastReceiver receiver;
    private boolean scanning = false;
    private int threshold = -70; // RSSI threshold, placeholder

    public WifiDirectHandler(Context context, ProximityTrackerModule.DeviceDetectedCallback callback) {
        this.context = context;
        this.callback = callback;
        manager = (WifiP2pManager) context.getSystemService(Context.WIFI_P2P_SERVICE);
        if (manager != null) {
            channel = manager.initialize(context, context.getMainLooper(), null);
        }
    }

    public void configure(ReadableMap config) {
        if (config.hasKey("threshold")) {
            threshold = config.getInt("threshold");
        }
    }

    public void startScanning() {
        if (scanning || manager == null || channel == null) return;

        receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String action = intent.getAction();
                if (WifiP2pManager.WIFI_P2P_PEERS_CHANGED_ACTION.equals(action)) {
                    manager.requestPeers(channel, peers -> {
                        for (WifiP2pDevice device : peers.getDeviceList()) {
                            // RSSI not directly available, so we send device name and MAC
                            callback.onDeviceDetected(device.deviceName, device.deviceAddress, 0, "WIFI");
                        }
                    });
                }
            }
        };

        IntentFilter filter = new IntentFilter();
        filter.addAction(WifiP2pManager.WIFI_P2P_PEERS_CHANGED_ACTION);
        context.registerReceiver(receiver, filter);

        manager.discoverPeers(channel, new WifiP2pManager.ActionListener() {
            @Override
            public void onSuccess() {
                Log.d("ProximityTracker", "Wi-Fi Direct discovery started");
            }

            @Override
            public void onFailure(int reason) {
                Log.w("ProximityTracker", "Wi-Fi Direct discovery failed: " + reason);
            }
        });

        scanning = true;
    }

    public void stopScanning() {
        if (!scanning || manager == null || channel == null) return;

        try {
            context.unregisterReceiver(receiver);
        } catch (IllegalArgumentException e) {
            // Receiver not registered
        }

        manager.stopPeerDiscovery(channel, new WifiP2pManager.ActionListener() {
            @Override
            public void onSuccess() {
                Log.d("ProximityTracker", "Wi-Fi Direct discovery stopped");
            }

            @Override
            public void onFailure(int reason) {
                Log.w("ProximityTracker", "Failed to stop Wi-Fi Direct discovery: " + reason);
            }
        });

        scanning = false;
    }
}
