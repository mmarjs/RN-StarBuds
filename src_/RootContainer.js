import React, { Component } from "react";
import { AsyncStorage, View, StatusBar, DeviceEventEmitter } from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import SplashScreen from "react-native-splash-screen";
import ReduxNavigation from './navigators/ReduxNavigation';
import { getData, saveData } from "./services/StorageService";
import { setUserData, setToken, updateNewActivity } from "./actions";
import { getCurrentLocation, fetchNearByLocation } from "./services/LocationService";
import { isIPhoneX } from './services/CommonFunctions';
import { Styles } from "./theme";
import { SafeAreaView } from 'react-navigation';

class RootContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }
  }

  componentDidMount(){
    getCurrentLocation().then(currentLocation => {
      fetchNearByLocation(currentLocation);
    });
  }
  componentWillMount() {
    getData("user")
      .then(response => {
        this.props.setUserData(response.user);
        this.props.setToken(response.token);
        const navigateAction1 = NavigationActions.navigate({
          routeName: "mainStack",
          params: response.user
        });
        this.props.store.dispatch(navigateAction1);
        this.setState({ isLoading: false});
        SplashScreen.hide();
      })
      .catch(err => {
        const navigateAction2 = NavigationActions.navigate({
          routeName: "loginStack"
        });
        this.props.store.dispatch(navigateAction2);
        this.setState({ isLoading: false });
        SplashScreen.hide();
      });
  }


  render() {
    return (
      (!this.state.isLoading && 
        <View style={isIPhoneX() ? Styles.iphoneXWrapper : { flex: 1 }}>
          <StatusBar 
           barStyle="dark-content"
          // hidden={true} 
          />
          <ReduxNavigation />
        </View>
      )
    );
  }
}

const mapStateToProps = ({ userActionReducer }) => {
  const { currentScreen } = userActionReducer;
  return { currentScreen };
};
export default connect(mapStateToProps, {
  setUserData,
  setToken,
  updateNewActivity
})(RootContainer);