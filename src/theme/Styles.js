import { Dimensions, Platform, PixelRatio } from "react-native";
import { Colors } from './Colors';
import { isIPhoneX } from '../services/CommonFunctions';
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export const Styles = {
  iphoneXWrapper: {
    flex: 1,
    // paddingTop: 44,
    paddingBottom: 34,
    backgroundColor: 'white'
  },
  iphoneXWrapperForProfile: {
    flex: 1,
    paddingBottom: 34,
    backgroundColor: Colors.white
  },
  withoutBorderNavigationBarStyle: {
    backgroundColor: Colors.red,
    borderWidth: 0,
    borderWidth: 1,
    alignContent: "center"
  },
  withBorderNavigationBarStyle: {
    backgroundColor: Colors.black,
    borderBottomColor: "rgba(255,255,255,0.17)",
    borderWidth: 1,
    alignContent: "center"
  },
  nextButtonStyle: {
    color: Colors.primary,
    paddingRight: 20,
    fontSize: 16,
    letterSpacing: 0.8
  },
  headerStyle: {
    backgroundColor: "white",
    marginTop: (Platform.OS === 'ios') ? isIPhoneX() ? 0 : 0 : 0,
    height: isIPhoneX() ? 93.7 : 69.7
  },
  headerTitleStyle: {
    fontSize: 16,
    letterSpacing: 0,
    paddingRight:10,
    lineHeight:26,
    color: "rgb(216,216,216)",
    fontFamily: "OpenSans-Bold",
    alignSelf: "center",
    fontWeight: 'normal'
    // paddingTop: (Platform.OS === 'ios' && screenHeight === 812) ? 40 : 0
  },
  transparentHeaderStyle: {
    backgroundColor: 'transparent',
    height: 69.7,
    right: 0,
    left: 0,
    top: 0,
    position: 'absolute',
    borderBottomWidth: 0,
  },
  headerLeftContainer: {
    padding: 15
  },
  headerRightContainer: {
    padding: 15
  },
  headerLeftText: {
    marginLeft: 5
  },
  headerRightText: {
    marginRight: 5
  },
  headerLeftImage: {
    marginLeft: 5,
    alignSelf: "flex-start",
  },
  headerRightImage: {
    marginRight: 5,
    alignSelf: "flex-start",
  },
  thinBottomBorder7: {
    borderBottomWidth : 0.0,
    borderBottomColor : Colors.dark
  },
  thinTopBorder7: {
    borderTopWidth : 0.7,
    borderTopColor : 'rgba(255, 255, 255, 0.07)'
  },
  thinBottomBorder11: {
    borderBottomWidth : 0.11,
    borderBottomColor : 'rgba(255, 255, 255, 0.10)'
  },
  // Modal styles
  modalTitleBar: {
    paddingTop: Platform.OS === 'ios' ? isIPhoneX() ? 44 : 22 : 0,
    height: Platform.OS === 'ios' ? isIPhoneX() ? 89.7 : 70 : 50,
    width: screenWidth,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.7,
    borderBottomColor: "rgba(255, 255, 255, 0.11)",
  },
  modalTitle: {
    fontFamily: "SourceSansPro-Regular",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: Colors.black,
    backgroundColor: '#FFFFFF',
  },
  activeSwiperDot: {
    backgroundColor: Colors.primary,
    width: 3.5,
    height: 3.5,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
  },
  swiperDot: {
    backgroundColor: "rgb(216,216,216)",
    width: 3.5,
    height: 3.5,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
  },
  swiperPagination: {
    bottom: 0,
    left: 50,
    right: 50,
  },
  tagTriangle: {
    height: 0,
    width: 0,
    // left: 15,
    borderLeftColor: "transparent",
    borderLeftWidth: 7,
    borderRightColor: "transparent",
    borderRightWidth: 7,
    borderBottomColor: Colors.primary,
    borderBottomWidth: 7
  },
  tagTriangleBottom: {
    height: 0,
    width: 0,
    // left: 15,
    borderLeftColor: "transparent",
    borderLeftWidth: 7,
    borderRightColor: "transparent",
    borderRightWidth: 7,
    borderTopColor: Colors.primary,
    borderTopWidth: 7
  },
  leftTagTriangle:{
    alignItems: 'flex-start',
    left: 15
  },
  rightTagTriangle:{
    alignItems: 'flex-end',
    right: 15
  },
  tagUserView: {
    backgroundColor: Colors.primary,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingLeft: 10,
    paddingRight: 3,
    paddingTop: 3,
    paddingBottom: 3,
    flexDirection: "row",
    justifyContent: "space-around",
    minWidth:45
  },
  tagListText: {
    color: "white",
    textAlign: "left",
    lineHeight: 18,
    fontSize: 16,
    marginLeft: 3,
    marginRight: 5,
    letterSpacing: 1
  },  
  // Common styles for Feed
  profileImageForPostContainerInFeed: {
    flex: 0.15,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10
  },
  profileImageForPostInFeed: {
    height: screenHeight / 18,
    width: screenHeight / 18,
    borderRadius: screenHeight / 18 / 2
  },
  listItemTitleInFeed: { 
    flex: 0.7,
    marginLeft: 5 
  },
  listItemTitleUsernameInFeed: {
    color: "rgb(13, 14, 21)",
    fontSize: 14,
    lineHeight:20,
    fontFamily: "SourceSansPro-Regular",
    backgroundColor: "transparent"
  },
  listItemTitleLocationInFeed: {
    justifyContent: "center",
    color: Colors.black,
    fontSize: 14,
    fontFamily: "ProximaNova-Light",
    flexWrap: "wrap",
    backgroundColor: "transparent"
  },
  rightArrowInFeed: { 
    height: Platform.select({
      ios: 8.3,
      android: PixelRatio.getPixelSizeForLayoutSize(8.3),
    }),
    width: Platform.select({
      ios: 4.7,
      android: PixelRatio.getPixelSizeForLayoutSize(4.7),
    })
  },
  threeHorizontalDotsContainerInFeed: {
    flex: 0.15,
    alignItems: "center",
    marginRight: -5,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  threeHorizontalDotsInFeed: {
    height: 2.7,
    width: 16.7,
    tintColor : 'black'
  },
  feedActionsRowContainer: {
    flexDirection: "row",
    width: screenWidth,
  },
  feedActionLeftContainer: {
    width: "45%",
    flexDirection: "row",
    alignItems: 'center',
  },
  feedActionRightContainer: {
    marginLeft : 12,
    width: "55%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: 'center',
  },
  feedActionLikeContainer: {
    paddingTop: 13,
    paddingBottom: 13,
    paddingLeft: 19.7,
    paddingRight: 10,
  },
  feedActionCommentContainer: {
    paddingTop: 13,
    paddingBottom: 13,
    paddingHorizontal: 10,
  },
  feedActionShareContainer: {
    paddingTop: 13,
    paddingBottom: 13,
    paddingHorizontal: 10,
  },
  feedActionSaveContainer: {
    paddingTop: 13,
    paddingBottom: 13,
    paddingLeft: 17,
    paddingRight: 30,
  },
  likeIcon: {
    width: 23,
    height: 23,
    alignSelf: 'center',
  },
  unlikeIcon: {
    width: 23,
    height: 23,
    alignSelf: 'center',
    tintColor : 'rgb(217,219,226)'
  },
  commentIcon: {
    tintColor : 'rgb(217,219,226)',
    width: 22,
    height: 22,
    alignSelf: 'center',
  },
  shareIcon: {
    width: 23,
    height: 23,
    alignSelf: 'center',
    tintColor : 'rgb(217,219,226)'
  },
  saveIcon: {
    width: 24,
    height: 24,
    tintColor : 'rgb(217,219,226)',
    alignSelf: 'center',
  },
  saveDIcon: {
    width: 24,
    height: 24,
    tintColor : 'rgb(110,206,26)',
    alignSelf: 'center',
  },
  likeTextInFeed:{
    color: "#e4e3e9",
    fontFamily: "SourceSansPro-Regular",
    fontSize: 14,
    lineHeight:20,
    fontWeight: "500",
    letterSpacing: 0,
    backgroundColor: "transparent",
    paddingTop: 13,
    paddingBottom: 13,
  },
  usernameBeforeCaptionInFeed: {
    color: Colors.black,
    fontFamily: "SourceSansPro-Bold",
    fontSize: 14,
    letterSpacing: 0,
    lineHeight:20,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 7,
    paddingBottom: 5,
  },
  bigCaptionWrapperInFeed: {
    marginLeft: 20,
    marginRight: 20,
  },
  captionTextInFeed: {
    color: Colors.black,
    fontFamily: "SourceSansPro-Regular",
    fontSize: 14,
    lineHeight:20,
    letterSpacing: 0,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 7,
    paddingBottom: 5,
    flexWrap: "wrap"
  },
  commentTextInFeed: {
    fontFamily: "SourceSansPro-Regular",
    fontSize: 14,
    letterSpacing: 0,
    lineHeight:20,
    color: "rgb(13, 14, 21)",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5
  },
  durationTextContainerInFeed: {
    width: screenWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 10,
  },
  durationTextInFeed: {
    fontFamily: "SourceSansPro-Regular",
    fontSize: 12,
    marginTop:-3,
    lineHeight:19,
    letterSpacing: 0,
    color: Colors.dark,
  },
  // follow and following button
  followButtonWrapper: {
		flexDirection: 'row',
    height: 30,
    width: 105,
		justifyContent: 'center',
    alignItems: 'center',
  },
  cropButtonsWrapper: {
    paddingTop: isIPhoneX() ? 64 : 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cropCancelButton: {
    backgroundColor: '#3D3E3E',
    height: 30,
    marginLeft: 20,
  },
  cropDoneButton: {
    backgroundColor: Colors.primary,
    height: 30,
    marginRight: 20
	},
	cropButtonsText: {
		color: Colors.white,
		fontSize: 12.7,
		letterSpacing: 0.6,
		textAlign: 'center',
    fontFamily: 'ProximaNova-Bold',
    backgroundColor: 'transparent'
	}
};
