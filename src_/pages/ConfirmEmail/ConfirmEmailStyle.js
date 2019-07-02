import { Colors } from './../../theme/Colors';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const ConfirmEmailStyle = {
	pageContainer: {
		flex: 1,
		backgroundColor: Colors.black,
		flexDirection: 'column',
		alignItems: 'center'
	},
	part1: {
		flex: 0.65,
		alignItems: 'center',
		justifyContent: 'center'
	},
	part2: {
		flex: 0.35
	},
	headerImage: {
		width: 250,
    height: 57,
		marginTop: (screenHeight / 7.5)
	},
	textStyle: {
		fontSize: 20.1,
		color: Colors.white,
		letterSpacing: 1,
		textAlign: 'center',
		lineHeight: 25,
		zIndex: 100,
		paddingTop: 43, //73
		paddingLeft: 40,
		paddingRight: 40,
		fontFamily: 'ProximaNova-Bold'
	},
	imageStyle: {
		height: screenHeight / 2 - 50,
		width: 414.3,
		zIndex: 1
	},
	buttonContainer: {
		marginTop: (screenWidth >= 414 && screenHeight >= 736) ? 55 : 35,
		width: 256,
		zIndex: 100,
	},
	gotItText: {
		color: Colors.black,
		fontSize: 16,
		letterSpacing: 0.8,
		paddingTop: 4,
		paddingBottom: 4,
		textAlign: 'center',
		fontFamily: 'ProximaNova-Bold',
		alignSelf: 'center'
	},
	gotItTextOnPress: {
		color: Colors.white,
		fontSize: 16,
		letterSpacing: 0.8,
		paddingTop: 4,
		paddingBottom: 4,
		textAlign: 'center',
		fontFamily: 'ProximaNova-Bold',
		alignSelf: 'center'
	},
	confirmEmailButtonWrapper: {
		alignItems: "center",
		justifyContent: "center",
		width: 256,
		height: 49.7,
	}
};
