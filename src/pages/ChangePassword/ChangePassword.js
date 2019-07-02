import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  View,
  Image,
  Switch,
    NetInfo,
    TouchableWithoutFeedback,
    Platform,
    TextInput,
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
import { ChangePasswordStyle } from './ChangePasswordStyle';
import { CachedImage } from "react-native-cached-image";
import {
  KeyboardAwareScrollView,
  KeyboardAwareListView
} from "react-native-keyboard-aware-scrollview";

var ImagePicker = require("react-native-image-picker");

const pickerOptions = {
  title: "Select Profile Photo",
  takePhotoButtonTitle: "Camera",
  chooseFromLibraryButtonTitle: "Choose from Library",
  mediaType: "photo",
  storageOptions: {
    skipBackup: true,
    path: "images"
  },
  quality: 0.6,
  noData: true,
  maxWidth: 500,
  maxHeight: 500,
  allowsEditing: false,
  // maxWidth: 500,
  // maxHeight: 500
};

const backAction = NavigationActions.back({
  key: null
});

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.changePasswordFunction = this.changePasswordFunction.bind(this);

    this.state = {
      notificationStatus: this.props.userData.notificationEnable,
      isLoading: false,
      isUploadingProfileImage: false,
      userData : [], // create an empty array
      isConnected: true,
      txtOldPassword : '',
      txtNewPassword : '',
      txtNewAgainPassword : '',
      colorRight : 'gray',
      isOldPassword : true,
      isNewPassword : true,
      isNewAgainPassword : true,

    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      colorRight: this.colorRight,
      changePasswordFunction: this.changePasswordFunction,
    });
    NetInfo.isConnected.fetch().then(isConnected => {
      isConnected ? this.getUserDetailsFromApi() : this.setState({ isConnected: false, isLoading: false });
    });
    NetInfo.isConnected.addEventListener('change', this._handleConnectionChange);
  }

  componentWillMount() {
    console.log('hii');
    this.setState({
      userData : this.props.navigation.state.params
    });
  }  

  _handleConnectionChange = (isConnected) => {
    if(isConnected) {
      this.setState({ isConnected: true }, () => {
        // this.setState({ isLoading: true });
        // this.getUserDetailsFromApi();
      })
    } else {
      this.setState({ isConnected: false })
    }
  };


  changePasswordApiCall() {
      this.setState({ notificationStatus: '', isLoading: true }, () => {
        const data = {
          id: this.props.userData._id,
          currentPassword: this.state.txtOldPassword,
          newPassword: this.state.txtNewAgainPassword
        };
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.props.token,
          userid: this.props.userData._id
        };
        apiCall("users/Changepassword", data, headers)
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
              alert("Failed", 'Failed to update password.');
            });
          });
      });      
  }

  checkNewPassword(value){
    this.setState({txtNewPassword : value});
  }
  checkOldPassword(value){
    this.setState({txtOldPassword : value});
  }
  checkNewAgainPassword(value){
    this.setState({txtNewAgainPassword : value});
  }

  renderGeneralData() {
    return (
      <View>
        <View style={{marginTop : 10,flex: 1, flexDirection: 'row'}}>
          <View style={{marginTop : 10, flex: 1, flexDirection: 'column',marginLeft : 20,marginRight : 20, height: 45, backgroundColor: Colors.clearTransparent}}>
              <TextInput
          placeholder = 'Current Password'
          secureTextEntry = {true}
          style={{fontFamily: 'SourceSansPro-Regular',fontSize: 18,marginLeft : 0,marginRight : 0,height: 30, borderColor : this.state.isOldPassword ? 'rgb(13, 14, 21)' : 'red', borderBottomWidth: this.state.isOldPassword ? 0.2 : 0.5,color : rgb(13, 14, 21)}}
          onChangeText={(txtOldPassword) => this.checkOldPassword(txtOldPassword)}
          value={this.state.txtOldPassword}
        />
        </View>
      </View>

      <View style={{marginTop : 0,flex: 1, flexDirection: 'row'}}>
          <View style={{marginTop : 0, flex: 1, flexDirection: 'column',marginLeft : 20,marginRight : 20, height: 45, backgroundColor: Colors.clearTransparent}}>
              <TextInput
              secureTextEntry = {true}
            placeholder = 'New Password'
          style={{fontFamily: 'SourceSansPro-Regular',fontSize: 18,marginLeft : 0,marginRight : 0,height: 30, borderColor : this.state.isNewPassword ? rgb(13, 14, 21) : 'red', borderBottomWidth: this.state.isNewPassword ? 0.2 : 0.5,color : rgb(13, 14, 21)}}
          onChangeText={(txtNewPassword) => this.checkNewPassword(txtNewPassword)}
          value={this.state.txtNewPassword}
        />
        </View>
      </View>

      <View style={{marginTop : 0,flex: 1, flexDirection: 'row'}}>
          <View style={{marginTop : 0, flex: 1, flexDirection: 'column',marginLeft : 20,marginRight : 20, height: 45, backgroundColor: Colors.clearTransparent}}>
              <TextInput
              secureTextEntry = {true}
              placeholder = 'New Password, again'
          style={{fontFamily: 'SourceSansPro-Regular',fontSize: 18,marginLeft : 0,marginRight : 0,height: 30, borderColor : this.state.isNewAgainPassword ? rgb(13, 14, 21) : 'red', borderBottomWidth: this.state.isNewAgainPassword ? 0.2 : 0.5,color : rgb(13, 14, 21)}}
          onChangeText={(txtNewAgainPassword) => this.checkNewAgainPassword(txtNewAgainPassword)}
          value={this.state.txtNewAgainPassword}
        />
        </View>
      </View>

    </View>
    )
  }
  

  changePasswordFunction() {
      if (this.state.txtOldPassword == '') {
        this.setState({isOldPassword : false})
        return
      }
      else {
        this.setState({isOldPassword : true})
      }
      if (this.state.txtNewPassword == '') {
        this.setState({isNewPassword : false})
        return
      }
      if (this.state.txtNewAgainPassword == '') {
        this.setState({isNewAgainPassword : false})
        return
      }
      if (this.state.txtNewPassword != this.state.txtNewAgainPassword) {
        this.setState({isNewAgainPassword : false})
        this.setState({isNewPassword : false})
        return
      }
      this.setState({isOldPassword : true})
      this.setState({isNewPassword : true})
      this.setState({isNewAgainPassword : true})
      this.changePasswordApiCall()
  }

  render() {
    return (
      <View style={ChangePasswordStyle.container}>
            
     <KeyboardAwareScrollView
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps={"always"}>
        {this.renderGeneralData()}

        </KeyboardAwareScrollView>
      </View>
    );
  }

}


ChangePassword.navigationOptions = ({navigation}) => ({
  title: "PASSWORD",
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
  headerRight: (
    <TouchableOpacity
      style={Styles.headerRightContainer}
      onPress={() => navigation.state.params.changePasswordFunction()}
    >
      <Text
        style={[
          Styles.headerRightText,
          {
            color: navigation.state.params.colorRight,
            fontFamily: "SourceSansPro-Regular",
            letterSpacing: 0.8,
            fontSize: 16,
            textAlign: "left"
          }
        ]}
      >
        SAVE
      </Text>
    </TouchableOpacity>
  )}
  );

const mapStateToProps = ({ authReducer }) => {
  const { userData, loading, token } = authReducer;
  return { userData, loading, token };
};
export default connect(mapStateToProps, {
  updateLoading,
  setUserData,
  setToken
})(ChangePassword);