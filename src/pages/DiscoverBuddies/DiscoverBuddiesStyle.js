import { Platform, Dimensions } from 'react-native';
import { Colors } from './../../theme/Colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const DiscoverBuddiesStyle = {
	pageContainer: {
		flex: 1,
		backgroundColor: Colors.black,
		flexDirection: 'column'
	},
	group1: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.black,
		paddingTop: 20,
		paddingBottom: 20,
		marginRight: 15
	},
	group2: {
		flexDirection: 'column',
		borderTopWidth: 0.7,
		borderTopColor: Colors.whiteOpacity25,
		backgroundColor: Colors.black,
	},
	noDataContainer: {
		flex: 1,
		height: null,
		justifyContent: 'center',
		alignItems: 'center'
	},
	// group1LogoContainer: {
	// 	flex: 0.1,
	// 	paddingLeft: (screenWidth >= 414 && screenHeight >= 736)
	// 		? 20
	// 		: 10
	// },
	group1TextContainer: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		marginLeft: 12.3,
		width: (screenWidth >= 414 && screenHeight >= 736) ? screenWidth - (44+27+105+33): screenWidth - (33+17+105+33),
	},
	text1: {
		fontSize: (screenWidth >= 414 && screenHeight >= 736)
			? 16.5
			: 13.5,
		color: Colors.white,
		textAlign: 'center',
		letterSpacing: 0.8
	},
	text2: {
		fontSize: (screenWidth >= 414 && screenHeight >= 736)
			? 16.5
			: 13.5,
		color: Colors.grayText,
		textAlign: 'center',
		letterSpacing: 0.8,
		backgroundColor: 'transparent'
	},
	facebookLogo: {
		height: (screenWidth >= 414 && screenHeight >= 736)
			? 44
			: 33,
		width: (screenWidth >= 414 && screenHeight >= 736)
			? 43
			: 32,
		marginLeft: (screenWidth >= 414 && screenHeight >= 736)
			? 27
			: 17
	},
	connectButton: {
		height: 30,
		width: 105,
		backgroundColor: Colors.secondary,
		alignSelf: 'center',
	},
	connectButtonText: {
		fontSize: (screenWidth >= 414 && screenHeight >= 736)
			? 14.1
			: 12.5,
		letterSpacing: 0.7,
		color: Colors.white,
		paddingRight: (screenWidth >= 414 && screenHeight >= 736)
			? 5
			: 1,
		paddingLeft: (screenWidth >= 414 && screenHeight >= 736)
			? 5
			: 1,
		fontFamily: 'ProximaNova-Bold'
	},
	listRowStyle: {
		container: {
			// flex: 1,
			width: screenWidth,
			flexDirection: 'row',
			paddingTop: (screenWidth >= 414 && screenHeight >= 736) ? 30 : 20,
			marginLeft: (screenWidth >= 414 && screenHeight >= 736)
				? 27
				: 17,
		},
		photo: {
			height: (screenWidth >= 414 && screenHeight >= 736)
				? 44
				: 33,
			width: (screenWidth >= 414 && screenHeight >= 736)
				? 44
				: 33,
			borderRadius: (screenWidth >= 414 && screenHeight >= 736)
				? 22
				: 16.5,
		},
		detailContainer: {
			// flex: 0.85,
			width: (screenWidth >= 414 && screenHeight >= 736) ? screenWidth - (44 + 27) : screenWidth - (33 + 17),
			flexDirection: 'column',
			borderBottomColor: 'rgba(255, 255, 255, 0.16)',
			borderBottomWidth: 0.7,
			marginLeft: (screenWidth >= 414 && screenHeight >= 736)
				? 13
				: 7,
			paddingBottom: (screenWidth >= 414 && screenHeight >= 736) ? 30 : 20,
		},
		group2: {
			flexDirection: 'row',
			alignItems: 'center',
			width: (screenWidth >= 414 && screenHeight >= 736) ? screenWidth - (44 + 27+12.3+10) : screenWidth - (33 + 17+12.3+10),
		},
		usernameConatiner: {
			flex: 0.45,
			alignSelf: 'center',
			paddingBottom: 10,
			backgroundColor: 'transparent',
		},
		buttonConatiner: {
			flex: 0.55,
			flexDirection: 'row',
			marginRight: 15,
			alignItems: 'center',
			justifyContent: 'flex-end',
		},
		textUsername: {
			fontSize: (screenWidth >= 414 && screenHeight >= 736)
				? 16.5
				: 13.5,
			color: Colors.white,
			// lineHeight: 22,
			letterSpacing: 0.8,
			alignItems: 'center',
			flexDirection: 'row',
			fontFamily: 'ProximaNova-Regular',
		},
		textFullname: {
			fontSize: (screenWidth >= 414 && screenHeight >= 736)
				? 16.5
				: 13.5,
			color: Colors.grayText,
			// lineHeight: 22,
			letterSpacing: 0.8,
			fontFamily: 'ProximaNova-Light'
		},
		textPopular: {
			textAlign: 'left',
			fontSize: 12,
			color: Colors.primary,
			// lineHeight: 22,
			letterSpacing: 0.6,
			backgroundColor: 'transparent',
			fontFamily: 'ProximaNova-Light'
		},
		imagePopular: {
			height: (Platform.OS === 'ios')
				? 15
				: 30,
			width: (Platform.OS === 'ios')
				? 15
				: 30,
			// marginTop: 4,
			// marginLeft: 9.7
		},
		followButton: {
			height: 30,
			marginRight: 5.3,
			backgroundColor: '#1c1c1c'
		},
		followButtonFollowing: {
			height: 30,
			marginRight: 5.3,
			backgroundColor: Colors.primary
		},
		followButtonText: {
			fontSize: (screenWidth >= 414 && screenHeight >= 736)
				? 14.1
				: 12.5,
			// lineHeight: 22,
			letterSpacing: 0.7,
			color: 'rgb(64, 64, 64)',
			paddingRight: (screenWidth >= 414 && screenHeight >= 736)
				? 5
				: 1,
			paddingLeft: (screenWidth >= 414 && screenHeight >= 736)
				? 5
				: 1,
			fontFamily: 'ProximaNova-Bold'
		},
		followingButtonText: {
			fontSize: (screenWidth >= 414 && screenHeight >= 736)
				? 14.1
				: 12.5,
			// lineHeight: 22,
			letterSpacing: 0.7,
			color: Colors.white,
			paddingRight: (screenWidth >= 414 && screenHeight >= 736)
				? 5
				: 1,
			paddingLeft: (screenWidth >= 414 && screenHeight >= 736)
				? 5
				: 1,
			fontFamily: 'ProximaNova-Bold'
		},
		hideButton: {
			height: 30,
			backgroundColor: 'transparent',
			borderWidth: 1,
			borderColor: Colors.whiteOpacity13,
			borderRadius: 50,
		},
		hideButtonText: {
			fontSize: (screenWidth >= 414 && screenHeight >= 736)
				? 14.1
				: 12.5,
			// lineHeight: 22,
			letterSpacing: 0.7,
			color: Colors.whiteOpacity13,
			paddingRight: (screenWidth >= 414 && screenHeight >= 736)
				? 5
				: 1,
			paddingLeft: (screenWidth >= 414 && screenHeight >= 736)
				? 5
				: 1
		}
	},
	noDataText: {
		fontFamily: "ProximaNova-Light",
		fontSize: 16,
		letterSpacing: 0.8,
		textAlign: "center",
		color: Colors.white,
	}
};
