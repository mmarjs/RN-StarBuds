import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { Images, Colors, Styles } from '../../theme';
import { TabNavigator, NavigationActions, TabBarTop } from 'react-navigation';
import { connect } from 'react-redux';

import FavouriteSavedAll from '../FavouriteSavedAll/FavouriteSavedAll';
import FavouriteSavedGroups from '../FavouriteSavedGroups/FavouriteSavedGroups';
import { FavouriteSavedStyle } from './FavouriteSavedStyle';


export default (FavouriteSaved = TabNavigator(
  {
    All: {
      screen: FavouriteSavedAll
    },
    Groups: {
      screen: FavouriteSavedGroups
    }
  },
  {
    lazy: true,
    tabBarComponent: TabBarTop,
    tabBarPosition: "top",
    animationEnabled: true,
    backBehavior: "none",
    swipeEnabled: true,
    allowFontScaling: false,
    initialRouteName: "All",
    tabBarOptions: {
      upperCaseLabel: false,
      tabStyle: {
        borderBottomWidth: 0,
        borderColor: Colors.warmGrey
      },
      style: {
        backgroundColor: Colors.black
      },
      indicatorStyle: {
        backgroundColor: "rgb(29, 196, 60)",
        height: 3
      }
    }
  }
));
const backAction = NavigationActions.back({ key: null })

FavouriteSaved.navigationOptions = ({ navigation }) => ({
  title: "SAVED",
  headerTitleStyle: Styles.headerTitleStyle,
  headerStyle: Styles.headerStyle,
  tabBarIcon: ({ focused }) => {
    if (navigation.state.params.profileImageUrl != "") {
      if (focused) {
        return (
          <Image
            style={[
              FavouriteSavedStyle.iconImage,
              FavouriteSavedStyle.iconBorderWidth
            ]}
            source={{ uri: navigation.state.params.profileImageUrl }}
            defaultSource={Images.defaultUser}
          />
        );
      }
      return (
        <Image
          style={FavouriteSavedStyle.iconImage}
          source={{ uri: navigation.state.params.profileImageUrl }}
          defaultSource={Images.defaultUser}
        />
      );
    } else {
      if (focused) {
        return (
          <Image
            style={[FavouriteSavedStyle.iconImage, styles.iconBorderWidth]}
            source={Images.defaultUser}
          />
        );
      }
      return (
        <Image
          style={FavouriteSavedStyle.iconImage}
          source={Images.defaultUser}
        />
      );
    }
  },
  headerLeft: (
    <TouchableOpacity
      onPress={() => {
        DeviceEventEmitter.emit("backToProfile", true);
        navigation.dispatch(backAction);
      }}
      style={Styles.headerLeftContainer}
      activeOpacity={0.5}
    >
      <Image
        source={Images.backButton}
        style={[
          Styles.headerLeftImage,
          {
            height: 15,
            width: 8
          }
        ]}
      />
    </TouchableOpacity>
  ),
});
