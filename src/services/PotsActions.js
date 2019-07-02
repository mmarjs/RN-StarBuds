import React, { Component } from "react";
import { ActivityIndicator, Alert, DeviceEventEmitter, NetInfo } from 'react-native';
import { Colors, Metrics } from '../theme';
import { navigateTo } from '../services/CommonFunctions';

export function editPost(post, user, token) {
  return new Promise((resolve, reject) => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected) {
        fetch(
          Metrics.serverUrl + 'posts/updatePost', 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
              'userid': user._id
            },
            body: JSON.stringify(post)
          }
        ).then(response => response.json())
        .then(responseJson => {
          DeviceEventEmitter.emit('refreshProfileFeed', {});
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
  });
}

export function deletePost(post, user, token) {
  return new Promise((resolve, reject) => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected) {
        // console.log("delete post",{
        //   post: post._id,
        //   user: user._id
        // })
        fetch(
          Metrics.serverUrl + 'posts/deletePost', 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
              'userid': user._id
            },
            body: JSON.stringify({
              post: post._id,
              user: user._id
            })
          }
        ).then(response => response.json())
        .then(responseJson => {
          console.log('responseJson', responseJson);
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
  });
}