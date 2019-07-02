import { View } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import GetStart from '../pages/GetStart/GetStart';
import SignUp from '../pages/SignUp/SignUp';
import Login from '../pages/Login/Login';
import ConfirmEmail from '../pages/ConfirmEmail/ConfirmEmail';
import SignUpWithFacebook from '../pages/SignUpWithFacebook/SignUpWithFacebook';
import Contacts from '../pages/Contacts/Contacts';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import FindFacebookFriends from '../pages/FindFacebookFriends/FindFacebookFriends';
import DiscoverBuddies from '../pages/DiscoverBuddies/DiscoverBuddies';
import AddProfilePicture from '../pages/AddProfilePicture/AddProfilePicture';
import Home from '../pages/Home/Home';
import Discovery from '../pages/Discovery/Discovery_New';
import AddPhoto from '../pages/AddPhoto/AddPhoto';
import Activity from '../pages/Activity/Activity';
import Profile from '../pages/Profile/Profile';
import FavouriteSaved from '../pages/FavouriteSaved/FavouriteSaved';
import FindBuds from '../pages/FindBuds/FindBuds';
import Following from '../pages/FindBuds/Following/Following';
import Followers from '../pages/FindBuds/Followers/Followers';

import PhotosOfUser from '../pages/PhotosOfUser/PhotosOfUser';
import PhotoTags from '../pages/PhotoTags/PhotoTags';
import TagPeople from '../pages/TagPeople/TagPeople';
import NewPost from '../pages/NewPost/NewPost';
import AddCaptionModal from '../pages/AddCaptionModal/AddCaptionModal';
import AddLocationModal from '../pages/AddLocationModal/AddLocationModal';
import PostDetails from '../pages/PostDetails/PostDetails';
import AddComment from '../pages/AddComment/AddComment';
import CameraView from '../pages/CameraView/CameraView';
import GalleryView from '../pages/GalleryView/GalleryView';
import AllChats from '../pages/AllChats/AllChats';
import AddChat from '../pages/AddChat/AddChat';
import ChatMessages from '../pages/ChatMessages/ChatMessages';
import OtherProfile from '../pages/OtherProfile/OtherProfile';
import Settings from '../pages/Settings/Settings';
import ShareStarbudsModal from '../pages/ShareStarbudsModal/ShareStarbudsModal';
import GroupDetails from '../pages/GroupDetails/GroupDetails';
import EditPost from '../pages/EditPost/EditPost';
import SearchHashTags from '../pages/SearchHashTags/SearchHashTags';
import ChangePassword from '../pages/ChangePassword/ChangePassword';

import TabBar from './TabBar';
/**
 * Method to get a StackNavigator with the given screen and a header
 * @param {String} screenName Name of the screen
 * @param {Component} screen Screen to show
 * @param {String} headerMode Mode for the haeder
 * @return {StackNavigator}
 */
const getScreenWithHeader = (screenName, screen, headerMode = 'screen') => {
  const screenObj = {};
  screenObj[screenName] = {
    screen: screen
  };
  return StackNavigator(screenObj, { 
    headerMode,
    cardStyle: {
      backgroundColor: 'white',
      shadowColor: 'transparent',
    }
  });
};

const LoginStack = StackNavigator({
  GetStart: {
    screen: GetStart
  },
  Login: {
    screen: Login,navigationOptions: {
      header: null,
    }
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      header: null,
    }
  },
  SignUpWithFacebook: {
    screen: getScreenWithHeader('SignUpWithFacebook', SignUpWithFacebook)
  },
  ConfirmEmail: {
    screen: ConfirmEmail
  },
  Contacts: {
    screen: getScreenWithHeader('Contacts', Contacts)
  },
  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: {
      header: null,
    }
  },
  FindFacebookFriends: {
    screen: getScreenWithHeader('FindFacebookFriends', FindFacebookFriends)
  },
  DiscoverBuddies: {
    screen: getScreenWithHeader('DiscoverBuddies', DiscoverBuddies)
  },
  AddProfilePicture: {
    screen: AddProfilePicture
  },
}, {
  cardStyle: {
    backgroundColor: 'white'
  },
  headerMode: 'none',
  backBehavior: 'none',
  navigationOptions: {
    headerStyle: {
      backgroundColor: 'white'
    },
    gesturesEnabled: false,
  }
});

