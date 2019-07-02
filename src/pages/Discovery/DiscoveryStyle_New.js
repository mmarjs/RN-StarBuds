import { Dimensions } from 'react-native';
import { Colors } from './../../theme/Colors';
import { isIPhoneX } from '../../services/CommonFunctions';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const DiscoveryStyle_New = {
  container: {
    flex: 1,
    marginTop: isIPhoneX() ? -44 : 0,
    marginBottom: isIPhoneX() ? -34 : 0
  },
  pageContainer: {
    flexDirection: 'column',
  },
  imageBottomDetailsBottom: {
    flex: 0.4,
    flexWrap: "wrap",
    flexDirection: "column",
    backgroundColor: "white",
    zIndex: 1
  },
  imageInList: {
    height: screenWidth,
    width: screenWidth,
    maxHeight: screenWidth,
    maxWidth: screenWidth,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1
  },
  imageInListContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
  },
  videoContainer: {
    width: screenWidth,
    height: screenWidth,
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
    top: (screenHeight / 1.5),
    backgroundColor: 'transparent',

  },
  group3: {
    marginTop: screenHeight / 1.12, 
    left: screenWidth * 0.75,
    width : 80,
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
    top: screenHeight / 1.13,
    right : screenWidth * 0.60,
    height : 80,
    position: 'absolute',

  },
  imageContainer: {
    height: isIPhoneX() ? screenHeight * 0.86 : screenHeight * 0.98,
    width: screenWidth ,
    backgroundColor: Colors.clearTransparent,
    resizeMode: 'stretch',
    marginTop : 0,
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
    textMainTitle: {
      color: Colors.white,
      fontSize: 30,
      lineHeight: 21,
      letterSpacing: 0.8,
      justifyContent: "center",
      textAlign: 'center',
      alignItems: 'center',
      fontFamily: 'SourceSansPro-Bold',
      width: screenWidth * 0.80,
      marginTop : 20
  },
  imageTopDetails: {
    flex: 0.2,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: "white"
  },
  imageInListContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
  
  },
  textData: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.8,
    justifyContent: "center",
    textAlign: 'center',
    alignItems: 'center',
    fontFamily: 'SourceSansPro-Regular',
    width: screenWidth * 0.80,
    marginTop : 20
    // marginLeft:screenWidth*0.10,
    // marginRight:screenWidth*0.10,
  },
  AnimatedTextStyle: {
      position: 'absolute',
      top: screenHeight * (isIPhoneX() ? 0.38 : 0.40),
      left: screenWidth * 0.10,
      width : 300, height : 60,
      fontFamily: 'OpenSans-Bold',
      fontSize: 40,
      color :'white'
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
  activityindicatorStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    height : '100%'
  },
  wrapper: {
    backgroundColor: 'white',
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width : screenWidth,
    height : screenHeight
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
