import React from 'react';
import * as ReactNavigation from 'react-navigation';
import { connect } from 'react-redux';
import { BackHandler } from 'react-native';
import AppNavigation from './AppNavigation';
import {
  addNavigationHelpers,
  StackNavigator,
  NavigationActions,
  TabNavigator
} from 'react-navigation';
import _ from "lodash";

// here is our redux-aware smart component

class ReduxNavigation extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBackPress.bind(this)
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onBackPress.bind(this)
    );
  }

  onBackPress() {
    const { dispatch, nav } = this.props;
    const activeRoute = nav.routes[nav.index];
    if (activeRoute.index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  }

  render() {
    return (
      <AppNavigation
        navigation={ReactNavigation.addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav
        })}
      />
    );
  }
}

const mapStateToProps = state => ({ nav: state.nav });
export default connect(mapStateToProps)(ReduxNavigation);
