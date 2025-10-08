// ios/ProximityTracker.swift
import Foundation
import CoreBluetooth
import React

@objc(ProximityTrackerModule)
class ProximityTrackerModule: RCTEventEmitter, CBCentralManagerDelegate {

    private var centralManager: CBCentralManager!
    private var threshold: Int = -70
    private var scanning: Bool = false

    override init() {
        super.init()
        centralManager = CBCentralManager(delegate: self, queue: nil)
    }

    @objc
    func configure(_ config: [String: Any]) {
        if let thresholdValue = config["threshold"] as? Int {
            self.threshold = thresholdValue
        }
    }

    @objc
    func startScanning() {
        guard centralManager.state == .poweredOn, !scanning else { return }
        centralManager.scanForPeripherals(withServices: nil, options: [CBCentralManagerScanOptionAllowDuplicatesKey: true])
        scanning = true
    }

    @objc
    func stopScanning() {
        guard scanning else { return }
        centralManager.stopScan()
        scanning = false
    }

    // MARK: CBCentralManagerDelegate
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        switch central.state {
        case .poweredOn:
            print("Bluetooth powered on")
        default:
            print("Bluetooth not available: \(central.state.rawValue)")
        }
    }

    func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral,
                        advertisementData: [String: Any], rssi RSSI: NSNumber) {
        guard RSSI.intValue >= threshold else { return }

        let deviceInfo: [String: Any] = [
            "name": peripheral.name ?? "Unknown",
            "id": peripheral.identifier.uuidString,
            "rssi": RSSI.intValue,
            "type": "BLE"
        ]

        sendEvent(withName: "onDeviceDetected", body: deviceInfo)
    }

    // MARK: React Native
    override func supportedEvents() -> [String]! {
        return ["onDeviceDetected"]
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
