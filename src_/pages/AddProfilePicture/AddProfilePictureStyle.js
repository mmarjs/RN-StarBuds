import { Dimensions } from 'react-native';
import { Colors } from './../../theme/Colors';
const screenWidth = Dimensions.get( 'window' ).width;
const screenHeight = Dimensions.get( 'window' ).height;
export const AddProfilePictureStyle = {
	pageContainer: {
		flex: 1,
		backgroundColor: Colors.black,
		flexDirection: 'column',
		alignItems: 'center'
	},
	group1: {
		marginTop: ( screenWidth >= 414 && screenHeight >= 736 )
			? 99.3
			: 80
	},
	imageContainer: {
    height: screenHeight,
    width: screenWidth,
    backgroundColor: Colors.black,
  },
	group2: {
		marginTop: 51.3
	},
	group3: {
		paddingTop: ( screenWidth >= 414 && screenHeight >= 736 )
			? 52.7
			: 40,
		// paddingLeft: (screenWidth >= 414 && screenHeight >= 736) ? 79 : 60,
		// paddingRight: (screenWidth >= 414 && screenHeight >= 736) ? 79 : 60,
	},
	group4: {
		position: 'absolute',
		bottom: 32.3
	},
	headerImage: {
		height: 68,
		width: 87.7
	},
	profileImage: {
		height: 200,
		width: 200
	},
	titleStyle: {
		fontSize: 24,
		lineHeight:38,
		color: Colors.white,
		letterSpacing: 0,
		textAlign: 'center',
		fontWeight: 'bold',
		lineHeight: 31,
		paddingLeft: 40,
		paddingRight: 40,
		paddingBottom: 5,
		fontFamily: 'SourceSansPro-Bold',
	},
	textStyle: {
		fontSize: 14,
		color: Colors.white,
		textAlign: 'center',
		lineHeight: 19,
		letterSpacing: 0,
		paddingLeft: 46,
		fontFamily: 'SourceSansPro-Regular',
		paddingRight: 46
	},
	buttonStyle: {},
	buttonText: {
		color: "rgb(126, 211, 33)",
		fontSize: 14,
		// lineHeight: 25,
		letterSpacing: 0,
		paddingTop: 4,
		paddingBottom: 4,
		paddingLeft: 10,
		fontFamily: 'SourceSansPro-Bold',
		paddingRight: 10
	},
	skipText: {
		fontSize: 16,
		color: Colors.white,
		textAlign: 'right',
		lineHeight: 25.6,
		fontFamily: 'SourceSansPro-Regular',
		letterSpacing: 0
	},
	profileImage: {
		height: 200,
		width: 200,
		borderRadius: 100,
	}
};
