import React from 'react';
import { View, ScrollView ,Image,ImageBackground} from 'react-native';
import { CardStyle } from './CardStyle';
import { Colors, Images, Styles, Metrics } from "../../theme";
export const Card2 = (props) => {
	const { cardStyle } = CardStyle;
	return (
		<ScrollView style={cardStyle} scrollEnabled = {false}>
			<View>
			<ImageBackground
          style={CardStyle.imageContainer}
          source={Images.background_image2}
        >
				{props.children}
				</ImageBackground>
			</View>
		</ScrollView>
	);
};
