import { Dimensions, Platform } from 'react-native';
import { Colors } from './../../theme';

const screenHeight = Dimensions.get( 'window' ).height;
const screenWidth = Dimensions.get( 'window' ).width;

export const NewGroupModalStyle = {
	container: {
		flex: 1,
		flexDirection: 'column',
    backgroundColor: 'white',
    // backgroundColor: '#0a0a0a'
  },
  nameText: {
    width: screenWidth,
    marginTop: 10,
    marginLeft: 27.7,
    paddingBottom: 12.7,
    backgroundColor: 'white',
    fontFamily: "OpenSans-Bold",
    fontSize: 12,
    lineHeight: 17.79,
    letterSpacing: 0.5,
    textAlign: "left",
    color: Colors.dark
  },
  inputContainer: {
    flexDirection: 'row',
    width: screenWidth,
    backgroundColor: 'rgb(240,241,244)'
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
		color: 'black',
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