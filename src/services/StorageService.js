import { AsyncStorage } from 'react-native';

export async function saveData(key, data) {
  let dataToBeSaved = typeof data == 'string' ? data : JSON.stringify(data);
  try {
    await AsyncStorage.setItem(key, dataToBeSaved);
    return true;
  } catch(err) {
    return err;
  };
}

export function getData(key) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key).then(data => {
      if(data != null) {
        resolve(JSON.parse(data));
      } else {
        reject(null);
      }
    }).catch(error => {
      reject('error');
    });
  });
}

export function removeData(key) {

  return new Promise((resolve, reject) => {
    AsyncStorage.removeItem(key).then(success => {
      resolve(true);
    }).catch(error => {
      reject(false);
    });
  });
}

export function storeUser(newUser) {
  user = newUser;
  saveData('user', user);
}

export function deleteUser(key) {
  removeData(key);
}

export function getUser() {
  return user;
}

export function storeToken(newToken) {
  token = newToken;
  saveData('token', token);
}

export function getToken() {
  return token;
}

export function getStringData(key) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key).then(data => {
      if(data != null) {
        resolve(data);
      } else {
        reject(null);
      }
    }).catch(error => {
      reject('error');
    });
  });
}