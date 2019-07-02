import { Dimensions } from "react-native";
import { Colors } from "./../../theme/Colors";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const PhotoTagsStyle = {
  slide1: { justifyContent: "center", alignItems: "center", },
  imageContainer: { height: screenWidth, width: screenWidth },
  bottomView: {
    flex:1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center"
  },
  bottomViewText: {
    fontSize: 14,
    color: Colors.black,
    marginLeft: 50,
    marginRight: 50,
    textAlign: "center",
    fontFamily: "SourceSansPro-Regular",

  },
  // tagTriangle: {
  //   height: 0,
  //   width: 0,
  //   borderLeftColor: "transparent",
  //   borderLeftWidth: 7,
  //   borderRightColor: "transparent",
  //   borderRightWidth: 7,
  //   borderBottomColor: Colors.primary,
  //   borderBottomWidth: 7
  // },
  // leftTagTriangle:{
  //   alignItems: 'flex-start',
  //   left: 15
  // },
  // rightTagTriangle:{
  //   alignItems: 'flex-end',
  //   right: 15
  // },
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
    justifyContent: "space-around"
  },
  tagListText: {
    color: "white",
    textAlign: "left",
    lineHeight: 18,
    fontSize:16,
    marginLeft:3,
    marginRight:5,
    letterSpacing:1
  },
  removeTagUser: {
    alignItems: "flex-end"
  },
  removeIcon: { height: 20, width: 20 }
};
