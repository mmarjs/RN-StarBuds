//
//  UIImage+Imageorientation.h
//  RCTCamera
//
//  Created by Nakul Kundaliya on 20/12/17.
//

#import <UIKit/UIKit.h>

@interface UIImage (Imageorientation)
- (UIImage *)normalizedImage;
- (UIImage *)imageRotatedByDegrees:(CGFloat)degrees;
@end
