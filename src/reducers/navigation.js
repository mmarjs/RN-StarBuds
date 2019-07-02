import { NavigationActions } from "react-navigation";
import { AppNavigator } from "../navigators/AppNavigator";
const firstScreen = AppNavigator.router.getStateForAction(
  AppNavigator.router.getActionForPathAndParams("GetStart")
);

const initialState = AppNavigator.router.getStateForAction(firstScreen);

const nav = (state = initialState, action) => {
  let nextState = null;
 switch (action.type) {
    case "GetStart":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "GetStart",
          params: action.params
        }),
        state
      );
      break;
    case "Login":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "Login",
          params: action.params
        }),
        state
      );
      break;
    case "SignUp":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "SignUp",
          params: action.params
        }),
        state
      );
      break; 
    case "ConfirmEmail":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "ConfirmEmail",
          params: action.params
        }),
        state
      );
      break;
    case "SignUpWithFacebook":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "SignUpWithFacebook",
          params: action.params
        }),
        state
      );
      break;
    case "Tabs":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "Tabs",
          params: action.params
        }),
        state
      );
      break;
    case "Contacts":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "Contacts",
          params: action.params
        }),
        state
      );
      break;
    case "ForgotPassword":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "ForgotPassword",
          params: action.params
        }),
        state
      );
      break;
    case "FindFacebookFriends":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "FindFacebookFriends",
          params: action.params
        }),
        state
      );
      break;
    case "DiscoverBuddies":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "DiscoverBuddies",
          params: action.params
        }),
        state
      );
      break;
    case "FavouriteSaved":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "FavouriteSaved",
          params: action.params
        }),
        state
      );
      break;
    case "FindBuds":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "FindBuds",
          params: action.params
        }),
        state
      );
      break;
    case "PhotosOfUser":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "PhotosOfUser",
          params: action.params
        }),
        state
      );
      break;
    case "PhotoTags":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "PhotoTags",
          params: action.params
        }),
        state
      );
      break;
    case "TagPeople":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "TagPeople",
          params: action.params
        }),
        state
      );
      break;
    case "AddProfilePicture":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "AddProfilePicture",
          params: action.params
        }),
        state
      );
      break;
    case "NewPost":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "NewPost",
          params: action.params
        }),
        state
      );
      break;
    case "AddCaptionModal":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "AddCaptionModal",
          params: action.params
        }),
        state
      );
      break;
    case "AddLocationModal":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "AddLocationModal",
          params: action.params
        }),
        state
      );
      break;
    case "PostDetails":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "PostDetails",
          params: action.params
        }),
        state
      );
      break;
    case "AddComment":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "AddComment",
          params: action.params
        }),
        state
      );
      break;
    case "AddCommentForProfile":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "AddCommentForProfile",
          params: action.params
        }),
        state
      );
      break;
    case "AllChats":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "AllChats",
          params: action.params
        }),
        state
      );
      break;
    case "PostHome":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "PostDetailsForHome",
          params: action.params
        }),
        state
      );
      break;
    case "PhotosOfUserHome":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "PhotosOfUserHome",
          params: action.params
        }),
        state
      );
      break;
    case "AddChat":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "AddChat",
          params: action.params
        }),
        state
      );
      break;
    case "ShareInChat":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "ShareInChat",
          params: action.params
        }),
        state
      );
      break;
    case "Settings":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "Settings",
          params: action.params
        }),
        state
      );
      break;
    case "PostDetailsForHome":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "PostDetailsForHome",
          params: action.params
        }),
        state
      );
      break;
    case "OtherProfile":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "OtherProfile",
          params: action.params
        }),
        state
      );
      break;
    case "Profile":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "Profile",
          params: action.params
        }),
        state
      );
      break;
    case "AddPhotoModal":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "AddPhotoModal",
          params: action.params
        }),
        state
      );
      break;
    case "Following":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "Following",
          params: action.params
        }),
        state
      );
      break;
      case "Followers":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "Followers",
          params: action.params
        }),
        state
      );
      break;
    case "ShareStarbudsModal":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "ShareStarbudsModal",
          params: action.params
        }),
        state
      );
      break;
    case "You":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "You",
          params: action.params
        }),
        state
      );
      break;
    case "OtherProfileForProfile":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "OtherProfileForProfile",
          params: action.params
        }),
        state
      );
      break;
    case "Buds":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "Buds",
          params: action.params
        }),
        state
      );
      break;
    case "Featured":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "Featured",
          params: action.params
        }),
        state
      );
      break;
    case "Following":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "Following",
          params: action.params
        }),
        state
      );
      break;
      case "Followers":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "Followers",
          params: action.params
        }),
        state
      );
      break;
    case "PostDetailsForActivity":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "PostDetailsForActivity",
          params: action.params
        }),
        state
      );
      break;
    case "OtherProfileForActivity":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "OtherProfileForActivity",
          params: action.params
        }),
        state
      );
      break;
    case "AddCommentForActivity":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "AddCommentForActivity",
          params: action.params
        }),
        state
      );
      break;
    case "GroupDetails":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "GroupDetails",
          params: action.params
        }),
        state
      );
      break;
    case "PhotosOfUserForActivity":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "PhotosOfUserForActivity",
          params: action.params
        }),
        state
      );
      break;
    case "ChatMessagesForActivity":
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "ChatMessagesForActivity",
          params: action.params
        }),
        state
      );
      break;
    case 'OtherProfileForDiscovery':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "OtherProfileForDiscovery",
          params: action.params
        }),
        state
      );
      break;
    case 'AddCommentForDiscovery':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "AddCommentForDiscovery",
          params: action.params
        }),
        state
      );
      break;
    case 'PhotosOfUserForDiscovery':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "PhotosOfUserForDiscovery",
          params: action.params
        }),
        state
      );
      break;
    case 'ChatMessagesForDiscovery':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "ChatMessagesForDiscovery",
          params: action.params
        }),
        state
      );
      break;
    case 'PostDetailsForDiscovery':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: "PostDetailsForDiscovery",
          params: action.params
        }),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      //nextState = state;
      // console.log('Default in navigation.js', nextState)
      break;
  }
  
  // Simply return the original `state` if `nextState` is null or undefined.  
  return nextState || state;
 
};

export default nav;
