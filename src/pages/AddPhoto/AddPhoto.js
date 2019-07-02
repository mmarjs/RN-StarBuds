import React, { Component } from "react";
import {
  Text,
  View,
  Image
} from "react-native";
import {
  TabNavigator,
  TabBarTop
} from "react-navigation";
import { Colors, Images } from "../../theme";
import CameraView from "../CameraView/CameraView";
import GalleryView from "../GalleryView/GalleryView";
import { StackNavigator } from 'react-navigation';

// import { AddLocationModalStyle } from '../AddLocationModal/AddLocationModalStyle';
const getScreenWithHeader = (screenName, screen, headerMode = 'screen') => {
  const screenObj = {};
  screenObj[screenName] = {
    screen: screen
  };
  return StackNavigator(screenObj, { 
    headerMode,
    cardStyle: {
      backgroundColor: 'white'
    }
  });
};
export default (AddPhoto = TabNavigator(
  {
    Gallery: {
      screen: getScreenWithHeader('GalleryView', GalleryView),
    },
    Photo: {
      screen: getScreenWithHeader('CameraView', CameraView),
    }
  },
  {
    tabBarPosition: "bottom",
    swipeEnabled: false,
    tabBarComponent: props => (
      <TabBarTop
        {...props}
        indicatorStyle={{
          backgroundColor: "#00FF00"
        }}
      />
    ),
    headerMode: 'screen',
    lazy: true,

    tabBarOptions: {
      labelStyle: {
        fontSize: 16,
        fontFamily: "ProximaNova-Semibold",
        letterSpacing: 0.8,
        color : 'black'
      },
      style: {
        backgroundColor: "white",
        borderBottomWidth: 2
      },
      activeTintColor: "white",
      inactiveTintColor: "rgb(117,117,117)",
      tabBarStyle: {
        backgroundColor: "white"
      },
      indicatorStyle: {
        borderColor: Colors.primary
      },
      tabStyle: {
        flex: 1
      }
    },
    cardStyle: {
      backgroundColor: 'white'
    },
  }
));

AddPhoto.navigationOptions = ({ navigation }) => ({
  tabBarVisible: false,
  headerMode: "modal",
});

const styles = {
  backgroundStyle: {
    backgroundColor: "white",
    flex: 1
  }
};
