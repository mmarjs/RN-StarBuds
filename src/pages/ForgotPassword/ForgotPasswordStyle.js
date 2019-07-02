import { Colors } from '../../theme'
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const ForgotPasswordStyle = {
    iconStyle: {
      height: 39,
      width: 177
    },
    imageContainer: {
      height: screenHeight,
      width: screenWidth,
      backgroundColor: Colors.black,
      },
    loingFbText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 0.8
    },
    btnText: {
      color: Colors.black,
      fontSize: 18,
      fontWeight: 'bold',
      letterSpacing: 0.8,
      fontFamily: 'SourceSansPro-Bold',
      textAlign: 'center'
    },
    headingText: {
      color: Colors.white,
      fontSize: 16,
      letterSpacing: 0.6,
      fontWeight: 'bold'
    },
    LoginText: {
      width : screenWidth,
      color: Colors.white,
      fontSize: 32,
      fontFamily: 'SourceSansPro-Bold',
      backgroundColor : Colors.clearTransparent,
      paddingTop : screenHeight * 0.05,
      textAlign : 'center'
    },
    subText: {
      fontSize: 15,
      marginTop: 18,
      color: 'white',
      textAlign: 'center',
      fontFamily: 'SourceSansPro-Regular',
      letterSpacing: 0.7,
      lineHeight: 17.24,
    },
    backButton: {
      alignSelf : 'flex-start',
      backgroundColor: Colors.clearTransparent,
      width: 50,
      height : 50,
      top : 50
    },
    errorText:{
      color:Colors.blackTransparent,
      paddingTop:5,
      paddingLeft: 30,
      paddingRight: 30,
      paddingBottom:5,
      fontFamily:'ProximaNova-Regular',
    },
    subTextBold: {
      fontSize: 13,
      marginTop: 18,
      color: 'white',
      textAlign: 'center',
      fontFamily: 'SourceSansPro-Bold',
      letterSpacing: 0.7,
      lineHeight: 17.24,
      width : screenWidth * 0.75,
      backgroundColor : Colors.clearTransparent
    }
};
