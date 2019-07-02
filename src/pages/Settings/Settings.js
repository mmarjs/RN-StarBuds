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
  TouchableOpacity,
  Modal,

} from "react-native";
import { Button, NoNetworkView, PostOptions } from "./../../components";
import ImageCrop from 'react-native-image-crop';
import { NavigationActions } from 'react-navigation';
import { LoginManager } from "react-native-fbsdk";
import { connect } from "react-redux";
import { alert } from "./../../services/AlertsService";
import { apiCall, logoutFromFacebook } from "./../../services/AuthService";
import { setUserData, setToken, updateLoading } from "../../actions";
import { storeUser, deleteUser, removeData } from "./../../services/StorageService";
import { Colors, Images, Styles, Metrics } from '../../theme';
import { navigateTo } from '../../services/CommonFunctions';
import { SettingsStyle } from './SettingsStyle';
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

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationStatus: this.props.userData.notificationEnable,
      isLoading: false,
      isUploadingProfileImage: false,
      userData : [], // create an empty array
      isConnected: true,
      isImageEditorOpened: false,
      imageToBeCropped: '',


    };
  }

  componentDidMount() {
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


  renderGeneralData() {
    return (
      <View>
        <View style={{marginTop : 10,flex: 1, flexDirection: 'row', width : '90%'}}>
          <View style={{marginLeft : 20,marginTop : 20,width: 40, height: 35}}>
              <Image
                  style={{width: 25, height: 25, alignItems : 'center'}}
                  source={Images.edit2_}
              />
          </View>
          <View style={{marginTop : 10, flex: 1, flexDirection: 'column',width: '90%',marginLeft : 0, height: 70, backgroundColor: Colors.clearTransparent}}>
              <Text style={{fontFamily: 'OpenSans-Bold',fontSize: 12, color : rgb(118, 129, 150)}}>Name</Text>
              <TextInput
          style={{fontFamily: 'SFUIText-Regular',fontSize: 16,marginLeft : 0,marginRight : 0,height: 30, borderColor : rgb(13, 14, 21), borderBottomWidth: 0.3,color : rgb(13, 14, 21)}}
          onChangeText={(text) => this.setState({text})}
          value={this.props.userData.name}
        />
        </View>
      </View>

      <View style={{marginTop : 0,flex: 1, flexDirection: 'row', width : '90%'}}>
          <View style={{marginLeft : 20,marginTop : 10,width: 40, height: 35}}>
              <Image
                  style={{width: 25, height: 25, alignItems : 'center'}}
                  source={Images.user2_}
              />
          </View>
          <View style={{marginTop : 0, flex: 1, flexDirection: 'column',width: '90%',marginLeft : 0, height: 70, backgroundColor: Colors.clearTransparent}}>
              <Text style={{fontFamily: 'OpenSans-Bold',fontSize: 12, color : (118, 129, 150)}}>Username</Text>
              <TextInput
          style={{fontFamily: 'SFUIText-Regular',fontSize: 16,marginLeft : 0,marginRight : 0,height: 30, borderColor : rgb(13, 14, 21), borderBottomWidth: 0.3,color : rgb(13, 14, 21)}}
          onChangeText={(text) => this.setState({text})}
          value={this.props.userData.name}
        />
        </View>
      </View>

      <View style={{marginTop : 0,flex: 1, flexDirection: 'row', width : '90%'}}>
          <View style={{marginLeft : 20,marginTop : 10,width: 40, height: 35}}>
              <Image
                  style={{width: 25, height: 25, alignItems : 'center'}}
                  source={Images.calender}
              />
          </View>
          <View style={{marginTop : 0, flex: 1, flexDirection: 'column',width: '90%',marginLeft : 0, height: 70, backgroundColor: Colors.clearTransparent}}>
              <Text style={{fontFamily: 'OpenSans-Bold',fontSize: 12, color : (118, 129, 150)}}>Birthday</Text>
              <TextInput
          style={{fontFamily: 'SFUIText-Regular',fontSize: 16,marginLeft : 0,marginRight : 0,height: 30, borderColor : rgb(13, 14, 21), borderBottomWidth: 0.3,color : rgb(13, 14, 21)}}
          onChangeText={(text) => this.setState({text})}
          value={'01/15/1990'}
        />
        </View>
      </View>

      <View style={{marginTop : 0,flex: 1, flexDirection: 'row', width : '90%'}}>
          <View style={{marginLeft : 20,marginTop : 10,width: 40, height: 35}}>
              <Image
                  style={{width: 25, height: 25, alignItems : 'center'}}
                  source={Images.addLocationIcon}
              />
          </View>
          <View style={{marginTop : 0, flex: 1, flexDirection: 'column',width: '90%',marginLeft : 0, height: 70, backgroundColor: Colors.clearTransparent}}>
              <Text style={{fontFamily: 'OpenSans-Bold',fontSize: 12, color : (118, 129, 150)}}>City</Text>
              <TextInput
          style={{fontFamily: 'SFUIText-Regular',fontSize: 16,marginLeft : 0,marginRight : 0,height: 30, borderColor : rgb(13, 14, 21), borderBottomWidth: 0.3,color : rgb(13, 14, 21)}}
          onChangeText={(text) => this.setState({text})}
          value={'Los Angles'}
        />
        </View>
      </View>


    </View>
    )
  }

  addProfilePicture() {
    if(this.state.isConnected) {
      ImagePicker.showImagePicker(pickerOptions, response => {
        if (response.didCancel) {
          this.setState({ isUploadingProfileImage: false });
        } else if (response.error) {
          this.setState({ isUploadingProfileImage: false });
        } else {
            console.log('response = ', response)
            // You can also display the image using data:
            let imagePath;
            if (Platform.OS === "android") {
              imagePath = response.path;
            } else {
              imagePath = response.uri;
            }
            var str = imagePath;
            var fileName = str.split("/");
            fileName = fileName[fileName.length - 1];
            imagePath = imagePath.startsWith("file://") ? imagePath : "file://" + imagePath;
            let fileToBeUploaded = { 
              uri: imagePath,
              type: fileName.substr(fileName.length - 3) == "png" ? "image/png" : "image/jpeg", // name: response.fileName ? response.fileName : fileName
              name: fileName
            };
            this.setState({
              isImageEditorOpened: true,
              imageToBeCropped: response.uri
            });
            // this.uploadImage(fileToBeUploaded, imagePath);
        }
      });
    } else {
      alert('No Internet Connection', 'Please check your internet connection.');
    }
  }
  renderProfileImage() {
    return (
      <View style={SettingsStyle.profileImageContainer}>
        {!this.state.isUploadingProfileImage && (
          <TouchableWithoutFeedback
           onPress={() => this.addProfilePicture()}
           >
           <View>
          <CachedImage
          style={SettingsStyle.profileImage}
          source={{ uri: this.props.userData.thumbnail }}
          defaultSource={Images.defaultUser}
          fallbackSource={Images.defaultUser}
          activityIndicatorProps={{ display: "none", opacity: 0 }}
          />
          </View>
          </TouchableWithoutFeedback>
        )}
         <TouchableWithoutFeedback
           onPress={() => this.addProfilePicture()}
           >
           <Image style={{width:24, height : 24, position: 'relative', alignItems : 'center', tintColor : 'white'}}
                  source={Images.photo2_}></Image>
           </TouchableWithoutFeedback>
        
        <Text style={{fontFamily: 'SourceSansPro-Regular',fontSize: 12, marginTop : 40,color : rgb(80, 147, 7)}}>Change Profile Photo</Text>

        {this.state.isUploadingProfileImage && (<ActivityIndicator
          animating
          size="small"
          style={SettingsStyle.profileImageIndicator}
          color={Colors.primary}
        />)}
    </View>
    );
  }

  renderFolowOnFacebook() {
    return(
      <View style={{}}>
        <TouchableOpacity
                  onPress={() => {this.logout()}}
              >
       <Text style={{marginLeft : 20,fontFamily: 'OpenSans-Bold',fontSize: 12, marginTop : 10,color : rgb(128, 129, 150)}}>Follow</Text>
      <View style={{marginTop : 10,flex: 1, flexDirection: 'row', width : '100%',height : 40,borderColor : rgb(13, 14, 21), borderBottomWidth: 0.2}}>
              <Image
                  style={{width : 11,height : 22,marginLeft : 20, alignItems : 'center', tintColor : Colors.black}}
                  source={Images.social_fb}
              />
              <Text style={{marginTop : 5,marginLeft : 15,fontFamily: 'SFUIText-Regular',fontSize: 14, color : 'black', width : '61%', height : 25}}>Friends on Facebook</Text>
             
              <Text style={{marginLeft : 32,height : 25,fontFamily: 'OpenSans-Bold',fontSize: 12, marginTop : 5,color : rgb(128, 129, 150)}}>312</Text>
              <Image
                  style={{marginTop : 9,marginLeft : 15,width: 8, height: 13, alignItems : 'center'}}
                  source={Images.right_arrow}
              />
      </View>
      </TouchableOpacity>

    </View>
    )
  }

  renderAccountSection() {
    return(
      <View style={{}}>
      <Text style={{marginLeft : 20,fontFamily: 'OpenSans-Bold',fontSize: 12, marginTop : 10,color : rgb(128, 129, 150)}}>Account</Text>

      <View style={{marginTop : 10, width : '100%',height : 40,borderColor : rgb(13, 14, 21), borderBottomWidth: 0.1}}>
      <TouchableOpacity style = {{flex: 1, flexDirection: 'row'}}
        onPress={() => {
          navigateTo(this.props.navigation, 'ChangePassword');

        }}

      >

              <Text style={{marginTop : 5,marginLeft : 20,fontFamily: 'SFUIText-Regular',fontSize: 14, color : 'black', width : '82%', height : 25}}>Change Password</Text>
              <Image
                  style={{marginTop : 9,marginLeft : 15,width: 8, height: 13, alignItems : 'center'}}
                  source={Images.right_arrow}
              />
       </TouchableOpacity>
      </View>

      {/* <View style={{marginTop : 10, width : '100%',height : 40,borderColor : rgb(13, 14, 21), borderBottomWidth: 0.2}}>
      <TouchableOpacity style = {{flex: 1, flexDirection: 'row'}}>
              <Text style={{marginTop : 5,marginLeft : 20,fontFamily: 'SFUIText-Regular',fontSize: 14, color : 'black', width : '82%', height : 25}}>Security</Text>
              <Image
                  style={{marginTop : 7,marginLeft : 15,width: 15, height: 15, alignItems : 'center'}}
                  source={Images.right_arrow}
              />
        </TouchableOpacity>
      </View> */}
    </View>
    )
  }

  renderSettingsSection() {
    return(
      <View style={{}}>
      <Text style={{marginLeft : 20,fontFamily: 'OpenSans-Bold',fontSize: 12, marginTop : 10,color : rgb(128, 129, 150)}}>Settings</Text>
      <View style={{marginTop : 10,flex: 1, flexDirection: 'row', width : '100%',height : 40,borderColor : rgb(13, 14, 21), borderBottomWidth: 0.1}}>
              <Text style={{marginTop : 5,marginLeft : 20,fontFamily: 'SFUIText-Regular',fontSize: 14, color : 'black', width : '75%', height : 25}}>Location</Text>
              <Switch
                onValueChange={value => {
                  // this.changeNotificationFlag(value);
                }}
                value={this.state.notificationStatus}
                tintColor={"rgb(76, 76, 76)"}
                onTintColor={Colors.primary}
                thumbTintColor={Colors.white}
                disabled={this.state.isLoading}
                backgroundColor = 'rgba(76, 76, 76,0)'
              />
      </View>
      <View style={{marginTop : 10,flex: 1, flexDirection: 'row', width : '100%',height : 40,borderColor : rgb(13, 14, 21), borderBottomWidth: 0.2}}>
              <Text style={{marginTop : 5,marginLeft : 20,fontFamily: 'SFUIText-Regular',fontSize: 14, color : 'black', width : '75%', height : 25}}>Push-notifications</Text>
              <Switch
                onValueChange={value => {
                  this.changeNotificationFlag(value);
                }}
                value={this.state.notificationStatus}
                tintColor={"rgb(76, 76, 76)"}
                onTintColor={Colors.primary}
                thumbTintColor={Colors.white}
                disabled={this.state.isLoading}
                backgroundColor = {Colors.dark}
              />
      </View>
    </View>
    )
  }
  onCropPress() {
    console.log('In onCropPress')
    this.imageCrop.crop().then((uri) => {
      console.log('cropped image = ', uri)
    this.setState({ isImageEditorOpened: false, imageToBeCropped: '' }, () => {
        let fileToBeUploaded = { 
          uri: uri.uri,
          type: uri.name.substr(uri.name.length - 3) == "png" ? "image/png" : "image/jpeg", // name: response.fileName ? response.fileName : fileName
          name: uri.name
        };
        this.uploadImage(fileToBeUploaded, uri.uri);
      })
    });
  }

  uploadImage(fileToBeUploaded, imagePath) {
    this.setState({ isUploadingProfileImage: true }, () => {
      let data = new FormData();
      data.append("userId", this.props.userData._id);
      data.append("file", fileToBeUploaded);
      fetch(Metrics.serverUrl + "users/updateUserInformation", {
        method: "post",
        headers: {
          'Authorization': "Bearer " + this.props.token,
          'userid': this.props.userData._id,
        },
        body: data
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.status) {
            let tempUser = {
              token: this.props.token,
              user: responseJson.result
            };
            storeUser(tempUser);
            this.props.setUserData(responseJson.result);
            this.setState({ isUploadingProfileImage: false });
          } else {
            this.setState({
              isUploadingProfileImage: false
            }, () => {
              setTimeout(() => {
                alert("Failed", "Something went wrong!");
              });
            });
          }
        })
        .catch(error => {
          this.setState({ isUploadingProfileImage: false });
          setTimeout(() => {
          alert("Failed", "Something went wrong!");
          });
        });
      });
  }


  renderAboutSection() {
    return(
      <View style={{}}>
      <Text style={{marginLeft : 20,fontFamily: 'OpenSans-Bold',fontSize: 12, marginTop : 10,color : rgb(128, 129, 150)}}>About</Text>

      <View style={{marginTop : 10, width : '100%',height : 40,borderColor : rgb(13, 14, 21), borderBottomWidth: 0.1}}>
      <TouchableOpacity style = {{flex: 1, flexDirection: 'row'}}>

              <Text style={{marginTop : 5,marginLeft : 20,fontFamily: 'SFUIText-Regular',fontSize: 14, color : 'black', width : '82%', height : 25}}>Data Policy</Text>
              <Image
                  style={{marginTop : 9,marginLeft : 15,width: 8, height: 13, alignItems : 'center'}}
                  source={Images.right_arrow}
              />
       </TouchableOpacity>
      </View>

      <View style={{marginTop : 10, width : '100%',height : 40,borderColor : rgb(13, 14, 21), borderBottomWidth: 0.2}}>
      <TouchableOpacity style = {{flex: 1, flexDirection: 'row'}}>
              <Text style={{marginTop : 5,marginLeft : 20,fontFamily: 'SFUIText-Regular',fontSize: 14, color : 'black', width : '82%', height : 25}}>Terms & Conditions</Text>
              <Image
                  style={{marginTop : 9,marginLeft : 15,width: 8, height: 13, alignItems : 'center'}}
                  source={Images.right_arrow}
              />
        </TouchableOpacity>
      </View>
    </View>
    )
  }

  render() {
    return (
      <View style={SettingsStyle.container}>
            
     <KeyboardAwareScrollView
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps={"always"}>

            {this.renderProfileImage()}
            {this.renderGeneralData()}
            {this.renderFolowOnFacebook()}
            {this.renderAccountSection()}
            {this.renderSettingsSection()}
            {this.renderAboutSection()}

        {/* <TouchableOpacity
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
        </TouchableOpacity> */}
        <Modal 
            animationType = {"fade"}
            transparent = {true}
            visible = {this.state.isImageEditorOpened}
            onRequestClose={() => this.setState({ isImageEditorOpened: false })}
            presentationStyle={'overFullScreen'}
          >
            <View style={{flex: 1, backgroundColor: 'white'}}>
              <View style={Styles.cropButtonsWrapper}>
                <Button
                  onPress={() => {
                    this.setState({
                      isImageEditorOpened: false,
                      imageToBeCropped: ''
                    })
                  }}
                  style={Styles.cropCancelButton}
                >
                  <Text style={Styles.cropButtonsText}>Cancel</Text>
                </Button>
                <Button
                  onPress={() => this.onCropPress()}
                  style={Styles.cropDoneButton}
                >
                  <Text style={Styles.cropButtonsText}>Done</Text>
                </Button>
              </View>
              <ImageCrop
                ref={(c) => { this.imageCrop = c; }}
                cropWidth={500}
                cropHeight={500}
                source={{
                  uri: this.state.imageToBeCropped
                }}
              />
            </View>
          </Modal>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}


Settings.navigationOptions = ({navigation}) => ({
  title: "SETTINGS",
  headerTitleStyle: Styles.headerTitleStyle,
  headerStyle: Styles.headerStyle,
  tabBarVisible: true,
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
      onPress={() => {
        navigation.dispatch(backAction);
        // navigation.goBack(backAction)
        // navigation.dispatch({ type: "Tabs"});
      }}
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
        Done
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
})(Settings);