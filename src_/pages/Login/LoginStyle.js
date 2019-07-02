import { Dimensions } from 'react-native';
import { Colors } from '../../theme';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const LoginStyle = {
	loingFbTextBtnContainer: {
		// paddingLeft: (screenWidth >= 414 && screenHeight >= 736) ? 70 : 60,
		// paddingRight: (screenWidth >= 414 && screenHeight >= 736) ? 70 : 60,
		width: 256.3,
		paddingTop: 55,
		alignSelf: 'center'
	},
	pageContainer: {
		flex: 1,
		backgroundColor: Colors.black,
		flexDirection: 'column',
		alignItems: 'center'
	},
	wrapper: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	imageContainer: {
		height: screenHeight,
		width: screenWidth,
		backgroundColor: Colors.black,
	},
	loingFbText: {
		color: Colors.white,
		fontSize: 16,
		fontWeight: 'bold',
		letterSpacing: 0.8,
		fontFamily: 'ProximaNova-Bold',
		textAlign: 'center'
	},
	btnTextContainer: {
		paddingLeft: (screenWidth >= 414 && screenHeight >= 736) ? 70 : 60,
		paddingRight: (screenWidth >= 414 && screenHeight >= 736) ? 70 : 60,
		width: 256.3,
		paddingTop: 18,
		alignSelf: 'center'
	},
	slide2: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	btnText: {
		color: Colors.black,
		fontSize: 18,
		fontWeight: 'bold',
		letterSpacing: 0.8,
		fontFamily: 'SourceSansPro-Bold',
		textAlign: 'center'
	},
	orText: {
		color: Colors.white,
		fontSize: 12,
		letterSpacing: 0.6,
		paddingTop: 3.9,
		paddingBottom: 3.9,
		fontFamily: 'SourceSansPro-Regular'
	},
	errorText: {
		color: Colors.blackTransparent,
		paddingTop: 5,
		paddingLeft: 30,
		paddingRight: 30,
		paddingBottom: 5,
		fontFamily: 'ProximaNova-Regular'
	}
};
