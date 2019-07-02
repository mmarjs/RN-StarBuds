import { Dimensions } from 'react-native';
import { Colors } from './../../theme';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const SettingsStyle = {
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center'
    borderTopWidth: 1,
		backgroundColor: 'white',
		borderColor: 'rgba(255, 255, 255, 0.17)'
  },
  profileImageContainer: {
    //flex: 0.28,
    
		marginBottom: 5,
		marginTop: 25,
		alignItems: 'center',
		justifyContent: 'flex-end',
    height: 100,		// height: (screenWidth >= 414 && screenHeight >= 736)
		// ? 85
		// : 75,		
  },
  profileImage: {
		width: (screenWidth >= 414 && screenHeight >= 736)
			? 100
			: 90,
		height: (screenWidth >= 414 && screenHeight >= 736)
			? 100
			: 90,
		borderRadius: (screenWidth >= 414 && screenHeight >= 736)
			? 50
			: 45,
    zIndex: 1,
    marginTop : 55,
		borderColor : Colors.clearTransparent,
		borderWidth : 1.0,
	},
  profileImageIndicator: {
		top: -25,
		left: 40,
		zIndex: 10,
	},
  listRow: {
    height: screenHeight / 11,
    backgroundColor: 'white',
    alignItems: "center",
    flexDirection: "row",
    // borderBottomWidth: 0.8,
    // borderColor: 'rgba(255, 255, 255, 0.17)',
    marginLeft: 20,
    marginRight: 20,
  },
  textContainer: {
    flex: 0.7,
  },
  iconContainer: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: "center",
  },
  listText: {
    fontSize: 16,
    color: 'black',
    fontFamily: "ProximaNova-Regular",
    letterSpacing: 0.7,
  },
  notificationEnableIndicator: {
    justifyContent: "center",
    alignItems: "flex-start"
  }
};