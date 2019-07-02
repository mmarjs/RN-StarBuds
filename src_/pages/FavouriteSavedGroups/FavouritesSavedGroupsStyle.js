import { Dimensions } from "react-native";
import { Colors } from './../../theme';

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
import { isIPhoneX } from '../../services/CommonFunctions';

export const FavouritesSavedGroupsStyle = {
	noGroupsContainer: {
		flex: 0.72,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: "#0a0a0a",
	},
	subTitleContainer: {
		flex: 0.1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.black,
	},
	subTitle: {
		color: Colors.white,
		fontSize: 10,
		padding: 15,
		fontFamily: 'ProximaNova-Light'
	},
	createGroupContainer: {
		flex: 1,
		alignItems: 'center',
	},
	createGroupImage: {
		height: 50,
		width: 65,
		marginTop: isIPhoneX() ? 12.9 : 10,
	},
	createGroupTitle: {
		color: Colors.white,
		fontSize: 20.1,
		marginTop: isIPhoneX() ? 38 : 38,
		letterSpacing: 1,
		fontFamily: 'ProximaNova-Bold',
		backgroundColor: 'transparent',
	},
	createGroupDesc: {
		fontFamily: 'ProximaNova-Light',
		color: 'rgb(117, 117, 117)',
		fontSize: 12,
		letterSpacing: 0.6,
		lineHeight:20,
		textAlign: 'center',
		marginTop: 20,
		marginLeft: (screenWidth >= 414 && screenHeight >= 736) ? 87 : 40,
		marginRight: (screenWidth >= 414 && screenHeight >= 736) ? 87: 40,
		backgroundColor: 'transparent',
	},
	tabLabel: {
		fontSize: 16,
		fontFamily: "ProximaNova-Regular",
		color: Colors.warmGrey,
	},
	tabLabelActive: {
		fontSize: 16,
		fontFamily: "ProximaNova-Semibold",
		color: Colors.white
	},
	imageInList: {
		height: 137,
		width: screenWidth,
		opacity: 0.7,
	},
	imageInListEmpty: {
		height: 137,
		width: screenWidth,
		backgroundColor: Colors.white,
	},
	multipleImageIconStyle: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 26.3,
		width: 28.3,
  },
  videoIconStyle: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 21.7,
		width: 27.7,
	},
	groupName: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		color: Colors.white,
		fontSize: 16,
		padding: 10,
		fontFamily: 'ProximaNova-Regular',
		backgroundColor: 'transparent',
	},
	groupOverlay: {
		height: 137,
		width: screenWidth,
	},
	listItemBorder: {
		width: screenWidth,
		height: 1,
		backgroundColor: 'black'
	},
	groupOverlayStyle: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	}
}
