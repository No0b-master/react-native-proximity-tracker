// ios/ProximityTracker.m
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ProximityTrackerModule, RCTEventEmitter)

RCT_EXTERN_METHOD(configure:(NSDictionary *)config)
RCT_EXTERN_METHOD(startScanning)
RCT_EXTERN_METHOD(stopScanning)

@end
