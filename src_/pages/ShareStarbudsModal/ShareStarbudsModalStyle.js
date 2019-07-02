import { Dimensions } from 'react-native';
import { Colors } from './../../theme';

const screenHeight = Dimensions.get( 'window' ).height;
const screenWidth = Dimensions.get( 'window' ).width;

export const ShareStarbudsModalStyle = {
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: Colors.black,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		fontSize: 16,
		color: Colors.white,
		fontFamily: 'ProximaNova-Bold',
	}
}
