import { Dimensions } from 'react-native';
import { Colors } from './../../theme';

const screenHeight = Dimensions.get( 'window' ).height;
const screenWidth = Dimensions.get( 'window' ).width;

export const GroupDetailsStyle = {
	container: {
		flex: 1,
		flexDirection: 'column',
    backgroundColor: '#0a0a0a'
  },
  multipleImageIconStyle: {
    position: 'absolute',
    top: screenWidth / 3 - 27,
    right: 2,
    height: 26.3,
		width: 28.3,
    padding: 10,
  },
  videoIconStyle: {
    position: 'absolute',
    top: screenWidth / 3 - 23.5,
    right: 2,
    height: 21.7,
		width: 27.7,
    padding: 10,
  },
  noPostsText: {
    position: 'absolute',
    width: screenWidth,
    top: screenHeight/2 - 69.7,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'ProximaNova-Bold',
    color: Colors.white,
    letterSpacing: 0.7,
  },
}