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
  listRow: {
    height: screenHeight / 11,
    backgroundColor: Colors.white,
    alignItems: "center",
    flexDirection: "row",
    // borderBottomWidth: 0.8,
		backgroundColor: 'white',
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
    color: Colors.black,
    fontFamily: "ProximaNova-Regular",
    letterSpacing: 0.7,
  },
  notificationEnableIndicator: {
    justifyContent: "center",
    alignItems: "flex-start"
  }
};