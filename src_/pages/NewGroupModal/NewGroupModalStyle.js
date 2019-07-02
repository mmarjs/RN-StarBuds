import { Dimensions, Platform } from 'react-native';
import { Colors } from './../../theme';

const screenHeight = Dimensions.get( 'window' ).height;
const screenWidth = Dimensions.get( 'window' ).width;

export const NewGroupModalStyle = {
	container: {
		flex: 1,
		flexDirection: 'column',
    backgroundColor: '#000',
    // backgroundColor: '#0a0a0a'
  },
  nameText: {
    width: screenWidth,
    marginTop: 10,
    marginLeft: 27.7,
    paddingBottom: 12.7,
    backgroundColor: '#000',
    fontFamily: "ProximaNova-Light",
    fontSize: 9.9,
    lineHeight: 17.79,
    letterSpacing: 0.5,
    textAlign: "left",
    color: Colors.inputColor
  },
  inputContainer: {
    flexDirection: 'row',
    width: screenWidth,
    backgroundColor: 'rgb(20,20,20)'
  },
  inputStyle: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 27.7,
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 16,
		letterSpacing: 0.8,
		borderWidth: 0,
		color: Colors.white,
    fontFamily: 'ProximaNova-Light'
  },
  closeIcon: {
    height: 15.3,
    width: 15.3,
    alignSelf: "center"
  },
  cancelGroupTextButton: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: "center",
    marginRight: 10
    },
}