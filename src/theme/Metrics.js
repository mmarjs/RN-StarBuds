import { Dimensions } from "react-native";

export const Metrics = {
  screenWidth: Dimensions.get('window').width,
  screenHeight: Dimensions.get('window').height,
  localUrl: 'http://172.16.1.194:6005/api/',
  porductionUrl: 'http://ec2-13-57-104-119.us-west-1.compute.amazonaws.com:6005/api/',
  // serverUrl: 'http://ec2-13-57-104-119.us-west-1.compute.amazonaws.com:3000/api/', //debug push notification
  nearbyPlacesUrlPart1: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=',
  nearbyPlacesUrlPart2IOS: '&sensor=true&rankby=distance&key=AIzaSyD8KBjRt0hBsgtwklBPgxh-MtDAQ0052qE',
  nearbyPlacesUrlPart2Android: '&sensor=true&rankby=distance&key=AIzaSyCzaw55iZPzuobJxRQQLK2dmJt8pSDk3sk',
  profileImagePrefixForAmazon: 'https://s3-us-west-2.amazonaws.com/starbuds/user_profile/',
  postImagePrefixForAmazon: 'https://s3-us-west-2.amazonaws.com/starbuds/post_photos/',
  firebaseNotificationKey : 'k5z2fALWstAcg3W23c9ZZKRPKLDBshJM',
  
  
  serverUrl: 'http://ec2-13-57-104-119.us-west-1.compute.amazonaws.com:6005/api/',
  // serverUrl: 'http://172.16.1.159:6005/api/',//For local server
};
