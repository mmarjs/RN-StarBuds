import { Dimensions, Platform } from 'react-native';
import { Colors } from './../../theme';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const OtherProfileStyle = {
	container: {
		flex: 1,
	},
	userImage: {
		//height: (screenHeight / 2 - 10),
		//height: 302,
		width: screenWidth
	},
	blurredOverlay: {
		//height: screenHeight / 2,
		width: screenWidth,
		//height: 302,
		backgroundColor: 'rgb(255, 255, 255)',
		//flex: 1,
		flexDirection: 'column'
	},
	titlebarContainer: {
		marginTop:  4,
    height: 69.7,
		//flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	titlebarIconLeft: {
		height: 27,
		width: 23,
	},
	titlebarIconRight: {
		height: 25.7,
		width: 25.7,
	},
	userName: {
		fontSize: 12,
		color: Colors.black,
		letterSpacing: 0.9,
		fontFamily: 'ProximaNova-Bold',
	},
	profileImageContainer: {
		//flex: 0.28,
		marginBottom: 5,
		marginTop: 5,
		alignItems: 'center',
		justifyContent: 'flex-end',
		height: 70
	},
	profileImage: {
		position: 'absolute',
		width: (screenWidth >= 414 && screenHeight >= 736)
			? 85
			: 75,
		height: (screenWidth >= 414 && screenHeight >= 736)
			? 85
			: 75,
		borderRadius: (screenWidth >= 414 && screenHeight >= 736)
			? 42.5
			: 37.5,
		zIndex: 1,
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
		width: 28,
		height: 28,
		borderColor: 'rgba(255, 255, 255, 0.06)',
		borderRadius: 14,
		borderWidth: 4.3,
		top: -25,
		left: 40,
		zIndex: 10,
	},
	nameContainer: {
		//flex: 0.14,
		marginBottom: 5,
		alignItems: 'center',
		justifyContent: 'center'
	},
	name: {
		fontSize: 20.1,
		color: Colors.black,
		lineHeight: 31,
		letterSpacing: 1,
		fontFamily: 'ProximaNova-Bold'
	},
	findBudsContainer: {
		//flex: 0.12,
		marginBottom: 20,
		alignItems: 'center',
		alignSelf: 'center'
	},
	chatMessageText: {
		color: Colors.white,
		fontSize: 12.7,
		letterSpacing: 0.6,
		textAlign: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		fontFamily: 'ProximaNova-Bold'
	},
	profileStatisticContainer: {
		//backgroundColor: 'orange',
		//flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 5
		//flex: 0.175
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
		fontSize: 9.9,
		lineHeight: 18,
		letterSpacing: 0.5,
		justifyContent: 'center',
		fontFamily: 'ProximaNova-Light'
	},
	profileStatisticText: {
		color: Colors.warmGrey,
		fontSize: 9.9,
		lineHeight: 18,
		letterSpacing: 0.5,
		justifyContent: 'center',
		fontFamily: 'ProximaNova-Regular'
	},
	profileMenuContainer: {
		//flex: 0.135,
		//backgroundColor: 'yellow',
		borderTopColor: 'rgba(172, 174, 179, 0.20)',
		borderTopWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		height: 50,
		alignItems: 'center',
		marginBottom: 5
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
	profileMenuIconTagged: {
		height: 16.3,
		width: 10.7
	},
	profileMenuIconSaved: {
		height: 19.7,
		width: 19.3
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
		borderColor: 'rgb(24, 24, 24)',
		borderWidth: 0.7,
		height: (screenWidth / 3 - 0.5),
		width: (screenWidth / 3 - 0.5),
		position: 'relative'
		// backgroundColor: 'rgb(24, 24, 24)'
	},
	imageInListContainer: {
		// width: (screenWidth),
		// height: (screenHeight / 2 ),
		flex: 1,
		flexDirection: 'column',
		zIndex: 1,
		paddingTop: 5,
	},
	imageInListDetail: {
		height: (screenHeight / 12),
		// flex: 0.20,
		flexDirection: 'row',
		alignItems: 'center',
		//backgroundColor: 'rgb(24, 24, 24)',
		//backgroundColor: 'rgb(0,0,0)',
		paddingBottom: 5,
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
		flex: 0.7,
		marginLeft: 5,
		//backgroundColor: Colors.black
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
		borderColor: 'rgb(24, 24, 24)',
		borderWidth: 0.5,
		width: (screenWidth - 1),
		height: (screenHeight / 2 + (screenHeight / 12)),
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
    fontSize: 20.1,
    fontFamily: 'ProximaNova-Regular',
    color: 'rgba(255, 255, 255, 0.18)',
    letterSpacing: 1,
		marginBottom: (screenWidth >= 414 && screenHeight >= 736) ? 30 : 10,
		backgroundColor: 'transparent'
  },
  shareContentText2: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'ProximaNova-Regular',
    color: 'rgba(255, 255, 255, 0.18)',
    letterSpacing: 0.7,
    marginBottom: (screenWidth >= 414 && screenHeight >= 736) ? 20 : 10,
    marginLeft: 50,
		marginRight: 50,
		backgroundColor: 'transparent'
  },
  shareText: {
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: 'ProximaNova-Bold',
    color: Colors.primary,
		letterSpacing: 0.7,
  },
	noPostsContainer: {
		height: screenHeight / 2,
		width: screenWidth,
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#0a0a0a'
	},
	videoIcon: {
		height: 21.7,
		width: 27.7,
		right: 0,
	},
	multipleImagesIcon: {
		height: 26.3,
		width: 28.3,
		right: 0,
	},
	videoContainer: {
		width: (screenWidth),
		height: (screenHeight / 2 + (screenHeight / 12)),
		zIndex: 1,
	},
	imageBottomDetailsBottom: {
		// flex: 0.4,
		flexWrap: 'wrap',
		flexDirection: 'column',
		backgroundColor: '#0a0a0a'
	},
	likeIcon: {
		width: 23.3,
		height: 23.3,
		marginLeft: 20,
	},
	commentIcon: {
		width: 20.3,
		height: 20,
		marginLeft: 24.7,
	},
	shareIcon: {
		width: 23,
		height: 19.3,
		marginLeft: 24,
		marginRight: 26.7,
	},
	saveIcon: {
		width: 14,
		height: 21,
		marginLeft: 19.7,
		marginRight: 30,
	},
	likeText: {
		color: 'rgba(255, 255, 255, 0.24)',
		fontFamily: 'ProximaNova-Medium',
		fontSize: 14,
		fontWeight: '500',
		letterSpacing: 0.7,
	},
	usernameBeforeCaption: {
		color: Colors.white,
		fontFamily: 'ProximaNova-Semibold',
		fontSize: 14,
		letterSpacing: 0.7,
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 7,
		paddingBottom: 5,
	},
	captionText: {
		color: Colors.black,
		fontFamily: 'ProximaNova-Light',
		fontSize: 14,
		letterSpacing: 0.7,
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 7,
		paddingBottom: 5,
	},
	commentText: {
		fontFamily: 'ProximaNova-Medium',
		fontSize: 14,
		letterSpacing: 0.7,
		color: Colors.black,
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 5,
		paddingBottom: 5,
	},
	durationText: {
		fontFamily: 'ProximaNova-Light',
		fontSize: 11.9,
		letterSpacing: 0.6,
		color: 'rgba(255, 255, 255, 0.23)',
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 5,
		paddingBottom: 10,
	}
};
