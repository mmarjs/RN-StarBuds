import React, { Component } from "react";
import { TextInput, View } from "react-native";
import { TextAreaStyle } from "./TextAreaStyle";
import { Colors } from "../../theme";

export default class TextArea extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      value,
      onChangeText,
      placeholder,
      placeholderTextColor,
      onBlur,
      style,
      autoCapitalize,
      onFocus,
      autoFocus,
      returnKeyType,
      onSubmitEditing,
      inputRef,
      multiline,
    } = this.props;
    const { textAreaStyle } = TextAreaStyle;
    return (
      <TextInput
        autoCorrect={false}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={[textAreaStyle, style]}
        value={value}
        onBlur={onBlur}
        onChangeText={onChangeText}
        onFocus={onFocus}
        selectionColor={Colors.primary}
        autoCapitalize={autoCapitalize || "none"}
        multiline={multiline || true}
        keyboardAppearance="dark"
        autoFocus={autoFocus || false}
        underlineColorAndroid="transparent"
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        ref={inputRef}
      />
    );
  }
}
