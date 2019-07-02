import { PermissionsAndroid } from 'react-native';
import Permissions from 'react-native-permissions';

export function checkPermission(permission) {
  return PermissionsAndroid.check(permission);
}

export function getPermission(permission, permissionTitle, permissionMessage) {
  try {
    const granted = PermissionsAndroid.request(
      permission,
      {
        'title': permissionTitle,
        'message': permissionMessage,
      },
    );
    if (granted) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return true;
  }
}

export function _checkPermission(type) {
    return new Promise((resolve, reject) =>{
      Permissions.check(type)
       .then(response => {
         //response is an object mapping type to permission
        if(response != 'authorized'){
          Permissions.request(type)
          .then(res => {
            resolve(res);
            //returns once the user has chosen to 'allow' or to 'not allow' access
            //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
          },err=>{
            reject(err)
          });
        }else {
          resolve('authorized')
        }
       },err=>{
         reject(err)
       });
    })
    // return new Promise((resolve, reject) =>{
    //   Permissions.checkMultiplePermissions(['camera', 'photo'])
    //    .then(response => {
    //      //response is an object mapping type to permission
    //       if(response.photo != 'authorized'){
    //         Permissions.request('photo')
    //           .then(response => {
    //            //resolve(response)
    //             //returns once the user has chosen to 'allow' or to 'not allow' access
    //             //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
    //           },err=>{
    //             //reject(err)
    //           });
    //       }
    //       if(response.camera !== 'authorized'){
    //         Permissions.request('camera')
    //           .then(response => {
    //            //resolve(response)
    //             //returns once the user has chosen to 'allow' or to 'not allow' access
    //             //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
    //           },err=>{
    //             //reject(err)
    //           });
    //       }
    //    });
    // })
  }
