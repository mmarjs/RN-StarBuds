import { Dimensions } from 'react-native';
import { Colors } from './../../theme/Colors';

const screenWidth = Dimensions.get( 'window' ).width;
const screenHeight = Dimensions.get( 'window' ).height;

export const ContactsStyle = {
	pageContainer: {
		flex: 1,
		backgroundColor: Colors.black,
		flexDirection: 'column',
		// alignItems: 'center',
	},
	group1: {
		paddingTop: 12.7,
		flexDirection: 'column',
		alignItems: 'center'
	},
	group2: {
		paddingTop: 20.7,
		flexDirection: 'column',
		alignItems: 'center',
		// paddingLeft: 50,
		// paddingRight: 50
	},
	noData: {
		flex: 1,
		backgroundColor: Colors.black,
		alignItems: 'center',
		justifyContent: 'center'
	},
	group3: {
		marginTop: 24.7,
		borderTopColor: 'rgba(255, 255, 255, 0.25)',
		borderTopWidth: 0.7,
		backgroundColor: Colors.black,
		height: screenHeight/1.5,
	},
	text1: {
		fontSize: 16,
		color: Colors.white,
		lineHeight: 21,
		letterSpacing: 0.8,
		fontFamily: 'ProximaNova-Semibold'
	},
	text2: {
		paddingTop: 12.7,
		fontSize: 12,
		color: 'rgba(255, 255, 255, 0.50)',
		lineHeight: 21,
		letterSpacing: 0.6,
		fontFamily: 'ProximaNova-Light'
	},
	facebookButtonText: {
		color: Colors.white,
		fontSize: 16,
		// lineHeight: 25,
		letterSpacing: 0.8,
		paddingLeft: ( screenWidth >= 414 && screenHeight >= 736 )
			? 20
			: 10,
		paddingRight: ( screenWidth >= 414 && screenHeight >= 736 )
			? 20
			: 10,
		textAlign: 'center',
		fontFamily: 'ProximaNova-Bold'
	},
	ListRowStyle: {
		container: {
			flex: 1,
			flexDirection: 'row'
		},
		detailContainer: {
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center'
		},
		group1: {
			flex: 0.2,
			flexDirection: 'row',
			justifyContent: 'flex-start'
		},
		group2: {
			flex: 0.8,
			flexDirection: 'row',
			justifyContent: 'space-between',
			borderBottomColor: 'rgba(255, 255, 255, 0.16)',
			borderBottomWidth: 0.7
		},
		photoConatiner: {
			paddingTop: ( screenWidth >= 414 && screenHeight >= 736 )
				? 15.3
				: 10.3,
			paddingBottom: ( screenWidth >= 414 && screenHeight >= 736 )
				? 15.3
				: 10.3,
			paddingLeft: ( screenWidth >= 414 && screenHeight >= 736 )
				? 20
				: 10,
			alignSelf: 'center'
		},
		usernameConatiner: {
			flex: ( screenWidth >= 414 && screenHeight >= 736 )
				? 0.65
				: 0.60,
			alignSelf: 'center',
			paddingLeft: ( screenWidth >= 414 && screenHeight >= 736 )
				? 2
				: 10
		},
		buttonConatiner: {
			flex: ( screenWidth >= 414 && screenHeight >= 736 )
				? 0.35
				: 0.40,
			justifyContent: 'center',
			alignSelf: 'center',
			marginRight: 20
		},
		textUsername: {
			fontSize: 16.5,
			color: Colors.white,
			lineHeight: 22,
			letterSpacing: 0.8,
			backgroundColor: 'transparent',
			fontFamily: 'ProximaNova-Regular'
		},
		textFullname: {
			fontSize: 16.5,
			color: Colors.grayText,
			lineHeight: 22,
			letterSpacing: 0.8,
			backgroundColor: 'transparent',
			fontFamily: 'ProximaNova-Light'
		},
		photo: {
			height: 44,
			width: 44,
			borderRadius: 22
		},
		followButton: {
			height: 30,
			backgroundColor: 'rgb(28, 28, 28)'
		},
		followButtonFollowing: {
			height: 30,
			backgroundColor: Colors.primary
		},
		followButtonText: {
			fontSize: 14.1,
			color: 'rgb(64, 64, 64)',
			textAlign: 'center',
			fontFamily: 'ProximaNova-Bold'
		},
		followButtonTextFollowing: {
			fontSize: 14.1,
			color: Colors.white,
			textAlign: 'center',
			fontFamily: 'ProximaNova-Bold'
		}
	}
};
