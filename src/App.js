import React, { Component } from "react";
import { NavigationActions } from 'react-navigation';
import { DrawerNavigator, DrawerItems, createAppContainer } from 'react-navigation';
import { AppRegistry, Linking, Text } from "react-native";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import { compose, createStore, applyMiddleware } from "redux";
import reducers from "./reducers";
import { Platform } from "react-native";
import PushNotification from "react-native-push-notification";
import LinkRoutes from './services/LinkRoutes';
// import reducers from './reducers';
// import AppWithNavigationState from './navigators/AppNavigator';
import RootContainer from "./RootContainer";
import pushConfig from "./PushConfig";
const store = createStore(reducers, {}, compose(applyMiddleware(ReduxThunk)));
import { SafeAreaView } from 'react-navigation';

//GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
 
 
class App extends Component { 
  constructor(props) {
    super(props);
    pushConfig(store);
    Text.defaultProps.allowFontScaling = false;
  }

  componentDidMount() {
    Linking.addEventListener('url', event => this.handleOpenURL(event.url));
    // Linking.getInitialURL().then(url => {
    //   if(url)
    //     this.handleOpenURL(url);
    // });
    if (Platform.OS == "android") {
      PushNotification.requestPermissions("456933032214");
    }
  }
  componentWillUnmount(){
    Linking.removeEventListener('url', this.handleOpenURL);
  }
  
  handleOpenURL(url) {
    const path = url.split(':/')[1];
    LinkRoutes(path, store);
  }

  render() {
    
    return (
      <Provider store={store}>
        <RootContainer store={store} />
      </Provider>
    );
  }
}
export default App;
