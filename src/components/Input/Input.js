import React, { Component } from "react";
import { TextInput, View, Image } from "react-native";
import { InputStyle } from "./InputStyle";
import { Images, Colors } from "../../theme";

export default class Input extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      icon,
      value,
      onChangeText,
      placeholder,
      secureTextEntry,
      onBlur,
      style,
      keyboardType,
      autoCapitalize,
      customIconStyle,
      autoFocus,
      inputRef,
      returnKeyType,
      onSubmitEditing,
      editable,
      textStyle,
      placeholderTextColor
    } = this.props;
    const {
      inputStyle,
      textFieldStyle,
      iconStyle,
      iconStyleDefault
    } = InputStyle;
    return (
      <View style={[textFieldStyle, style]}>
        <Image
          source={Images[icon]}
          style={[customIconStyle || iconStyle, iconStyleDefault]}
        />
        <TextInput
          editable={editable == false ? false : true}
          secureTextEntry={secureTextEntry}
          autoCorrect={false}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor ? placeholderTextColor : Colors.placeholderTextColor}
          style={[inputStyle, textStyle]}
          value={value}
          onBlur={onBlur}
          onChangeText={onChangeText}
          selectionColor={Colors.primary}
          keyboardType={keyboardType || "default"}
          autoCapitalize={autoCapitalize || "none"}
          underlineColorAndroid="transparent"
          keyboardAppearance="dark"
          autoFocus={autoFocus || false}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          ref={inputRef}
        />
      </View>
    );
  }
}
