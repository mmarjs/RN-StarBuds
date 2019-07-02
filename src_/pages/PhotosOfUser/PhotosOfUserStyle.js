import { Dimensions } from "react-native";
import { Colors } from "./../../theme";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
import { isIPhoneX } from '../../services/CommonFunctions';

export const PhotosOfUserStyle = {
  contianer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.black,
    borderTopWidth: 0.7,
    borderTopColor: "rgba(255, 255, 255, 0.17)"
  },
    imageContainer: {
    height: screenHeight,
    width: screenWidth,
    backgroundColor: Colors.black,
  },
  savedTextContainer: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.black
  },
  savedText: {
    fontFamily: "ProximaNova-Light",
    color: Colors.white,
    fontSize: 10,
    padding: 20,
    textAlign: "center"
  },
  gridContainer: {
    flex: 0.9,
    backgroundColor: "#131313"
  },
  imageInGrid: {
    borderColor: "rgb(24, 24, 24)",
    borderWidth: 0.7,
    height: screenWidth / 3 - 0.5,
    width: screenWidth / 3 - 0.5,
    position: "relative"
  },
  shareText: {
    alignSelf: "center",
    fontSize: 14,
    fontFamily: "ProximaNova-Bold",
    color: Colors.primary,
    letterSpacing: 0.7
  },
  noPostsContainer: {
    height: screenHeight / 2,
    width: screenWidth,
    flex: 1
  },
  videoIcon: {
    height: 21.7,
    width: 27.7,
    right: 0
  },
  multipleImagesIcon: {
    height: 26.3,
    width: 28.3,
    right: 0
	},
	iconImage: {
    height: 24,
		width: 24,
		borderRadius: 12,
		borderColor: Colors.primary,
  },
  iconBorderWidth: {
    borderWidth: 2,
  },
  noPhotosImage: {
    height: 80,
    width: 63.7
  },
   group2: {
    position: 'absolute',
    alignItems: 'center',
    left: 0,
    right: 0,
    top: (screenHeight / 2.4),
    backgroundColor: 'transparent',

  },
  noPhotosText1: {
    marginTop: 30,
    fontFamily: "SourceSansPro-Bold",
    fontSize: 24,
    letterSpacing: 0,
    color: Colors.white,
    textAlign: 'center'
  },
  noPhotosText2: {
    fontFamily: "SourceSansPro-Regular",
    fontSize: 12,
    letterSpacing: 0,
    color: Colors.white,
    textAlign: 'center',
    marginTop: 20,
    lineHeight:19,
    marginHorizontal: 75
  },
  emptyContainer: {
    flex: 1,
    height: isIPhoneX() ? screenHeight - 180 : screenHeight - 100,
    alignItems: "center",
    justifyContent: 'center',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
};
