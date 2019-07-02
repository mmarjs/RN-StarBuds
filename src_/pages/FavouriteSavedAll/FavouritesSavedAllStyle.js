import { Dimensions } from "react-native";
import { Colors } from "./../../theme";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
import { isIPhoneX } from '../../services/CommonFunctions';

export const FavouritesSavedAllStyle = {
	contianer: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#0a0a0a'
	},
	savedTextContainer: {
		flex: 0.1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.black,
	},
	savedText: {
		fontFamily: 'ProximaNova-Light',
		color: Colors.white,
		fontSize: 10,
		padding: 15,
		textAlign: 'center'
	},
	gridContainer: {
		flex: 0.9,
		backgroundColor: '#131313'
	},
	imageInGrid: {
		borderColor: 'rgb(24, 24, 24)',
		borderWidth: 0.7,
		height: ( screenWidth / 3 - 0.5 ),
		width: ( screenWidth / 3 - 0.5 ),
		position: 'relative'
	},
	shareText: {
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: 'ProximaNova-Bold',
    color: Colors.primary,
    letterSpacing: 0.7,
  },
	// noPostsContainer: {
	// 	height: isIPhoneX() ? screenHeight - 190 : screenHeight - 100,
	// 	width: screenWidth,
	// 	flex: 1,
	// 	backgroundColor: '#0a0a0a'
	// },
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
	noPostsContainer: {
		flex: 0.72,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: "#0a0a0a"
	},
	noPostImage: {
		height: 63,
		width: 38,
		alignSelf: 'center'
	},
	saveContentText: {
		fontFamily: "ProximaNova-Bold",
		fontSize: 20.1,
		letterSpacing: 1.0,
		color: Colors.white,
		textAlign: 'center',
		marginTop: 29,
	},
	saveTextDetail: {
		marginTop: 20,
		fontFamily: 'ProximaNova-Light',
		fontSize: 12,
		letterSpacing: 0.6,
		lineHeight:20,
		textAlign: "center",
		color: 'rgb(117, 117, 117)',
		marginLeft: (screenWidth >= 414 && screenHeight >= 736) ? 101 : 40,
		marginRight: (screenWidth >= 414 && screenHeight >= 736) ? 101: 40,
	},
	tabLabel: {
		fontSize: 16,
		fontFamily: "ProximaNova-Regular",
		color: Colors.warmGrey
	},
	tabLabelActive: {
		fontSize: 16,
		fontFamily: "ProximaNova-Semibold",
		color: 'black'
	}
}
