import { Dimensions } from 'react-native';
import { Colors } from '../../theme';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const LoginStyle = {
		loingFbTextBtnContainer: {
		// paddingLeft: (screenWidth >= 414 && screenHeight >= 736) ? 70 : 60,
		// paddingRight: (screenWidth >= 414 && screenHeight >= 736) ? 70 : 60,
		width: 11,
		height : 22,
		paddingTop: 0,
		alignSelf: 'center'
	},
	imageContainer: {
		height: screenHeight,
		width: screenWidth,
		backgroundColor: Colors.black,
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
		alignSelf: 'center',
		width: 11,
		height : 22
	},
	signUpButton: {
		alignSelf : 'center',
		backgroundColor: Colors.clearTransparent,
		width: 220,
		height : 30,
		top : 50
	},
	baseText: {
		width: 220,
		fontSize: 14,
		textAlign: 'left',
		color : 'white',
		letterSpacing: 0.8,
		fontFamily: 'SourceSansPro-Regular',
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
		paddingTop: 15,
		paddingBottom: 3.9,
		fontFamily: 'SourceSansPro-Regular',
		backgroundColor : Colors.clearTransparent
	},
	LoginText: {
		right : screenWidth * 0.29,
		color: Colors.white,
		fontSize: 32,
		fontFamily: 'SourceSansPro-Bold',
		backgroundColor : Colors.clearTransparent,
		paddingTop : screenHeight * 0.12,
		textAlign : 'justify'
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
