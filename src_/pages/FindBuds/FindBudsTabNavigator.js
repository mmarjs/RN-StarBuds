import React, {Component} from 'react';
import {CachedImage} from "react-native-cached-image";
import {Dimensions, Image, Text, TouchableOpacity, Platform} from 'react-native';
import {Images, Colors, Styles} from '../../theme';
import {TabNavigator, NavigationActions, TabBarTop} from 'react-navigation';
import {connect} from 'react-redux';
import Share, {ShareSheet, Button} from 'react-native-share';

import Buds from "./Buds/Buds";
import Featured from "./Featured/Featured";

import {FindBudsStyle} from "./FindBudsStyle";

const screenHeight = Dimensions
  .get("window")
  .height;

export default FindBudsTabNavigator = TabNavigator({
  Buds: {
    screen: Buds
  },
  Featured: {
    screen: Featured
  }
}, {
  lazy: true,
  tabBarComponent: TabBarTop,
  tabBarPosition: "top",
  animationEnabled: true,
  swipeEnabled: true,
  allowFontScaling: false,
  backBehavior: 'none',
  tabBarOptions: {
    upperCaseLabel: false,
    tabStyle: {
      borderBottomWidth: 1,
      borderColor: Colors.warmGrey
    },
    style: {
      backgroundColor: '#FFFFFF'
    },
    indicatorStyle: {
      backgroundColor: 'rgb(29, 196, 60)',
      height: 3
    }
  }
});
