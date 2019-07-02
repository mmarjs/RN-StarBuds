import React, { Component } from "react";
import ActionSheet from 'react-native-actionsheet';
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 4;
let options = ['Cancel', 'Turn Off Commenting', 'Edit', 'Share', 'Delete'];

export const PostOptions = ({getActionSheetRef, handlePress}) => {
  return (
    <ActionSheet
      ref={getActionSheetRef}
      options={options}
      cancelButtonIndex={CANCEL_INDEX}
      destructiveButtonIndex={DESTRUCTIVE_INDEX}
      onPress={handlePress}
    />
  )
}