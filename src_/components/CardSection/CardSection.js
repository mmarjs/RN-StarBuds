import React from 'react';
import { View } from 'react-native';
import { CardSectionStyle } from './CardSectionStyle'

export const CardSection = (props) => {
  return (
    <View style={[CardSectionStyle.cardSectionstyle, props.style]}>
      {props.children}
    </View>
  );
};
