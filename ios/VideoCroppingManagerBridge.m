//
//  VideoCroppingManagerBridge.m
//  ImageCroppingIOSNativeModule
//
//  Created by Nakul Kundaliya on 19/12/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "VideoCroppingManagerBridge.h"

@interface RCT_EXTERN_MODULE(VideoCroppingManager, NSObject)

RCT_EXTERN_METHOD(addEvent:(NSString *)name location:(NSString *)location date:(nonnull NSNumber *)date callback:(RCTResponseSenderBlock *)callback)


//RCT_EXTERN_METHOD(cropVideo:(NSURL *)inputURL completion:(void(^)(NSURL *outputURL)))
RCT_EXTERN_METHOD(cropVideo:(NSString *)inputURL callback:(RCTResponseSenderBlock *)callback)
RCT_EXTERN_METHOD(cropImage:(NSString *)inputURL callback:(RCTResponseSenderBlock *)callback)

@end


