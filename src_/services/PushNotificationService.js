import { AsyncStorage, NetInfo } from "react-native";
import { Metrics } from "../theme";

export function registerPushToken(devicetoken, os, user, authToken) {
  // NetInfo.isConnected.fetch().then(isConnected => {
  //   if (isConnected) {
      fetch(Metrics.serverUrl + "users/addDeviceToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
          userid: user._id
        },
        body: JSON.stringify({
          "userId": user._id,
          "deviceToken": devicetoken
        })
      })
        .then(response => response.json())
        .then(response => {
        })
        .catch(error => {
        });
  //   } else {
  //   }
  // });
}