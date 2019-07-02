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
// import { AddLocationModalStyle } from '../AddLocationModal/AddLocationModalStyle';

export default (AddPhoto = TabNavigator(
  {
    Gallery: {
      screen: GalleryView
    },
    Photo: {
      screen: CameraView
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
    tabBarOptions: {
      labelStyle: {
        fontSize: 16,
        fontFamily: "ProximaNova-Semibold",
        letterSpacing: 0.8
      },
      style: {
        backgroundColor: "black",
        borderBottomWidth: 2
      },
      activeTintColor: "white",
      inactiveTintColor: "rgb(117,117,117)",
      tabBarStyle: {
        backgroundColor: "rgb(24,24,24)"
      },
      indicatorStyle: {
        borderColor: Colors.primary
      },
      tabStyle: {
        flex: 1
      }
    }
  }
));

AddPhoto.navigationOptions = ({ navigation }) => ({
  tabBarVisible: false,
  headerMode: "modal",
});

const styles = {
  backgroundStyle: {
    backgroundColor: "black",
    flex: 1
  }
};
