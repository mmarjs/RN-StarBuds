import { Dimensions } from 'react-native';
import { Colors } from '../../theme';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
export const CardStyle = {
	cardStyle: {
		flex: 1,
		flexDirection: 'column',
		//alignItems: 'center',
		backgroundColor: Colors.black,
	},
	imageContainer: {
    height: screenHeight,
    width: screenWidth,
    backgroundColor: Colors.black,
  }
};
