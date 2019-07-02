import React from 'react';
import { View, Text } from 'react-native';
import { NoNetworkViewStyle } from './NoNetworkViewStyle';

export const NoNetworkView = (props) => {
	const { container, text1, text2 } = NoNetworkViewStyle;
	return (
    <View style={props.containerStyle ? props.containerStyle : container}>
      <Text style={text1}>You are not connected to internet!</Text>
      <Text style={text2}>Please check your network connectivity.</Text>
    </View>
	);
};
