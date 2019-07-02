import { Platform, Dimensions } from "react-native";
import { Colors } from "./../../theme";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const FindBudsStyle = {
	contianer: {
		flex: 1,
	},
	iconImage: {
		height: 24,
		width: 24,
		borderRadius: 12,
		borderColor: Colors.primary
	},
	iconBorderWidth: {
		borderWidth: 2
	},
	// common list styles
	savedTextContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: '#0a0a0a'
	},
	savedText: {
		fontFamily: 'ProximaNova-Light',
		color: Colors.white,
		fontSize: 10,
		padding: 20,
		textAlign: 'center'
	},
	gridContainer: {
		flex: 1,
		backgroundColor: '#0a0a0a',
		justifyContent: 'center'
	},
	searchIcon: {
		height: 81.3,
		width: 81.3,
		marginTop: (screenWidth >= 414 && screenHeight >= 736) ? 119.3 : 60,
	},
	searchText: {
		fontFamily: "ProximaNova-Light",
		fontSize: 16,
		letterSpacing: 0.8,
		textAlign: "center",
		color: Colors.white,
		marginTop: 36.7,
		marginLeft: (screenWidth >= 414 && screenHeight >= 736) ? 65 : 45,
		marginRight: (screenWidth >= 414 && screenHeight >= 736) ? 65 : 45,
	},
	connectToFacebookContainer: {
		marginTop: 32,
		width: 256.3
		// marginLeft: 58,
		// marginRight: 58
		// marginLeft: ( screenWidth >= 414 && screenHeight >= 736 ) ? 78 : 58,
		// marginRight: ( screenWidth >= 414 && screenHeight >= 736 ) ? 78 : 58,
	},
	connectButtonStyle: {
		fontFamily: "ProximaNova-Bold",
		fontSize: 16,
		letterSpacing: 0.8,
		color: Colors.white
	},
	group2: {
		flexDirection: 'column',
		borderTopWidth: 0.7,
		borderTopColor: Colors.whiteOpacity25,
		backgroundColor: '#0a0a0a',
		paddingLeft: 10,
		paddingRight: 10
	},
	noDataContainer: {
		// flex: 1,
		// justifyContent: 'flex-end',
		// alignItems: 'center',
		top: screenHeight / 2.8
	},
	noDataText: {
		backgroundColor: 'transparent',
		fontFamily: 'ProximaNova-Light',
		fontSize: 14.3,
		letterSpacing: 0.6,
		textAlign: "center",
		color: 'rgb(117, 117, 117)',
		marginLeft: (screenWidth >= 414 && screenHeight >= 736) ? 50 : 30,
		marginRight: (screenWidth >= 414 && screenHeight >= 736) ? 50: 30,
	},
	group1LogoContainer: {
		flex: 0.1,
		paddingLeft: ( screenWidth >= 414 && screenHeight >= 736 )
			? 20
			: 10
	},
	group1TextContainer: {
		flex: 0.6,
		flexDirection: 'column',
		alignItems: 'flex-start',
		paddingLeft: ( screenWidth >= 414 && screenHeight >= 736 )
			? 10
			: 5
	},
	text1: {
		fontSize: ( screenWidth >= 414 && screenHeight >= 736 )
			? 16.5
			: 13.5,
		color: Colors.white,
		textAlign: 'center',
		letterSpacing: 0.8
	},
	text2: {
		fontSize: ( screenWidth >= 414 && screenHeight >= 736 )
			? 16.5
			: 13.5,
		color: Colors.grayText,
		textAlign: 'center',
		letterSpacing: 0.8,
		backgroundColor: 'transparent'
	},
	facebookLogo: {
		height: ( screenWidth >= 414 && screenHeight >= 736 )
			? 44
			: 33,
		width: ( screenWidth >= 414 && screenHeight >= 736 )
			? 43
			: 32
	},
	buttonConatiner: {
		flex: 0.3,
		paddingRight: ( screenWidth >= 414 && screenHeight >= 736 )
			? 20
			: 10
	},
	connectButton: {
		height: 30,
		backgroundColor: Colors.secondary
	},
	connectButtonText: {
		fontSize: ( screenWidth >= 414 && screenHeight >= 736 )
			? 14.1
			: 12.5,
		letterSpacing: 0.7,
		color: Colors.white,
		paddingRight: ( screenWidth >= 414 && screenHeight >= 736 )
			? 5
			: 1,
		paddingLeft: ( screenWidth >= 414 && screenHeight >= 736 )
			? 5
			: 1,
		fontFamily: 'ProximaNova-Bold'
	},
	contianer: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		// height: screenHeight,
		flexDirection: 'column',
		height: screenHeight,
	},
	listRow: {
		flex: 1,
		width: screenWidth,
		backgroundColor: 'white',
		flexDirection: 'row',
	},
	imageContainer: {
		flex: 0.15,
		alignItems: 'flex-end',
		paddingLeft: 12,		
		paddingTop: 9,
		paddingBottom: 9
	},
	profileImage: {
		height: 44.7,
		width: 44.7,
		borderRadius: 22.35,
	},
	detailContainer: {
		flex: 0.85,
		flexDirection: 'row',		
		borderBottomWidth: 0.7,
		borderBottomColor: 'rgba(255, 255, 255, 0.06)',
		marginLeft: 10.3,
		paddingTop: 9,
		paddingBottom: 9
	},
	username: {
		//flex: (screenWidth >= 414 && screenHeight >= 736) ? 0.65 : 0.55,
		fontFamily: 'OpenSans-Bold',
		fontSize: 14, 
		letterSpacing: 0,
		lineHeight:20,
		color: Colors.black,
		alignSelf: 'center',
	},
	usernameContainer: {
		flex: (screenWidth >= 414 && screenHeight >= 736) ? 0.65 : 0.55,
		flexDirection: 'row'
	},
	followButtonContainer: {
		flex: (screenWidth >= 414 && screenHeight >= 736) ? 0.35 : 0.45,
		// marginRight: (screenWidth >= 414 && screenHeight >= 736) ? 16 : 10,
		marginRight: 15,
		alignItems: 'flex-end',
		alignSelf: 'center'
	},
	followButtonFollowing: {
		height: 30,
		width: 105,
		borderRadius: 5,
		alignSelf: 'flex-end',
		backgroundColor: 'rgb(224,226,231)'
	},
	followButton: {
		height: 30,
		width: 105,
		borderRadius: 5,
		alignSelf: 'flex-end',
		backgroundColor: 'rgb(126,211,33)'
	},
	followButtonText: {
		fontSize: 12,
		color: 'rgb(255, 255, 255)',
		textAlign: 'center',
		fontFamily: 'OpenSans-Bold',
		
	},
	followButtonTextFollowing: {
		fontSize: 12,
		color: Colors.white,
		textAlign: 'center',
		fontFamily: 'OpenSans-Bold',
		justifyContent: 'center',
		alignItems: 'center'
	},
	tabLabel: {
		fontSize: 14,
		lineHeight:20,
		fontFamily: "SourceSansPro-Regular",
		color: Colors.black,
	},
	tabLabelActive: {
		fontSize: 14,
		lineHeight:20,
		fontFamily: "SourceSansPro-Bold",
		color: Colors.black
	}
};
