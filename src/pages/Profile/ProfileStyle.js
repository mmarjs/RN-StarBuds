import { Dimensions, Platform } from 'react-native';
import { Colors } from './../../theme';
import { isIPhoneX } from '../../services/CommonFunctions';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const ProfileStyle = {
	container: {
		flex: 1,
		height: screenHeight,
		marginTop: Platform.OS === "ios" ? -25 : 0,		
	},
	imageContainer: {
    height: screenHeight,
    width: screenWidth,
    backgroundColor: 'white',
  },
	userImage: {
		marginTop: 20,
		width: screenWidth,
	},
	blurredOverlay: {
		//height: screenHeight / 2,
		width: screenWidth,
		backgroundColor: 'white',
		flex: 1,
		flexDirection: 'column'
	},
	titlebarContainer: {
		marginTop:  Platform.OS === 'ios' ? isIPhoneX() ? 30 : 15 : 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 60
	},
	titlebarCenterView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	titlebarIconLeft: {
		height: 20,
		width: 20,
		marginLeft: 5
	},
	titlebarIconRight: {
		height: 22.7,
		width: 22.7,
		marginRight: 5
	},
	userName: {
		fontSize: 16,
		color: 'rgb(216, 216, 216)',
		letterSpacing: 0,
		lineHeight: 26,
		fontFamily: 'OpenSans-Bold',
		textAlign: 'center',
		alignSelf : 'center',
	},
	profileImageContainer: {
		//flex: 0.28,
		marginTop: -10,
		alignItems: 'center',
		justifyContent: 'flex-end',
		height: 80,

		// height: (screenWidth >= 414 && screenHeight >= 736)
		// ? 85
		// : 75,		
	},
	// profileImage: {
	// 	position: 'absolute',
	// 	width: (screenWidth >= 414 && screenHeight >= 736)
	// 		? 85
	// 		: 75,
	// 	height: (screenWidth >= 414 && screenHeight >= 736)
	// 		? 85
	// 		: 75,
	// 	borderRadius: (screenWidth >= 414 && screenHeight >= 736)
	// 		? 42.5
	// 		: 37.5,
	// 	zIndex: 1,
	// 	alignSelf : 'center',
	// 	alignItems : 'center',
	// 	justifyContent : 'center',
	// 	marginTop : 1.8,
	// },
	profileImage: {
		width: (screenWidth >= 414 && screenHeight >= 736)
			? 86
			: 86,
		height: (screenWidth >= 414 && screenHeight >= 736)
			? 86
			: 86,
		borderRadius: (screenWidth >= 414 && screenHeight >= 736)
			? 43
			: 43,
		alignSelf : 'center',
		justifyContent : 'center',
		
		zIndex: 1,
		marginTop : 1.5,
		// borderColor : 'green',
		// borderWidth : 1.0,
	},
	profileImageBg: {
		top : 10,
		position: 'absolute',
		width: (screenWidth >= 414 && screenHeight >= 736)
			? 100
			: 100,
		height: (screenWidth >= 414 && screenHeight >= 736)
			? 100
			: 100,
		borderRadius: (screenWidth >= 414 && screenHeight >= 736)
			? 50
			: 50,
		zIndex: 1,
		borderColor : 'rgb(98,206,69)',
		borderWidth : 4.0,
		alignItems : 'center'
		// top: 30,
	},
	profileImageDefault: {
		top: 30,
		width: (screenWidth >= 414 && screenHeight >= 736)
			? 85
			: 75,
		height: (screenWidth >= 414 && screenHeight >= 736)
			? 85
			: 75,
		borderRadius: (screenWidth >= 414 && screenHeight >= 736)
			? 42.5
			: 37.5,
		zIndex: 0,
	},
	addCircleIcon: {
		width: 33,
		height: 33,
		borderColor: 'primary',
		borderRadius: 16.5,
		borderWidth: 4.3,
		top: -22,
		left: 38,
		zIndex: 10,
	},
	profileImageIndicator: {
		top: -25,
		left: 40,
		zIndex: 10,
	},
	nameContainer: {

		marginTop: 30,
		alignItems: 'center',
		justifyContent: 'center'
	},
	name: {
		fontSize: 20,
		color: Colors.black,
		lineHeight: 38,
		letterSpacing: 0,
		fontFamily: 'SourceSansPro-Bold'
	},
	findBudsContainer: {
		//flex: 0.12,
		borderRadius:0,
		marginBottom: 20,
		alignItems: 'center',
		alignSelf: 'center'
	},
	findBudsText: {
		color: 'rgb(255,255,255)',
		fontSize: 12,
		// letterSpacing: 0.6,
		textAlign: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		fontFamily: 'OpenSans-Bold'
	},
	profileStatisticContainer: {
		//flex: 0.175
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 5
	},
	// profileStatistic: {
	// 	flex: 1,
	// 	flexDirection: 'row',
	// 	justifyContent: 'space-around'
	// },
	profileStatisticItemContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	profileStatisticNumber: {
		color: Colors.black,
		fontSize: 16,
		lineHeight: 26,
		letterSpacing: 0,
		justifyContent: 'center',
		fontFamily: 'SourceSansPro-Regular'
	},
	profileStatisticText: {
		color: Colors.warmGrey,
		fontSize: 10,
		lineHeight: 19,
		letterSpacing: 0,
		justifyContent: 'center',
		fontFamily: 'SFUIText-Regular'
	},
	profileMenuContainer: {
		flex: 0.135,
		borderTopColor: 'rgba(172, 174, 179, 0.20)',
		borderTopWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		height: 50,
		alignItems: 'center',
	},
	// profileMenu: {
	// 	flex: 1,
	// 	flexDirection: 'row',
	// 	justifyContent: 'space-around',
	// 	height: 50,
	// 	alignItems: 'center'
	// },
	profileMenuIcon: {
		height: 16.3,
		width: 16.7
	},
	profileMenuIconSaved: {
		height: 19.7,
		width: 16.7,
	},
	profileMenuIconTagged: {
		height: 19.7,
		width: 19.3,
		tintColor : 'rgb(211, 211, 211)'
	},
	imageThumbnail: {
		width: 125,
		height: 125,
		backgroundColor: 'green'
	},
	gridContainer: {
		height: screenHeight / 2,
		width: screenWidth,
		// backgroundColor: 'rgb(24, 24, 24)',
		flex: 1
	},
	listContainer: {
		height: screenHeight / 2,
		width: screenWidth,
		// backgroundColor: 'rgb(24, 24, 24)',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	noPostsText: {
		color: 'rgb(255, 255, 255)',
		fontSize: 20,
		lineHeight: 18,
		letterSpacing: 0.5,
		fontFamily: 'ProximaNova-Light',
		textAlign: 'center',
		paddingTop: (screenHeight / 5)
	},
	imageInGrid: {
		borderColor: 'white',
		borderWidth: 0.7,
		height: (screenWidth / 3 - 0.5),
		width: (screenWidth / 3 - 0.5),
		position: 'relative',
	},
	imageInListContainer: {
		flexDirection: 'column',
		flexWrap: 'wrap'
	},
	imageInListDetail: {
		height: (screenHeight / 12),
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: 5,
    backgroundColor: "white"
	},
	profileImageForPostContainer: {
		flex: 0.15,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 10,
	},
	profileImageForPost: {
		height: screenHeight / 18,
		width: (screenHeight / 18),
		borderRadius: (screenHeight / 18) / 2
	},
	listItemTitle: {
		// flex: 0.7,
		flex: 0.85,
		marginHorizontal: 5,
	},
	listItemTitleUsername: {
		color: Colors.white,
		fontSize: 16.5,
		fontFamily: 'ProximaNova-Regular'
	},
	listItemTitleLocation: {
		justifyContent: 'center',
		// alignItems: 'center',
		color: 'rgba(255, 255, 255, 0.67)',
		fontSize: 14,
		fontFamily: 'ProximaNova-Light',
		flexWrap: 'wrap'
	},
	imageInList: {
		// flex: 0.8,
		borderColor: 'white',
		borderWidth: 0.5,
		width: (screenWidth - 1),
		height: (screenWidth - 1),
		// height: (screenHeight / 2),
		position: 'relative'
	},
	rightArrow: {
		height: 8.3,
		width: 4.7
	},
	threeHorizontalDotsContainer :{
		flex: 0.15,
		alignItems: 'center',
		marginRight: 3,
	},
	threeHorizontalDots: {
		height: 2.7,
		width: 16.7,
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
  noPostImage: {
    height: (screenWidth >= 414 && screenHeight >= 736) ? 87 : 67,
		width: (screenWidth >= 414 && screenHeight >= 736) ? 87 : 67,
    alignSelf: 'center',
    marginTop: 37,
    marginBottom: (screenWidth >= 414 && screenHeight >= 736) ? 37 : 20,
  },
  shareContentText: {
    alignSelf: 'center',
    fontSize: 24,
    lineHeight:38,
    fontFamily: 'SourceSansPro-Bold',
    color: 'black',
    letterSpacing: 0,
		marginBottom: (screenWidth >= 414 && screenHeight >= 736) ? 30 : 10,
		backgroundColor: 'transparent'
  },
  shareContentText2: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 14,
    lineHeight:19,
    fontFamily: 'SourceSansPro-Regular',
    color: 'rgb(13, 14, 21)',
    letterSpacing: 0.7,
    marginBottom: (screenWidth >= 414 && screenHeight >= 736) ? 20 : 10,
    marginLeft: 50,
		marginRight: 50,
		backgroundColor: 'transparent'
  },
  shareText: {
  	marginTop:10,
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: 'SourceSansPro-Bold',
    color: Colors.primary,
		letterSpacing: 0,
  },
	noPostsContainer: {
		height: screenHeight / 2,
		width: screenWidth,
		flex: 1,
		backgroundColor:'white'
	},
	videoIcon: {
		position: 'absolute',
    top: screenWidth / 3 - 23.5,
    right: 2,
    height: 21.7,
		width: 27.7,
    padding: 10,
	},
	multipleImagesIcon: {
		position: 'absolute',
    top: screenWidth / 3 - 27,
    right: 2,
    height: 26.3,
		width: 28.3,
    padding: 10,
	},
	videoContainer: {
		width: (screenWidth),
		height: (screenHeight / 2 + (screenHeight / 12)),
	},
	imageBottomDetailsBottom: {
		// flex: 0.4,
		flexWrap: 'wrap',
		flexDirection: 'column',
		backgroundColor: 'white'
	},
	menuItemcontainer: {
		paddingVertical: 15,
		width: screenWidth / 4,
		justifyContent: "center",
		alignItems: "center"
	},
	noNetworkContainer: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
		height: Platform.OS === 'ios' ? (screenWidth >= 414 && screenHeight >= 736) ? screenHeight/ 2 : screenHeight/ 2 - 100 : screenHeight / 3
	},
};
