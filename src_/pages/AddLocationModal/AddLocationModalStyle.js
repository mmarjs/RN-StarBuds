import { Colors } from "./../../theme";

export const AddLocationModalStyle = {
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.black
  },
  cancelButton: {
    fontFamily: "ProximaNova-Light",
    fontSize: 16,
    color: Colors.warmGrey,
    letterSpacing: 0.8,
    textAlign: "right"
  },
  searchBarConatiner: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.08)"
  },
  searchIcon: {
    width: 23.7,
    height: 23.7,
    alignItems: "center"
  },
  closeIcon: {
    height: 15.3,
    width: 15.3,
    alignSelf: "center"
  },
  cancelSearchButton: {
	flex: 0.1,
	justifyContent: 'center',
	alignItems: "center",
	marginRight: 10
  },
  listItemContainer: {
    flex: 1,
    marginLeft: 28.7,
    paddingTop: 13.7,
    paddingBottom: 13.7,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.11)"
  },
  locationText: {
    flex: 1,
    color: Colors.white,
    fontSize: 14,
    fontFamily: "ProximaNova-Regular",
    letterSpacing: 0.7
  },
  addressText: {
    flex: 1,
    color: "rgba(255, 255, 255, 0.15)",
    fontSize: 14,
    fontFamily: "ProximaNova-Regular",
    letterSpacing: 0.7
  }
};
