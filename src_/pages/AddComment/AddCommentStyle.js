import { Dimensions } from 'react-native';
import { Colors } from './../../theme';

const screenHeight = Dimensions.get( 'window' ).height;
const screenWidth = Dimensions.get( 'window' ).width;

export const AddCommentStyle = {
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    borderTopWidth: 0.7,
    borderTopColor: 'rgba(255, 255, 255, 0.17)',
  },
  touchableContainer: {
    flex: 1,
    height: screenHeight,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    top: 0,
    // position: 'relative',
    borderTopWidth: 0.7,
    borderTopColor: 'rgba(255, 255, 255, 0.17)',
  },
  inputContainer: {
    position: 'relative',
    bottom: 0,
    height: 52.3,
    width: screenWidth,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  inputStyle: {
		flex: 0.8,
		fontSize: 16,
		marginLeft: 26.7,
		letterSpacing: 0.8,
		borderWidth: 0,
		color: Colors.black,
    fontFamily: 'SourceSansPro-Regular',
	},
  button: {
    marginLeft: 15,
    marginRight: 15,
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addUserIcon: {
		width: 23,
		height: 27,
		marginLeft: 30,
		alignSelf: 'center'
  },
  topContainer: {
    // position: 'absolute',
    // top: 0,
    // width: screenWidth,
    // flexDirection: 'column',
    // borderBottomWidth: 0.7,
    // borderBottomColor: 'rgba(255, 255, 255, 0.12)',
    width: screenWidth,
    flexDirection: 'column',
    borderBottomWidth: 0.7,
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
  },
  headerListRow: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 15,
  },
  listRow: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 15,
    backgroundColor: '#FFFFFF'
  },
  listRowSelected: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 15,
    backgroundColor: Colors.primary,
  },
  postDescription: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: screenWidth - 35,
    marginLeft: 10,
    marginRight: 20,
    paddingRight: 20,
    // borderBottomWidth: 0.7,
    // borderBottomColor: 'black',
    // paddingBottom: 13.3,
  },
  postDescriptionNoBorder: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: screenWidth - 35,
    marginLeft: 10,
    marginRight: 20,
    paddingRight: 20,
  },
  loadMoreContainer: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
  },
  loadMoreText: {
    fontFamily: "SourceSansPro-Regular",
    fontSize: 10,
    letterSpacing: 0,
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.32)",
    marginTop: 19.3,
    marginBottom: 19.3,
  },
  commentTimeText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 12,
    letterSpacing: 0,
    color: "black",
    paddingTop: 6.7,
    paddingBottom: 23.3,
    backgroundColor: 'transparent'
  },
  userImage: {
    // marginLeft: 7.3,
    height: screenHeight / 18,
		width: (screenHeight / 18),
    borderRadius: (screenHeight / 18) / 2,
  },
  captionWrapper: {
    marginRight: 20,
    backgroundColor:'#FFFFFF'
  }, 
  username: {
    color: Colors.black,
    lineHeight:20,
    fontFamily: "SourceSansPro-Bold",
    fontSize: 14,
    letterSpacing: 0,
  },
  commentTextContainer: {
    color: Colors.black,
    fontFamily: 'ProximaNova-Medium',
    fontSize: 13.6,
    backgroundColor: 'transparent',
  },
  commentText: {
    color: Colors.black,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    backgroundColor: 'transparent',
    marginRight: 20,
  },
  likeIcon: {
		width: 23,
		height: 23,
		// marginLeft: 19.3,
    paddingRight: 20.7,
  },
  durationText: {
		fontFamily: 'ProximaNova-Light',
		fontSize: 11.9,
		letterSpacing: 0.6,
		color: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'transparent'
  },
  postActive: {
    fontFamily: 'ProximaNova-Bold',
    fontSize: 16.5,
    letterSpacing: 0.83,
    textAlign: 'center',
    color: Colors.primary,
  },
  postInactive: {
    fontFamily: 'ProximaNova-Bold',
    fontSize: 16.5,
    letterSpacing: 0.83,
    textAlign: 'center',
    color: 'rgba(29, 196, 60, 0.16)',
  },
  bigCaptionText: {
    marginHorizontal: 20
  }
}