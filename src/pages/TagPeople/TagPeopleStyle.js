import { Dimensions } from 'react-native';
import { Colors } from './../../theme/Colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const TagPeopleStyle = {
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  scrollContainer:{
    borderTopWidth: 0.7,
    borderTopColor: 'rgba(255,255,255,0.17)'
  },
  detailContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  group1: {
    flex: 1/5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft:10
  },
  group2: {
    flex: 4/5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'rgba(255, 255, 255, 0.16)',
    borderBottomWidth: 0.7,
    marginLeft: (screenWidth >= 414 && screenHeight >= 736) ? 2 : 10,
  },

  gridContainer: {
    width: screenWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noPostsText: {
    color: 'white',
    marginTop:20,
    fontSize: 18,
    lineHeight: 18,
    letterSpacing: 0.5,
    fontFamily:'ProximaNova-Light'
  },

  photoConatiner: {
    paddingTop: (screenWidth >= 414 && screenHeight >= 736) ? 15.3 : 10.3,
    paddingBottom: (screenWidth >= 414 && screenHeight >= 736) ? 15.3 : 10.3,
    paddingLeft: (screenWidth >= 414 && screenHeight >= 736) ? 20 : 10,
    alignSelf: 'center',
  },
  usernameConatiner: {
    flex: 1,
    alignSelf: 'center',
  },
  buttonConatiner: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 20
  },
  textUsername: {
    fontSize: 14,
    color: 'rgb(13,14,21)',
    lineHeight: 20,
    letterSpacing: 0,
    backgroundColor: 'transparent',
    fontFamily:'OpenSans-Bold'
  },
  textFullname: {
    fontSize: 12,
    color: Colors.grayText,
    lineHeight: 19,
    letterSpacing: 0,
    backgroundColor: 'transparent',
    fontFamily:'OpenSans-Bold'
  },
  photo: {
    height: 44,
    width: 43,
    borderRadius:22
  },
  followButton: {
    height: 30,
    // alignSelf: 'center',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  followButtonText: {
    fontSize: 14.1,
    // lineHeight: 22,
    letterSpacing: 0.7,
    color: Colors.white,
    paddingRight: 20,
    paddingLeft: 20,
    fontFamily:'ProximaNova-Bold'
  }
}
