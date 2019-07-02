import { Dimensions } from 'react-native';
import { Colors, Metrics } from './../../theme';

const screenHeight = Dimensions.get( 'window' ).height;
const screenWidth = Dimensions.get( 'window' ).width;

export const AddCaptionModalStyle = {
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: Colors.black,
		borderTopWidth: 0.7,
    borderTopColor: 'rgba(255, 255, 255, 0.17)',
	},
	nextButton: {
		fontSize: 16,
		color: Colors.primary,
		fontFamily: 'ProximaNova-Bold',
		textAlign: 'right'
	},
	captionConatiner: {
		flexDirection: 'row',
		borderColor: 'rgba(255, 255, 255, 0.11)',
		borderBottomWidth: 1,
		height: screenWidth / 4,
    backgroundColor: Colors.black
	},
	avatarImageContainer: {
		width: screenWidth / 7,
		paddingTop: 7.7,
		alignItems: 'center'
	},
	avtarImage: {
		width: 26,
		height: 26,
		borderRadius: 13
	},
	captionTextContainerOuter: {
		flex: 1,
		flexDirection: 'row'
	},
	captionTextContainer: {
		flex: 1
	},
	textAreaStyle: {
		paddingTop: 12.7,
		paddingRight: 15.7,
    color: Colors.white,
    marginRight: 5,
    fontSize: 14,
		fontFamily: "ProximaNova-Regular",
	},
	selectedPhotoContainer: {
    width: screenWidth / 4,
    justifyContent: "center",
    alignItems: "center"
  },
	selectedPhoto: {
		flex: 1,
		width: screenWidth / 4,
		height: screenWidth / 4,
	},
	suggestionsRowContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		width: screenWidth,
  },
  userIconBox: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
	},
	tagIconBox: {
		height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary
	},
  usernameInitials: {
    color: Colors.white,
		fontFamily: "ProximaNova-Medium",
    fontSize: 14,
    letterSpacing: 0.7,
  },
  userDetailsBox: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 15
  },
  displayNameText: {
		fontFamily: "ProximaNova-Regular",
    fontSize: 14,
    letterSpacing: 0.7,
    color: Colors.white
  },
  usernameText: {
		fontFamily: "ProximaNova-Semibold",
    fontSize: 14,
    letterSpacing: 0.7,
    color: Colors.white
	},
	hashTags: {
		paddingVertical: 10,
		paddingLeft: screenWidth/7,
		fontFamily: "ProximaNova-Semibold",
    fontSize: 14,
    letterSpacing: 0.7,
    color: Colors.white
	},
	suggestionsPanelStyle: {
		backgroundColor: Colors.black,
		width: screenWidth,
	},
}
