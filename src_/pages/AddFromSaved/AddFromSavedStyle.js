import { Dimensions } from 'react-native';
import { Colors } from './../../theme';

const screenHeight = Dimensions.get( 'window' ).height;
const screenWidth = Dimensions.get( 'window' ).width;

export const AddFromSavedStyle = {
	container: {
		flex: 1,
		flexDirection: 'column',
    backgroundColor: '#0b0b0b',
  },
  nameText: {
    width: screenWidth,
    marginTop: 27,
    marginLeft: 27.7,
    paddingBottom: 12.7,
    backgroundColor: 'transparent',
    fontFamily: "ProximaNova-Light",
    fontSize: 9.9,
    fontWeight: "300",
    lineHeight: 17.79,
    letterSpacing: 0.5,
    textAlign: "left",
    color: 'rgb(86, 86, 86)'
  },
  inputStyle: {
    width: screenWidth,
    fontSize: 16,
    paddingLeft: 27.7,
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 16,
		letterSpacing: 0.8,
		borderWidth: 0,
		color: Colors.white,
    fontFamily: 'ProximaNova-Light',
    backgroundColor: '#272727'
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
  checkBoxImageStyle: {
    position: 'absolute',
    top: screenWidth / 3 - 24.5,
    left: 5,
    height: 10,
    width: 10,
    padding: 10,
  }
}