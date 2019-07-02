import React from 'react';
import { TouchableHighlight } from 'react-native';
import { Colors } from '../../theme';
import { ButtonStyle } from './ButtonStyle';

export const Button = ({ disabled, onPress, onHideUnderlay, onShowUnderlay, children, style, underlayColor }) => {
  const { buttonStyle } = ButtonStyle;
  return (
    <TouchableHighlight
      disabled={disabled || false}
      activeOpacity={1}
      onPress={onPress}
      style={[buttonStyle, style]}
      onHideUnderlay={onHideUnderlay}
      onShowUnderlay={onShowUnderlay}
      underlayColor={underlayColor || Colors.primaryDarker}
    >
      {children}
    </TouchableHighlight>
  );
};
