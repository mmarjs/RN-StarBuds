import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  View,
  Image,
  Switch,
    NetInfo,

  TouchableOpacity
} from "react-native";
import { NavigationActions } from 'react-navigation';
import { LoginManager } from "react-native-fbsdk";
import { connect } from "react-redux";
import { alert } from "./../../services/AlertsService";
import { apiCall, logoutFromFacebook } from "./../../services/AuthService";
import { setUserData, setToken, updateLoading } from "../../actions";
import { storeUser, deleteUser, removeData } from "./../../services/StorageService";
import { Colors, Images, Styles } from '../../theme';
import { navigateTo } from '../../services/CommonFunctions';
import { SettingsStyle } from './SettingsStyle';

const backAction = NavigationActions.back({
  key: null
});

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationStatus: this.props.userData.notificationEnable,
      isLoading: false
    };
  }

  logout() {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [ 
        {text: 'Cancel', style: 'cancel'},
        { text: "OK", onPress: () => 
          {
            if(this.props.userData.provider == 'facebook') {
              logoutFromFacebook();
            }
            this.props.updateLoading(true);
            removeData("budsFromFacebook");
            this.deregisterDevice(this.props.userData._id);
            deleteUser("user");
            this.props.setUserData("");
            this.props.setToken("");
            this.props.updateLoading(false);
            navigateTo(this.props.navigation, 'GetStart');
          }
        }
      ],
      { cancelable: false }
    );
  }
  deregisterDevice = (userId) => {
    const data = {
      userId: userId,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: userId
    };
    apiCall("users/deleteDeviceToken", data, headers)
      .then(response => {
      })
      .catch(error => {
      });
  }
  changeNotificationFlag(value) {
      this.setState({ notificationStatus: value, isLoading: true }, () => {
        const data = {
          userId: this.props.userData._id,
          notificationEnable: value
        };
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.props.token,
          userid: this.props.userData._id
        };
        apiCall("users/changeNotificationFlag", data, headers)
          .then(response => {
            if (response.status) {
              let oldUser = this.props.userData;
              oldUser.notificationEnable = value;
              this.props.setUserData(oldUser);
              this.setState({ isLoading: false }, () => {
                alert('Success', response.message);
              });
            } else {
              this.setState({ isLoading: false }, () => {
                alert('Failed', response.message);
              });
            }
          })
          .catch(error => {
            this.setState({ isLoading: false }, () => {
              alert("Failed", 'Failed to update notification status.');
            });
          });
      });      
  }

  changeNotificationFlagFromItemtap() {
    if(!this.state.isLoading) {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          this.setState({ isLoading: true }, () => {
            if (this.state.notificationStatus) {
              this.setState({ notificationStatus: false }, () => {
                this.changeNotificationFlag(this.state.notificationStatus);
              });
            } else {
              this.setState({ notificationStatus: true }, () => {
                this.changeNotificationFlag(this.state.notificationStatus);
              });
            }
          });
        } else {
          alert("Network Failed", "Please check your network connection...");
        }
      })
    
    }
  }

  componentDidMount() {
    // this.props.navigation.setParams({
    //   profileImageUrl: this.props.userData.profileImageUrl
    // });
  }

  render() {
    return (
      <View style={SettingsStyle.container}>
        <TouchableOpacity
          onPress={() => this.changeNotificationFlagFromItemtap()}
          activeOpacity={this.state.isLoading ? 1 : 0.5}
        >
          <View style={SettingsStyle.listRow}>
            <View style={SettingsStyle.textContainer}>
              <Text style={SettingsStyle.listText}>Turn {this.state.notificationStatus ? 'Off' : 'On'} Notification</Text>
            </View>
            <View style={SettingsStyle.iconContainer}>
              {this.state.isLoading && (
                <ActivityIndicator
                  animating
                  size="small"
                  style={Settings.notificationEnableIndicator}
                  color={Colors.primary}
                />
              )}
              {
              <Switch
                onValueChange={value => {
                  this.changeNotificationFlag(value);
                }}
                value={this.state.notificationStatus}
                tintColor={"rgb(76, 76, 76)"}
                onTintColor={Colors.primary}
                thumbTintColor={Colors.white}
                disabled={this.state.isLoading}
              />
              }
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.logout();
          }}
          activeOpacity={0.5}
          style={SettingsStyle.listRow}
        >
          <Text style={SettingsStyle.listText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


Settings.navigationOptions = ({navigation}) => ({
  title: "SETTINGS",
  headerTitleStyle: Styles.headerTitleStyle,
  headerStyle: Styles.headerStyle,
  tabBarVisible: false,
  headerLeft: (
    <TouchableOpacity
      onPress={() => {
        navigation.dispatch(backAction);
        // navigation.goBack(backAction)
        // navigation.dispatch({ type: "Tabs"});
      }}
      activeOpacity={0.5}
      style={Styles.headerLeftContainer}
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
  headerRight: <Text />
});

const mapStateToProps = ({ authReducer }) => {
  const { userData, loading, token } = authReducer;
  return { userData, loading, token };
};
export default connect(mapStateToProps, {
  updateLoading,
  setUserData,
  setToken
})(Settings);