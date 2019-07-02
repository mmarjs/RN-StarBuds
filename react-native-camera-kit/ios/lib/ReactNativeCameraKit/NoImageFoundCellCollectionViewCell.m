//
//  NoImageFoundCellCollectionViewCell.m
//  ReactNativeCameraKit
//
//  Created by Nakul Kundaliya on 19/03/18.
//  Copyright © 2018 Wix. All rights reserved.
//

#import "NoImageFoundCellCollectionViewCell.h"

@implementation NoImageFoundCellCollectionViewCell

-(void)setView{
    self.userInteractionEnabled = false;
        self.noImageFoundLabel = [[UILabel alloc] init];
        self.noImageFoundLabel.textAlignment = NSTextAlignmentCenter;
        self.noImageFoundLabel.backgroundColor = [UIColor whiteColor];
        self.noImageFoundLabel.textColor = [UIColor blackColor];
        [self.noImageFoundLabel setFrame:CGRectMake(0, (self.bounds.size.height/4) - 25, self.frame.size.width, 50)];
        [self.noImageFoundLabel setText:@"No Image Found"];
        UIView *balckView = [[UIView alloc]initWithFrame:self.frame];
        [balckView setBackgroundColor:[UIColor whiteColor]];
        [self.contentView addSubview:balckView];
        [self.contentView addSubview:self.noImageFoundLabel];
}
@end