const Tabs = TabNavigator(
  {
    Home: {
      screen: getScreenWithHeader('Home', Home),
    },
    Discovery: {
      screen: getScreenWithHeader('Discovery', Discovery),
    },
    AddPhoto: {
      screen: getScreenWithHeader('AddPhoto', AddPhoto),
    },
    Activity: {
      screen: getScreenWithHeader('Activity', Activity),
    },
    Profile: {
      screen: StackNavigator(
        {
          Profile: {
            screen: Profile
          },
          FindBuds: {
            screen: FindBuds,
          },
          Following: {
            screen: Following,
          },
          Followers:{
            screen : Followers,
          },
          FavouriteSaved: {
            screen: FavouriteSaved
          },
          ShareStarbudsModal: {
            screen: ShareStarbudsModal
          },
          PhotosOfUser: {
            screen: PhotosOfUser
          },
          GroupDetails: {
            screen: GroupDetails
          },
          OtherProfileForFindBuds: {
            screen: OtherProfile
          }
        },
        {
          cardStyle: {
            backgroundColor: 'white'
          },
          headerMode: 'screen',
          backBehavior: 'none',
          navigationOptions: {
            headerStyle: {
              backgroundColor: 'white'
            },
            gesturesEnabled: false,
          },
        }
      )
    }
  },
  {
    lazy: true,
    headerMode: 'screen',
    gestureEnabled: false,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      style: {
        backgroundColor: 'white'
      },
      indicatorStyle: {
        backgroundColor: 'white'
      },
      tabStyle: {
        flex: 1
      }
    },
    initialRouteName: 'Home',
    tabBarPosition: 'bottom',
    // Specify our custom navbar
    tabBarComponent: TabBar,
    cardStyle: {
      backgroundColor: 'white'
    },
  }
);

const MainStack = StackNavigator({
  Tabs: {
    screen: Tabs
  },
  AddPhotoModal: {
    screen: StackNavigator({
      AddPhoto: {
        screen: AddPhoto,
        navigationOptions: {
          header: null,
        }
      }
    }),
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  NewPost: {
    screen: StackNavigator(
      {
        NewPost: {
          screen: NewPost,
        },
        AddCaptionModal: {
          screen: AddCaptionModal
        }
      },
      {
        headerMode: 'screen',
        cardStyle: {
          shadowColor: 'transparent',
          backgroundColor: 'white'
        }
      }
    )
  },
  AddLocationModal: {
    screen: getScreenWithHeader('AddLocationModal', AddLocationModal),
    cardStyle: {
      shadowColor: 'transparent',
      backgroundColor: 'white'
    }
  },
  PhotoTags: {
    screen: getScreenWithHeader('PhotoTags', PhotoTags)
  },
  TagPeople: {
    screen: getScreenWithHeader('TagPeople', TagPeople)
  },
  AddComment: {
    screen: getScreenWithHeader('AddComment', AddComment)
  },
  AllChats: {
    screen: getScreenWithHeader('AllChats', AllChats)
  },
  AddChat: {
    screen: getScreenWithHeader('AddChat', AddChat)
  },
  ChatMessages: {
    screen: getScreenWithHeader('ChatMessages', ChatMessages)
  },
  OtherProfile: {
    screen: getScreenWithHeader('OtherProfile', OtherProfile)
  },
  PostDetails: {
    screen: getScreenWithHeader('PostDetails', PostDetails)
  },
  PhotosOfOtherUser: {
    screen: getScreenWithHeader('PhotosOfUser', PhotosOfUser)
  },
  Settings: {
    screen: getScreenWithHeader('Settings', Settings),
  },
  ChangePassword: {
    screen: getScreenWithHeader('ChangePassword', ChangePassword)
  },
  EditPost: {
    screen: getScreenWithHeader('EditPost', EditPost)
  },
  SearchHashTags: {
    screen: getScreenWithHeader('SearchHashTags', SearchHashTags)
  }
}, {
  cardStyle: {
    backgroundColor: 'white',
    shadowColor: 'transparent'
  },
  headerMode: 'none',
  backBehavior: 'none',
  backgroundColor : 'white',
  navigationOptions: {
    headerStyle: {
      backgroundColor: 'white'
    },
    gesturesEnabled: false,
  }
});


const PrimaryNav = StackNavigator(
  {
    loginStack: { screen: LoginStack },
    mainStack: { screen: MainStack },
  },
  {
    cardStyle: {
      backgroundColor: 'white',
      shadowColor: 'transparent'
    },
    headerMode: 'none',
    backBehavior: 'none',
    backgroundColor : 'white',
    navigationOptions: {
      headerStyle: {
        backgroundColor: 'white'
      },
      gesturesEnabled: false,
    },
    initialRouteName: 'loginStack',
  }
);

export default PrimaryNav
