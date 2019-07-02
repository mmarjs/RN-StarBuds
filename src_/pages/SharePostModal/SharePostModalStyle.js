import { Dimensions } from 'react-native';
import { Colors } from './../../theme';

const screenHeight = Dimensions.get( 'window' ).height;
const screenWidth = Dimensions.get( 'window' ).width;
import { isIPhoneX } from '../../services/CommonFunctions';

export const SharePostModalStyle = {
	modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000080',
    marginBottom: isIPhoneX() ? 40 : 0
		//flexDirection: 'column',
    //backgroundColor: '#181818',
    
  },
  container: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  iconStyleDefault: {
    alignSelf: 'center'
  },
	iconStyle: {
		height: 23.7,
		width: 23.7
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
    flex: 1,
    fontSize: 16.5,
    paddingLeft: 10,
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 16,
		letterSpacing: 0.8,
		borderWidth: 0,
		color: Colors.white,
    fontFamily: 'ProximaNova-Light',
    //backgroundColor: '#272727',
    //backgroundColor: '#181818',
    backgroundColor: '#000'
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
  userListContainer: {
    height: 130,
    //backgroundColor: Colors.black,
    flexDirection: "row",
    borderColor: Colors.black,
    borderTopWidth: 1,
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20
    //padding: 20
  },
  userProfileImage: {
    height: 58.3,
    width:  58.3,
    borderRadius: 58.3 / 2,
  },
  sendButton:{
    backgroundColor: 'rgb(28,188,53)',
    height: 51.3,
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText:{
    fontFamily: 'ProximaNova-Bold',
    fontSize: 16.5,
    color: Colors.white,
    textAlign: 'center'
  },
  checkBoxImageStyle: {
    position: 'absolute',
    top: 29 - 12 ,
    left: 29 - 12 ,
    height: 24,
    width: 24,
    padding: 10
  },
  closeButtonWrapper: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    //backgroundColor: "#000000",
    height: 51.3,
    width: screenWidth,
  }
}