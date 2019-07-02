import { Dimensions, Platform } from 'react-native';
import { Colors } from './../../theme';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const DiscoveryStyle = {
  headerRightImage: {
    width: 23,
    height: 27
  },
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    borderTopWidth: 0.7,
    borderTopColor: 'rgba(255, 255, 255, 0.17)'
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.black,
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  emptyText: {
    fontSize: 16.5,
    color: Colors.grayText,
    lineHeight: 22,
    letterSpacing: 0.8,
    backgroundColor: 'transparent',
    fontFamily:'ProximaNova-Light',
    textAlign: 'center',
    marginTop: screenWidth / 2,
  },
  activityIndicatorStyle: {
    flex: 1,
    height: screenHeight - 63,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.black
  },
  activityIndicatorStyleForSearch: {
    flex: 1,
    backgroundColor: Colors.black
  },
  seacrhBar: {
    backgroundColor: 'rgb(20, 20, 20)',
    paddingLeft: 24.3
  },
  seacrhIcon: {
    height: 20.3,
    width: 20.3
  },
  searchText: { 
    fontFamily: 'ProximaNova-Regular',
    color: 'rgb(255, 255, 255)',
    fontSize: 16.5,
    letterSpacing: 0.83 
  },
  textFieldStyle: {
		backgroundColor: Colors.inputBackground,
		height: 53,
		flexDirection: 'row',
		paddingLeft: 30,
	},
  iconStyleDefault: {
    alignSelf: 'center'
  },
	iconStyle: {
		height: 15.3,
		width: 15.3
	},
	inputStyle: {
		fontSize: 16,
		flex: 1,
		marginLeft: 15,
		letterSpacing: 0.8,
		borderWidth: 0,
		color: Colors.white,
    fontFamily: 'ProximaNova-Light',
  },
  closeIcon: {
    height: 15.3,
    width: 15.3,
  },
  sectionContainer: {
    flexDirection: 'column',
  },
  sectionTitleText: {
    fontFamily: 'ProximaNova-Light',
    fontSize: 12,
    letterSpacing: 0.6,
    color: Colors.white,
    marginLeft: 24.3,
    paddingVertical: 20
  },
  videoIcon: {
		position: 'absolute',
    top: screenWidth / 3 - 23.5,
    right: 2,
    height: 21.7,
		width: 27.7,
    padding: 10,
	},
	multipleImagesIcon: {
		position: 'absolute',
    top: screenWidth / 3 - 27,
    right: 2,
    height: 26.3,
		width: 28.3,
    padding: 10,
  },
  gridItem: {
    backgroundColor: Colors.black,
		height: (screenWidth / 3),
		width: (screenWidth / 3),
    position: 'relative',
    marginBottom: 0.5
  },
  text1: {
    position: 'absolute',
    top: 5,
    right: 5,
    textAlign: 'right',
    fontFamily: 'ProximaNova-Regular',
    color: 'rgb(255, 255, 255)',
    fontSize: 12.5,
    letterSpacing: 0.83,
  },
  text2: {
    position: 'absolute',
    top: (screenWidth / 6 - 20),
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: 'ProximaNova-Regular',
    color: 'rgb(255, 255, 255)',
    fontSize: 30,
    letterSpacing: 0.83,
  },
  text3: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    textAlign: 'right',
    fontFamily: 'ProximaNova-Regular',
    color: 'rgb(255, 255, 255)',
    fontSize: 12.5,
    letterSpacing: 0.83,
  },
  searchListRow: {
    width: screenWidth,
    backgroundColor: Colors.black,
    flexDirection: 'row',
    paddingBottom: 15
  },
  searchListProfilePictureContainer: {
    width: 64,
    alignItems: 'center',
    marginTop: 3,
  },
  searchListProfilePicture: {
    height: 44,
    width: 44,
    borderRadius: 22,
  },
  namesContainer: {
    width: screenWidth - 54,
    borderBottomWidth: 0.7,
    borderBottomColor: 'rgba(255, 255, 255, 0.17)',
    flexDirection: 'column',
    marginRight: 20,
  },
  username: {
    fontSize: 16.5,
    color: Colors.white,
    lineHeight: 22,
    letterSpacing: 0.8,
    backgroundColor: 'transparent',
    fontFamily:'ProximaNova-Regular',
    paddingBottom: 5
  },
  name: {
    fontSize: 16.5,
    color: Colors.grayText,
    lineHeight: 22,
    letterSpacing: 0.8,
    backgroundColor: 'transparent',
    fontFamily:'ProximaNova-Light',
    paddingBottom: 15
  }
};