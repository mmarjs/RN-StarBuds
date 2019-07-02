import { Dimensions, Platform } from "react-native";
import { Colors } from "./../../theme";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export const GalleryViewStyle = {
  container: {
    flex: 1,
    flexDirection: "row"
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  galleryView: {},
  imagePreview: {},

  content: {
    marginTop: 15,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap"
  },
  text: {
    fontSize: 16,
    alignItems: "center",
    color: "#fff"
  },
  bold: {
    fontWeight: "bold"
  },
  info: {
    fontSize: 12
  },
  gridContainer: {
    backgroundColor: Colors.black,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  imageInGrid: {
    borderColor: Colors.black,
    borderWidth: 0.7,
    height: screenWidth / 3 - 1,
    width: screenWidth / 3 - 1,
    backgroundColor: Colors.black
  },
  imageModeOverlay: {
    position: "absolute",
    right: 0,
    left: 0,
    alignItems: "center",
    bottom: 0,
    flexDirection: "column",
    alignItems: "stretch"
  },
  imageIconOverlay: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  imageIcon: {
    height: 40,
    width: 40
  },
  textStyle: {
		fontSize: 16,
		color: Colors.white,
		textAlign: 'center',
		lineHeight: 21,
		letterSpacing: 0.8,
		paddingLeft: 25,
    paddingRight: 25,
    marginTop: 30,
		fontFamily: 'ProximaNova-Light'
  },
  headerLeftText: {
    color: Colors.white,
    marginLeft: 10,
    fontFamily: "ProximaNova-Light",
    fontSize: 16,
    letterSpacing: 0.8
  },
  headerRightText: {
    color: Colors.warmGrey,
    marginLeft: 10,
    fontFamily: "ProximaNova-Light",
    fontSize: 16,
    letterSpacing: 0.8
  },
  headerRightTextActive: {
    color: Colors.primary,
    marginLeft: 10,
    fontFamily: "ProximaNova-Light",
    fontSize: 16,
    letterSpacing: 0.8
  }
};
