import { Platform } from 'react-native';
import { Metrics } from './../theme';
import { saveData } from './StorageService';

export function getCurrentLocation() {
  
  return new Promise((resolve, reject) => {
   
    navigator.geolocation.getCurrentPosition(
      position => {
        saveData('currentLocation', position)
        let currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        resolve(currentLocation);
      },
      error => {
        reject(error.message)
      });
  });
}

export function fetchNearByLocation(currentLocation) {
  return new Promise((resolve, reject) => {
    var temp = [];
    if (Platform.OS === "ios") {
      fetch(Metrics.nearbyPlacesUrlPart1 + currentLocation.latitude + "," + currentLocation.longitude + Metrics.nearbyPlacesUrlPart2IOS)
        .then(response => response.json())
        .then(responseJson => {
          responseJson.results.map(locationObject => {
            temp.push({
              id: locationObject.id,
              description: locationObject.name,
              selected: false,
              address: locationObject.vicinity,
              latitude: locationObject.geometry.location.lat,
              longitude: locationObject.geometry.location.lng
            });
          });
          saveData('nearbyLocations', temp);
          resolve(temp);
          // this.setState({ nearByLocations: temp });
          // this.props.updateLoading(false);
        })
        .catch(error => {
          reject(error);
          // this.props.updateLoading(false);
        });
    } else {
      fetch(Metrics.nearbyPlacesUrlPart1 + currentLocation.latitude + "," + currentLocation.longitude + Metrics.nearbyPlacesUrlPart2Android)
        .then(response => response.json())
        .then(responseJson => {
          responseJson.results.map(locationObject => {
            temp.push({
              id: locationObject.id,
              description: locationObject.name,
              selected: false,
              address: locationObject.vicinity,
              latitude: locationObject.geometry.location.lat,
              longitude: locationObject.geometry.location.lng
            });
          });
          // this.setState({ nearByLocations: temp });
          // this.props.updateLoading(false);
          resolve(temp);
        })
        .catch(error => {
          reject(error);
          // this.props.updateLoading(false);
        });
    }
  })
}