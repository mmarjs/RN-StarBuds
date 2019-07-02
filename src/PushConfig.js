import PushNotification from "react-native-push-notification";
import { Platform, AsyncStorage, NetInfo, AppState, DeviceEventEmitter } from "react-native";
import { NavigationActions } from "react-navigation";
import { Metrics } from './theme';
import {
  getPostDetails,
  getUserDetails,
  updateReadNotification
} from "./services/AuthService";
import { registerPushToken } from "./services/PushNotificationService";
import { getData, getStringData, saveData } from './services/StorageService';

export default (pushConfig = (store) => {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: devicetoken => {
      getData("user")
        .then(user => {
          registerPushToken(
            devicetoken.token,
            devicetoken.os,
            user.user,
            user.token
          );
        })
        .catch(err => {
          saveData("deviceToken", devicetoken);
        });
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: notification => {
      console.log('\n\n\n\n\n\nonNotification = ', notification, '\n\n\n\n\n\n\n')
      let currentUser, token;
     
      getData("user")
        .then(user => {
          token = user.token;
          currentUser = user.user;
          getStringData('currentScreen').then(screen => {
            if(screen == 'Activity') {
              DeviceEventEmitter.emit("refreshActivity", {});
            } else {
              DeviceEventEmitter.emit("updateActivityStatus", true);
            }
            generateNotification(notification, currentUser, token, screen);
          }).catch(err => {
            console.log('Can not get current screen = ', err)
            generateNotification(notification, currentUser, token, "Home");
          });
        }).catch(err => {
        });
    },

    // ANDROID ONLY: GCM Sender ID. change this when client's google credential are available
    senderID: "456933032214",

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    // Leave this off unless you have good reason.
    popInitialNotification: true,

    /**
     * IOS ONLY: (optional) default: true
     * - Specified if permissions will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * This example app shows how to best call requestPermissions() later.
     */
    requestPermissions: true
  });
  PushNotification.popInitialNotification(notification => {
    console.log('====notification', notification)
  })
  function generateNotification(notification, currentUser, token, currentScreen) {
    // console.log('In generateNotification')
    if(Platform.OS == 'ios') {
      if (!notification.foreground) {
        handleNavigation(notification.data, currentUser, token, currentScreen);
      } else {
        if(notification.data.userTapped == 'true'){
          handleNavigation(notification.data, currentUser, token, currentScreen);
        }
      //  check current screen and show notification
        // console.log('In foregorund', notification)
        // if(notification.data.remote) {
        //   PushNotification.localNotification({
        //     title: notification.title,
        //     message: notification.body,
        //   });
        // }
      //  handleNavigation(notification.data, currentUser, token, currentScreen);
        
      }
      updateReadNotification(notification.data.nId, currentUser, token);
    } else {
      if (!notification.foreground) {
        let data = null;
        let notification_id = null;
        if (notification.hasOwnProperty("google.message_id")) {
          data = notification;
          notification_id = notification.nId;
        } else {
          data = JSON.parse(notification.tag);
          notification_id = data.nId;
        }
        handleNavigation(data, currentUser, token, currentScreen);
        updateReadNotification(notification_id, currentUser, token);
      } else {
        PushNotification.localNotification({
          message: notification.message,
          tag: JSON.stringify(notification)
        });
      }
    }
  }

  function handleNavigation(notification, user, token, currentScreen) {
    switch (notification.notificationType) {
      case "comment":
        getPostDetails(notification.id, user, token)
          .then(response => {
            let pageParams = { post: response, user: response.userDetail[0] };
            const navigateAction = NavigationActions.navigate({
              routeName: 'PostDetails',
              params: pageParams
            });
            store.dispatch(navigateAction);
          })
          .catch(err => {
          });
        break;
      case "like":
        getPostDetails(notification.id, user, token)
          .then(response => {
            let pageParams = { post: response, user: response.userDetail[0] };
            const navigateAction = NavigationActions.navigate({
              routeName: 'PostDetails',
              params: pageParams
            });
            store.dispatch(navigateAction);
          })
          .catch(err => {
          });
        break;
      case "taggedUser":
        getPostDetails(notification.id, user, token)
          .then(response => {
            let pageParams = { post: response, user: response.userDetail[0] };
            const navigateAction = NavigationActions.navigate({
              routeName: 'PostDetails',
              params: pageParams
            });
            store.dispatch(navigateAction);
          })
          .catch(err => {
          });
        break;
      case "follow":
        const navigateAction = NavigationActions.navigate({
          routeName: 'OtherProfile',
          params: {
            profileId: notification.id,
            profileName: notification.username,
            from: "Home"
          }
        });
        store.dispatch(navigateAction);
        break;
      case "chat":
        console.log('chat notification type')
        const navigateAction2 = NavigationActions.navigate({
          routeName: "ChatMessages",
          params: {
            chatID: notification.data.chatID,
            chatName: notification.data.chatName,
            chatUserId: notification.data.chatUserId
          }
        });
        store.dispatch(navigateAction2);
      default:
        break;
    }
  }
});
