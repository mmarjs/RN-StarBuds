import { Dimensions, Platform, PixelRatio } from "react-native";
import { Colors } from "./../../theme";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
import { isIPhoneX } from '../../services/CommonFunctions';

export const HomeStyle = {
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    borderTopWidth: 0.7,
    borderTopColor: "rgba(255, 255, 255, 0.17)"
  },
  headerImageContainer: { flex: 0.3, backgroundColor: "red" },
  headerImage: {
    marginTop: 4,
    width: Platform.OS === "ios" ? 124 : PixelRatio.getPixelSizeForLayoutSize(124),
    height: Platform.OS === "ios" ? 29 : PixelRatio.getPixelSizeForLayoutSize(29),
  },
  imageContainer: {
    height: isIPhoneX() ? screenHeight-190 : screenHeight-100,
    width: screenWidth,
    backgroundColor: Colors.black,
  },
  addUserIcon: {
    width: 23,
    height: 27
  },
  chatIcon:{
    width: 27,
    height: 26.3,
    //justifyContent: 'center'
  },
  chatCount: {
    color:Colors.black,
    alignSelf:'center',
    fontSize:14.6,
    fontFamily:'ProximaNova-Bold',
    top: 2
  },
  ellipse: {
    width: 26,
    height: 26
  },
  dotIndicator: {
    flexDirection: "row"
  },
  dotStyleInactive: {
    backgroundColor: Colors.white
  },
  dotStyleActive: {
    backgroundColor: Colors.primary
  },
  addUserIcon: { 
    width: 23, 
    height: 27
  },
  ellipse: { 
    width: 26, 
    height: 26
  },
  dotIndicator: { 
    flexDirection: "row"
  },
  dotStyleInactive: { 
    backgroundColor: Colors.white
  },
  dotStyleActive: { 
    backgroundColor: Colors.primary
  },
  imageInListContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
  },
  imageTopDetails: {
    flex: 0.2,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: "white"
  },
  imageBottomDetails: {
    flex: 0.8,
    flexDirection: "column",
    flexWrap: "wrap",
    zIndex: 1
  },
  imageBottomDetailsTop: {
    flex: 0.6,
    flexWrap: "wrap",
    backgroundColor: "white",
    zIndex: 1
  },
  imageBottomDetailsBottom: {
    flex: 0.4,
    flexWrap: "wrap",
    flexDirection: "column",
    backgroundColor: "white",
    zIndex: 1
  },
  
  renderLikes: { justifyContent: "center", marginLeft: 19, zIndex: 1 },
  renderLikesText: { color: "black", zIndex: 1 },
  imageInList: {
    height: screenWidth,
    width: screenWidth,
    maxHeight: screenWidth,
    maxWidth: screenWidth,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1
  },
  noPostImage: { height: 87, width: 87, alignSelf: "center"},
  shareContentText: {
    alignSelf: "center",
    fontSize: 20.1,
    fontFamily: "ProximaNova-Regular",
    color: "rgba(255, 255, 255, 0.18)",
    letterSpacing: 1,
    marginTop:20,
    marginBottom: 20,
    backgroundColor: "transparent"
  },
  shareContentText2: {
    alignSelf: "center",
    textAlign: "center",
    fontSize: 14,
    fontFamily: "ProximaNova-Regular",
    color: "rgba(255, 255, 255, 0.18)",
    letterSpacing: 0.7,
    marginBottom: 20,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: "transparent"
  },
  shareText: {
    alignSelf: "center",
    fontSize: 14,
    fontFamily: "ProximaNova-Bold",
    color: Colors.primary,
    letterSpacing: 0.7,
    backgroundColor: "transparent"
  },
  videoContainer: {
    width: screenWidth,
    height: screenWidth,
  },
  headerRightContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center"
  },
  progress: { justifyContent: "center" },
  activityindicatorStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a0a"
  },
  emptyContainer: {
    height: isIPhoneX() ? screenHeight-190 : screenHeight-100,
    backgroundColor: Colors.black,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
};
