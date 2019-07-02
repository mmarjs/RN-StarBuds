import { Dimensions } from "react-native";
import { Colors } from "./../../theme/Colors";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export const NewPostStyle = {
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.black,
    borderTopWidth: 0.7,
    borderTopColor: "rgba(255, 255, 255, 0.17)"
  },
  captionConatiner: {
    height: null,
    flexDirection: "row",
   
    backgroundColor: Colors.black
  },
  avatarImageContainer: {
    width: screenWidth / 7,
    alignItems: "center",
    marginTop: 10
  },
  avtarImage: { width: 26, height: 26, borderRadius: 13 },
  captionTextContainerOuter: { flex: 1, flexDirection: "row" },
  captionTextContainer: { flex: 1 },
  textAreaStyle: {
    paddingTop: 12.7,
    color: Colors.white,
    marginRight: 5,
    fontSize: 14,
    fontFamily: "ProximaNova-Regular"
  },
  selectedPhotoContainer: {
    width: 85,
    height: 85,
    justifyContent: "center",
    alignItems: "center"
  },
  selectedPhoto: { flex: 1, width: screenWidth / 4, height: screenWidth / 4 },
  selectedVideoThumbnai: {
    position: "absolute",
    width: 50,
    height: 50,
    zIndex: 99,
     backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center"
  },
  tagPeopleConatiner: {
    height: 45.3,
    backgroundColor: Colors.black,
    flexDirection: "row",
    borderColor: "rgba(255, 255, 255, 0.11)",
    borderTopWidth: 1,
    alignItems: "center",
    flexDirection: "row"
  },
  addLocationConatiner: {
    height: 45.3,
    backgroundColor: Colors.black,
    flexDirection: "row",
    borderColor: "rgba(255, 255, 255, 0.11)",
    borderTopWidth: 1,
    alignItems: "center"
  },
  addLocationConatinerSelected: {
    minHeight: 45.3,
    backgroundColor: Colors.black,
    flexDirection: "row",
    borderColor: "rgba(255, 255, 255, 0.11)",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: "center"
  },
  locationsContainer: {
    height: 45.3,
    backgroundColor: Colors.black,
    flexDirection: "row",
    borderColor: Colors.black,
    borderTopWidth: 1,
    alignItems: "center"
  },
  turnOffCommentingContainer: {
    height: 45.3,
    backgroundColor: Colors.black,
    alignItems: "center",
    flexDirection: "row"
  },
  emptyViewContainer: { flex: 0.075, backgroundColor: Colors.black },
  emptyViewContainerBigger: { flex: 0.075, backgroundColor: Colors.black },
  iconContainer: { flex: 0.2, justifyContent: "center", alignItems: "center" },
  textContainer: { flex: 0.7 },
  tagIconStyle: { height: 20, width: 20 },
  locationIconStyle: { height: 21.7, width: 18.7 },
  dispensaryIconStyle: { height: 20, width: 20 },
  listText: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: "ProximaNova-Regular",
    letterSpacing: 0.7,
    paddingLeft: 20
  },
  listTextSelected: {
    marginLeft: 20,
    marginRight: 20,
    fontSize: 14,
    color: Colors.white,
    fontFamily: "ProximaNova-Semibold",
    letterSpacing: 0.7,
    paddingVertical: 10
  },
  locationScrollView: { top: 0, bottom: 0 },
  locationTextContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    marginRight: 2,
    justifyContent: "center",
    height: '100%'
  },
  locationTextContainerSelected: {
    flex: 1,
    backgroundColor: Colors.white,
    marginRight: 2,
    justifyContent: "center",
    height: '100%'
  },
  locationTextContainer2: {
    flex: 1,
    backgroundColor: "rgba(57, 181, 74, 0.48)",
    marginRight: 2,
    justifyContent: "center"
  },
  locationText: {
    color: "white",
    fontSize: 14,
    fontFamily: "ProximaNova-Regular",
    paddingLeft: 12,
    paddingRight: 12
  },
  locationTextSelected: {
    color: Colors.black,
    fontSize: 14,
    fontFamily: "ProximaNova-Semibold",
    paddingLeft: 12,
    paddingRight: 12
  },
  locationText2: {
    color: "white",
    fontSize: 14,
    fontFamily: "ProximaNova-Regular",
    paddingLeft: 12,
    paddingRight: 12
  },
  closeIcon: { 
    height: 20,
    width: 20
  }
};
// backgroundColor: "red"
