import { Colors, Images } from '../../theme';
import { Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const AddChatStyle = {
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopWidth: 0.7,
    borderTopColor: 'rgba(255, 255, 255, 0.10)',
  },
  flatListContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  chatUserImageContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  userAvatar: {
    height: screenHeight / 15,
    width: screenHeight / 15,
    borderRadius: (screenHeight / 15) / 2,
  },
  chatName: {
    color: Colors.dark,
    fontSize: 16.5
  },
  chatTimestamp: {
    flex: 0.2,
    alignItems: 'center'
  },
  chatDetail: {
    flex: 0.7
  },
  chatUserProfileImage: {
    height: screenHeight / 15,
    width: screenHeight / 15,
    borderRadius: (screenHeight / 15) / 2,
  },
  // addPhotoImage: {
  //     width: 23.7,
  //     height: 23.7
  // },
  flatItemContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center'
  },
  boldFont: {
    fontFamily: 'ProximaNova-Bold'
  },
  noUsersContainer: {
    alignItems: 'center',
    flex: 1,
    marginTop: 50,
    backgroundColor: 'white'
  },
  noUsersText: {
    fontFamily : 'SourceSansPro-Regular',
    fontSize: 16,
    color: 'black'
  }
}