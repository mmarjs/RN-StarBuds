import React, {Component} from "react";
import {
  ActivityIndicator,
  View,
  Image,
  Text,
  Platform,
  TouchableWithoutFeedback,
  NetInfo,
  Alert,
  Linking,
  Modal,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import {connect} from "react-redux";
import ScalableText from 'react-native-text';
import ImageRotate from 'react-native-image-rotate';
import ImageCrop from 'react-native-image-crop';
import {Button} from "./../../components";
import {AddProfilePictureStyle} from "./AddProfilePictureStyle";
import { Images, Colors, Metrics, Styles } from "./../../theme";
import {setUserData, updateLoading, setPermissions} from "../../actions";
import {storeUser} from "./../../services/StorageService";
import {alert} from "./../../services/AlertsService";
import {_checkPermission} from "./../../services/AskPermission";
import { navigateTo } from '../../services/CommonFunctions';

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
  maxHeight: 500
};

class AddProfilePicture extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      pressStatus: false,
      currentImage: Images.addProfilePicture,
      isUpdatingProfilePicture: false,
      isImageEditorOpened: false,
      imageToBeCropped: ''
    };
  }

  componentWillMount() {
    setTimeout(() => this.getUserPermission(), 1000);
  }

  getUserPermission() {
    let _this = this;
    _checkPermission("camera").then(result => {
      this
        .props
        .setPermissions("camera", result);
      if (result === "denied") {
        if (Platform.OS === "ios") {
          Alert.alert("Warning", "This app needs camera permission please goto settings and enable it", [
            {
              text: "OK",
              onPress: () => {
                Linking.openURL("app-settings:");
              }
            }
          ], {cancelable: false});
        } else {
          // for android
          this.getUserPermission();
        }
      } else if (result === "restricted") {
        alert("Permission", "This apps needs camera permission, please goto settings and enable it");
      } else if (result === "authorized") {
        _checkPermission("photo").then(result1 => {
          this
            .props
            .setPermissions("photo", result1);
          if (result1 === "denied") {
            if (Platform.OS === "ios") {
              Alert.alert("Warning", "This app needs gallery permission please goto settings and enable it", [
                {
                  text: "OK",
                  onPress: () => {
                    Linking.openURL("app-settings:");
                  }
                }
              ], {cancelable: false});
            } else {
              // for android
              this.getUserPermission();
            }
          } else if (result1 === "restricted") {
            alert("Permission", "This apps needs gallery permission, please goto settings and enable it");
          }
        });
      }
    });
  }

  uploadImage(fileToBeUploaded) {
    let data = new FormData();
    data.append("userId", this.props.userData._id);
    data.append("file", fileToBeUploaded);
    NetInfo
      .isConnected
      .fetch()
      .then(isConnected => {
        if (isConnected) {
          fetch(Metrics.serverUrl + "users/updateUserInformation", {
            method: "post",
            headers: {
              Authorization: "Bearer " + this.props.token,
              userid: this.props.userData._id
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
                this
                  .props
                  .setUserData(responseJson.result);
                this.setState({
                  isUpdatingProfilePicture: false
                }, () => {
                  navigateTo(this.props.navigation, 'mainStack')
                });
              } else {
                this.setState({
                  isUpdatingProfilePicture: false
                }, () => {
                  alert("Error", "Something went wrong!");
                });
              }
            })
            .catch(error => {
              this.setState({
                isUpdatingProfilePicture: false
              }, () => {
                if (error.message) 
                  alert("Failed", error.message);
                else 
                  alert("Error", "Something went wrong!");
                }
              );
            });
        } else {
          this.setState({
            isUpdatingProfilePicture: false
          }, () => {
            alert("No internet connection", "Please check your network connectivity.");
          });
        }
      });
  }

  rotateImage(uri) {
    return new Promise((resolve, reject) => {
      ImageRotate.rotateImage(
        response.uri,
        -90,
        (uri) => {
          resolve(uri)
        },
        (error) => {
          reject(error)
        }
      );
    })
  }

  onCropPress() {
    this.imageCrop.crop().then((uri) => {
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

  addProfilePicture() {
    this.getUserPermission()
    this.setState({
      isUpdatingProfilePicture: true
    }, () => {
      ImagePicker.showImagePicker(pickerOptions, response => {
        if (response.didCancel) {
          this.setState({isUpdatingProfilePicture: false});
        } else if (response.error) {
          this.setState({isUpdatingProfilePicture: false});
        } else {
          let imagePath;
          if (Platform.OS === "android") {
            if(response.originalRotation != 0) {
              this.rotateImage(response.uri).then(rotatedImage =>  {
                this.setState({
                  currentImage: {
                    uri: rotatedImage
                  }
                }, () => {
                  this.setState({
                    isImageEditorOpened: true,
                    imageToBeCropped: rotatedImage
                  });
                });
              }).catch(error => {
                imagePath = response.path;
                this.setState({
                  currentImage: {
                    uri: response.uri
                  }
                }, () => {
                  this.setState({
                    isImageEditorOpened: true,
                    imageToBeCropped: response.uri
                  });
                });
              })
            } else {
              imagePath = response.path;
              this.setState({
                isImageEditorOpened: true,
                imageToBeCropped: response.uri
              });
            }
          } else {
            this.setState({
              isImageEditorOpened: true,
              imageToBeCropped: response.uri
            });
          }
        }
      });
    });

  }

  skipClicked() {
    navigateTo(this.props.navigation, 'mainStack')
  }

  renderLogo() {
    return (
      <View style={AddProfilePictureStyle.group1}>
        <Image
          style={this.state.currentImage == Images.addProfilePicture
          ? AddProfilePictureStyle.headerImage
          : AddProfilePictureStyle.profileImage}
          source={this.state.currentImage}/>
      </View>
    );
  }

  renderMessage() {
    return (
      <View style={AddProfilePictureStyle.group2}>
        <Text style={AddProfilePictureStyle.titleStyle}>
          ADD PROFILE PICTURE
        </Text>
        <Text style={AddProfilePictureStyle.textStyle}>
          Add a profile photo so your friends know it’s you.
        </Text>
      </View>
    );
  }

  renderButton() {
    return (
      <View style={AddProfilePictureStyle.group3}>
        <Button
          onPress={() => this.addProfilePicture()}
          onHideUnderlay={() => {
          this.setState({pressStatus: false});
        }}
          onShowUnderlay={() => {
          this.setState({pressStatus: true});
        }}
          style={[
          AddProfilePictureStyle.buttonStyle, this.state.pressStatus
            ? {
              backgroundColor: Colors.secondaryDarker,
              width: 256.3,
              alignSelf: 'center'
            }
            : {
              backgroundColor: Colors.secondary,
              width: 256.3,
              alignSelf: 'center'
            }
        ]}>
          <View>
            <ScalableText style={AddProfilePictureStyle.buttonText}>
              ADD A PHOTO
            </ScalableText>
          </View>
        </Button>
        {this.state.isUpdatingProfilePicture && <ActivityIndicator
          animating
          size="small"
          style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-end",
          position: 'absolute',
          bottom: 15,
          right: 10
        }}
          color={Colors.black}/>
}
      </View>
    );
  }

  renderSkip() {
    return (
      <View style={AddProfilePictureStyle.group4}>
        <Text
          style={AddProfilePictureStyle.skipText}
          onPress={() => this.skipClicked()}>
          SKIP
        </Text>
      </View>
    );
  }
  render() {
    return (
      <View style={AddProfilePictureStyle.pageContainer}>
       <ImageBackground
          style={AddProfilePictureStyle.imageContainer}
          source={Images.addprofilebackground}
        >
        {this.renderLogo()}
        {this.renderMessage()}
        {this.renderButton()}
        {this.renderSkip()}
        <Modal 
            animationType = {"fade"}
            transparent = {true}
            visible = {this.state.isImageEditorOpened}
            onRequestClose={() => this.setState({ isImageEditorOpened: false })}
            presentationStyle={'overFullScreen'}
          >
            <View style={{flex: 1, backgroundColor: Colors.black}}>
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
          </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = ({authReducer}) => {
  const {loading, userData, token} = authReducer;
  return {loading, userData, token};
};

export default connect(mapStateToProps, {updateLoading, setUserData, setPermissions})(AddProfilePicture);
