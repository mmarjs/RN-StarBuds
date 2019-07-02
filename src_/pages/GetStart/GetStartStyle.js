import { Dimensions } from 'react-native';
import { Colors } from './../../theme/Colors';
import { isIPhoneX } from '../../services/CommonFunctions';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const GetStartStyle = {
  container: {
    flex: 1,
    marginTop: isIPhoneX() ? -44 : 0,
    marginBottom: isIPhoneX() ? -34 : 0
  },
  pageContainer: {
    flexDirection: 'column',
  },
  group1: {
    top: (screenHeight / 5.3),
    left: 0,
    right: 0,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    // backgroundColor: 'red',

  },
  group2: {
    position: 'absolute',
    alignItems: 'center',
    left: 0,
    right: 0,
    top: (screenHeight / 2.4),
    backgroundColor: 'transparent',

  },
  group3: {
    top: (screenWidth >= 414 && screenHeight >= 736) ? (screenHeight / 1.34) : (screenHeight / 1.4),
    left: (screenWidth >= 414 && screenHeight >= 736) ? 79 : 60,
    right: (screenWidth >= 414 && screenHeight >= 736) ? 79 : 60,
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  customDotPosition: {
    // top: (screenWidth >= 414 &&  screenHeight >= 736) ? (screenHeight / 3.0) : (screenHeight / 3.0),
    // top: (screenWidth >= 414 && screenHeight >= 736) ? (screenHeight / 5.5) : (screenHeight / 4),
    // top: (screenHeight>=400 && screenHeight <= 450) ? screenHeight/2.5 : 0
    top: (screenHeight <= 600) ? screenHeight / 3.1 : screenHeight / 4.8
  },
  imageContainer: {
    height: screenHeight,
    width: screenWidth,
    backgroundColor: Colors.black,
  },
  headerImage: {
    width: 290,
    height: 67,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    color: Colors.white,
    fontSize: 20.1,
    lineHeight: 31,
    letterSpacing: 1,
    fontFamily: 'ProximaNova-Bold'
  },
  textData: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.8,
    justifyContent: "center",
    textAlign: 'center',
    alignItems: 'center',
    fontFamily: 'ProximaNova-Light',
    width: screenWidth * 0.80
    // marginLeft:screenWidth*0.10,
    // marginRight:screenWidth*0.10,
  },
  createAccountText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    // lineHeight: 25,
    letterSpacing: 0.8,
    textAlign: 'center',
    fontFamily: 'ProximaNova-Bold'
  },
  logInTextSmall: {
    color: Colors.white,
    fontSize: 12,
    letterSpacing: 0.6,
    paddingTop: 11,
    paddingBottom: 11,
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'ProximaNova-Regular'
  },
  logInText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    // lineHeight: 25,
    letterSpacing: 0.8,
    textAlign: 'center',
    fontFamily: 'ProximaNova-Bold'
  },
  logInTextOnPress: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    // lineHeight: 25,
    letterSpacing: 0.8,
    textAlign: 'center',
    fontFamily: 'ProximaNova-Bold'
  },
  wrapper: {
    // backgroundColor: 'red',
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide4: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
