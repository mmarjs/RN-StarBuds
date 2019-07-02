/*
 Custom Auth service file
*/
import { Alert, NetInfo } from "react-native";
import FBSDK, { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import Moment from "moment";
import { Metrics } from "../theme";
import { alert } from "./AlertsService";
import { mapFacebookFriends } from "./CommonFunctions";

NetInfo
  .isConnected
  .addEventListener("change", Function.prototype);

export function apiCall(apiName, data, header) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      NetInfo
        .isConnected
        .fetch()
        .then(isConnected => {
          if (isConnected) {
            fetch(Metrics.serverUrl + apiName, {
              method: "POST",
              headers: header
                ? header
                : {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
              })
              .then(response => response.json())
              .then(responseJson => {
                if (responseJson.status) {
                  resolve(responseJson);
                } else {
                  reject(responseJson);
                }
              })
              .catch(error => {

                reject(error);
              });
          } else {
            reject('no network')
          }
        });
    }, 100);
  });
}

export function postCall(apiName, opts = {}, onProgress) {
  return new Promise((res, rej) => {
    var xhr = new XMLHttpRequest();
    xhr.open(opts.method || "get", apiName);
    for (var k in opts.headers || {}) 
      xhr.setRequestHeader(k, opts.headers[k]);
    xhr.onload = e => res(e.target.responseText);
    xhr.onerror = rej;
    if (xhr.upload && onProgress) 
      xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
    xhr.send(opts.body);
  });
}

export function facebookLogin() {
  return new Promise((resolve, reject) => {
    LoginManager.logOut();
    LoginManager
      .logInWithReadPermissions(["public_profile", "email", "user_birthday", "user_friends"])
      .then(result => {
        if (result.isCancelled) {
          // alert('Failure', 'Facebook login cancelled by user');
          reject("Facebook login cancelled by user");
        } else {
          // Create response callback.
          const responseInfoCallback = (error, result) => {
            if (error) {
              // alert('Failure', 'Error fetching data:');
              reject("Error fetching data from Facebook!");
            } else {
              let facebookResponse = {
                name: "",
                email: "",
                username: "",
                dateofbirth: "", //Aug-16-2017
                gender: "",
                socialId: "",
                profileImageUrl: "",
                friends: []
              };
              if (result.id) {
                facebookResponse.socialId = result.id;
              }
              if (result.email) {
                facebookResponse.email = result.email;
              }
              if (result.name) {
                facebookResponse.name = result.name;
              }
              if (result.gender) {
                var temp = result
                  .gender
                  .charAt(0)
                  .toUpperCase() + result
                  .gender
                  .slice(1);
                facebookResponse.gender = temp;
              }
              if (result.birthday) {
                var dt = new Date(result.birthday);
                dt = Moment(dt).format("MMM-DD-YYYY");
                facebookResponse.dateofbirth = dt;
              }
              if (result.picture.data.url) {
                facebookResponse.profileImageUrl = result.picture.data.url;
              }
              // if (result.friends.data) {
              //   facebookResponse.friends = mapFacebookFriends(result.friends.data);
              // }
              resolve(facebookResponse);
            }
          };
          // Create a graph request asking for user email and names with a callback to
          // handle the response.
          const infoRequest = new GraphRequest("/me", {
            parameters: {
              fields: {
                string: "email, name, birthday, gender, picture.type(large), friends"
              }
            }
          }, responseInfoCallback);
          // Start the graph request.
          new GraphRequestManager()
            .addRequest(infoRequest)
            .start();
        }
      })
      .catch(error => {
        reject("Failed to login with facebook!");
      });
  });
}

/**
 * Make a request to loginWith Facebook to api
 * @param {object} registerData data to pass to api
 * @return {promise} Resolves if user is registered and gives user data, or if user is not registered gives message 'Please send all the details', rejects if there is an error
 */
export function registerFacebookLogin(registerData) {
  return new Promise((resolve, reject) => {
    apiCall("users/signup", registerData).then(response => {
      if (response.status) {
        resolve(response.result);
      } else {
        reject(response.message);
      }
    }).catch(error => {
      reject(error.message);
    });
  });
}

export function getFacebookFriends() {
  return new Promise((resolve, reject) => {
    AccessToken
      .getCurrentAccessToken()
      .then(data => {
        if (data) {
          let currentFacebookAccessToken = data.accessToken;
          const responseInfoCallback = (error, result) => {
            if (error) {
              // alert('Failure', 'Error fetching data:');
              reject("Error fetching data from Facebook!");
            } else {
              if (result.friends.data) {
                resolve(mapFacebookFriends(result.friends.data));
              } else {
                resolve([]);
              }
            }
          };
          const infoRequest = new GraphRequest("/me", {
            parameters: {
              fields: {
                string: "friends"
              }
            }
          }, responseInfoCallback);
          // Start the graph request.
          new GraphRequestManager()
            .addRequest(infoRequest)
            .start();
        } else {
          reject("No token");
        }
      })
      .catch(error => {
        reject("No token");
      });
  });
}

export function getPostDetails(postId, user, token) {
  return new Promise((resolve, reject) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      userid: user._id
    };
    let data = {
      userId: user._id,
      id: postId
    };
    apiCall("posts/getSinglePost", data, headers).then(response => {
      if (response.status) {
        resolve(response.result[0]);
      } else {
        reject(response.message);
      }
    }).catch(error => {
      reject(error.message);
    });
  });
}

export function getUserDetails(userId, user, token) {
  return new Promise((resolve, reject) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      userid: user._id
    };
    let data = {
      userId: userId,
      pageNo: 0
    };
    apiCall("users/getUserDetails", data, headers).then(response => {
      if (response.status) {
        resolve(response.result.userDetails);
      } else {
        reject(response.message);
      }
    }).catch(error => {
      reject(error.message);
    });
  });
}

export function updateReadNotification(notificationId, user, token) {
  return new Promise((resolve, reject) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      userid: user._id
    };
    let data = {
      notificationId: notificationId
    };
    apiCall("users/readNotification", data, headers).then(response => {
      if (response.status) {
        resolve(response.result);
      } else {
        reject(response.message);
      }
    }).catch(error => {
      reject(error.message);
    });
  });
}

export function getActivites(user, token, pageNo) {
  return new Promise((resolve, reject) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      userid: user._id
    };
    let data = {
      userId: user._id,
      pageNo: pageNo
    };
    apiCall("users/getUserActivity", data, headers).then(response => {
      if (response.status) {
        resolve(response.result);
      } else {
        reject(response.message);
      }
    }).catch(error => {
      reject(error.message);
    });
  });
}

export function logoutFromFacebook() {
  LoginManager.logOut();
}
