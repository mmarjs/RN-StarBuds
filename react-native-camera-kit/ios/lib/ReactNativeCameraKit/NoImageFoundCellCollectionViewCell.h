//
//  NoImageFoundCellCollectionViewCell.h
//  ReactNativeCameraKit
//
//  Created by Nakul Kundaliya on 19/03/18.
//  Copyright © 2018 Wix. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface NoImageFoundCellCollectionViewCell : UICollectionViewCell

//custom label
@property (nonatomic, strong) UILabel *noImageFoundLabel;
-(void)setView;
@end
