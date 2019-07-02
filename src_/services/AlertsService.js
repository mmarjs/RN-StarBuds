/*
 Comman Alert file
*/

import { Alert } from 'react-native';
import Snackbar from "react-native-snackbar";

export function alert(title,message){
  Alert.alert(
    title,
    message,
    [
      {text: 'OK', onPress: () => null},
    ],
    { cancelable: false }
  );
}

export function toastMessage(message){
  Snackbar.show({ title: message, duration: Snackbar.LENGTH_SHORT });
    // action: {
    //   title: "UNDO",
    //   color: "green",
    //   onPress: () => {
    //     /* Do something. */
    //   }
    // }
}
