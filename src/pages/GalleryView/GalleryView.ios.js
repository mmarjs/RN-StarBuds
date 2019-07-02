import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Button,
  Image,
  Dimensions,
  Text,
  Platform,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
  Switch,
  ListView,
  Linking,
  TouchableOpacity,
  ScrollView,
  PanResponder,
  Alert
} from 'react-native';
import { connect } from "react-redux";
import { TabNavigator, NavigationActions } from "react-navigation";
import VideoPlayer from "react-native-video-player";

import {
  CameraKitGallery,
  CameraKitGalleryView
} from 'react-native-camera-kit';
import { ImageCrop } from "react-native-image-cropper";
const { fs, fetch, wrap } = RNFetchBlob;
import _ from "lodash";

const { width, height } = Dimensions.get('window');
const size = Math.floor((Dimensions.get('window').width) / 3);
import { GalleryViewStyle } from "./GalleryViewStyle";
import { CameraViewStyle } from "../CameraView/CameraViewStyle";
import {
  checkPermission,
  getPermissionMultiple,
  _checkPermission
} from "./../../services/AskPermission";
import { alert } from "./../../services/AlertsService";
import { Colors, Images, Metrics, Styles } from "../../theme";
import {
  updateLoading,
  setTaggedPeople,
  setTaggedPeopleForCompare,
  setPermissions
} from "../../actions";
import RNFetchBlob from "react-native-fetch-blob";
import { navigateTo } from '../../services/CommonFunctions';

const backAction = NavigationActions.back({ key: null });
// const _this = null;
class GalleryView extends Component {

  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.tabAction = this.tabAction.bind(this);
    this.changeAlbums = this.changeAlbums.bind(this);
    this.changeScrollValue = this.changeScrollValue.bind(this);
    this.isNavigateToGallery = true;
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      presentedImage: undefined,
      selectedImages: [],
      showPresentedImage: false, galleryImagePath: false,
      galleryImageList: [],
      galleryPermission: false,
      loading: false,
      user: null,
      albumName: "All Photos",
      // albumName: "Camera Roll",
      albums: [],
      dropdownVisible: false,
      images: [],
      imagesDetails: undefined,
      selectedImagesArray: [],
      selectedImageId: "",
      selectedImage: [],
      shouldRenderCameraScreen: false,
      tappedImage: undefined,
      getUrlOnTapImage: false,
      imageMode: "contain",
      isScroll: true,
      cropImageArray: [] //without crops value //crop values
    };
    this.tempImage = [];
  }
  static navigationOptions = ({ navigation }) => ({
    title: "GALLERY",
    // title: (
    //   <View style={{ height: 44, width: 200, alignSelf: "center" }}>
    //     <ModalDropdown
    //       options={[
    //         "Camera Roll",
    //         "Favorites",
    //         "Screenshots",
    //         "Recently Deleted"
    //       ]}
    //       defaultValue="Camera Roll"
    //       style={styles.dropdown_1}
    //       dropdownStyle={styles.dropdownStyle}
    //       textStyle={styles.textStyle}
    //       dropdownTextStyle={styles.dropdownTextStyle}
    //       onSelect={(idx, value) => {
    //         navigation.state.params.changeAlbums(value);
    //       }}
    //     />
    //   </View>
    // ),
    headerTitleStyle: Styles.headerTitleStyle,
    headerStyle: Styles.headerStyle,
    headerLeft: (
      <TouchableHighlight
        onPress={() => {
          navigation.goBack(null);
        }}
        style={{ padding: 15 }}
      >
        <Text
          style={{
            color: Colors.white,
            marginLeft: 10,
            fontFamily: "ProximaNova-Light",
            fontSize: 16
          }}
        >
          Cancel
        </Text>
      </TouchableHighlight>
    ),
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          // _this.nextPage()
          navigation.state.params.nextPage();
        }}
        style={Styles.headerRightContainer}
        activeOpacity={0.5}
      >
        <Text
          style={[Styles.headerRightText, GalleryViewStyle.headerRightText]}
        >
          Next
        </Text>
      </TouchableOpacity>
    )
  });

  componentWillMount() {
    this.getUserPermission();
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      // onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => false
      // onShouldBlockNativeResponder: (evt, gestureState) => true,
      // onPanResponderGrant: (evt, gestureState) => {
      //   this.setState({ isScroll : false})
      // },
      // onPanResponderRelease: (event) => this.setState({ isScroll : true}),
      // onPanResponderMove: (evt, gestureState) => {
      // }
    });
    this.props.navigation.setParams({
      enableNext: false,
      nextPressIn: this.nextPressIn,
      nextPressIn: this.nextPressIn,
    });
  }
  componentDidMount() {
    const user = this.props.userData;
    this.props.navigation.setParams({
      nextPage: this.nextPage,
      tabAction: this.tabAction,
      changeAlbums: this.changeAlbums
    });
    this.setState({ user: user });
    this.reloadAlbums();
    // this.getSmartAlbums();
  }
  changeScrollValue(value) {
    this.scrollView.setNativeProps({ scrollEnabled: value });
    // this.setState({ isScroll : value});
  }
  getUserPermission() {
    let _this = this;
    _checkPermission("camera").then(result => {
      this.props.setPermissions("camera", result);
      if (result === "denied") {
        if (Platform.OS === "ios") {
          Alert.alert(
            "Warning",
            "This app needs camera permission please goto settings and enable it",
            [
              {
                text: "OK",
                onPress: () => {
                  Linking.openURL("app-settings:");
                }
              }
            ],
            { cancelable: false }
          );
        } else {
          // for android
          this.getUserPermission();
        }
      } else if (result === "restricted") {
        alert(
          "Permission",
          "This apps needs gallery permission, please goto settings and enable it"
        );
      } else if (result === "authorized") {
        _checkPermission("photo").then(result1 => {
          this.props.setPermissions("photo", result1);
          if (result1 === "denied") {
            if (Platform.OS === "ios") {
              Alert.alert(
                "Warning",
                "This app needs camera permission please goto settings and enable it",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      Linking.openURL("app-settings:");
                    }
                  }
                ],
                { cancelable: false }
              );
            } else {
              // for android
              this.getUserPermission();
            }
          } else if (result1 === "restricted") {
            alert(
              "Permission",
              "This apps needs gallery permission, please goto settings and enable it"
            );
          }
        });
      }
    });
  }

  async reloadAlbums() {
    const newAlbums = await CameraKitGallery.getAlbumsWithThumbnails();
    let albums = [];
    for (let name in newAlbums.albums) {
      albums.push(_.get(newAlbums, ["albums", name]));
    }
    this.setState({ albums });
  }

  async nextPage () {
    if (this.state.selectedImages.length > 0) {
      if (this.isNavigateToGallery){
        this.isNavigateToGallery = false;
        // await this.cropImage();
        console.log(' this.state.selectedImages',  this.state.selectedImages)
        navigateTo(this.props.navigation, 'NewPost', {
          images: this.state.selectedImages
        });
        // this.props.navigation.dispatch({ type: 'NewPost', images: this.state.selectedImages})

        this.props.setTaggedPeople([]);
        this.props.setTaggedPeopleForCompare([]);
        // // this.props.navigation.dispatch({ type: 'PhotoTags', params: this.tempImage})
        setTimeout(() => {
          this.isNavigateToGallery = true;
        }, 2000);
  
      }
     
      
    } else {
      alert("Alert", "Please choose image ...");
    }
  }

  tabAction(navigation) {
    // @ This is old code

    // let user = this.state.user;
    // this.props.navigation.dispatch({
    //   type: "Tabs",
    //   params: this.props.userData
    // });
    // navigation.setParams(this.props.userData)
    navigation.goBack(null);
  }

  async onTapImage(event) {
    const isSelected = event.nativeEvent.isSelected;
    const image = await CameraKitGallery.getImageForTapEvent(event.nativeEvent);
    if (this.state.selectedImages.length > 0) {
     await this.cropImage()
    }
    if (
      !isSelected ||
      _.get(image, "selectedImageId") ===
      _.get(this.state, "presentedImage.selectedImageId")
    ) {
      _.remove(this.state.selectedImagesArray,(o)=>{
        return o.selectedImageId == image.selectedImageId
      })
      _.remove(this.state.selectedImages, (o) => {
        return o.selectedImageId == image.selectedImageId
      })
      this.setState({
        selectedImagesArray: JSON.parse(JSON.stringify(this.state.selectedImagesArray)),
        selectedImages: JSON.parse(JSON.stringify(this.state.selectedImages)) 
      }, () => {
        this.props.navigation.setParams({
          enableNext: this.state.selectedImagesArray.length > 0 ? true : false
        });
      });
    } else if (image) {
      this.setState({
        selectedImagesArray: _.concat(this.state.selectedImagesArray, JSON.parse(JSON.stringify(image))),
        selectedImages: _.concat(this.state.selectedImages, JSON.parse(JSON.stringify(image)))
      }, () => {
        this.props.navigation.setParams({
          enableNext: this.state.selectedImagesArray.length > 0 ? true : false
        });
      })  
    }
  }

  /*
 @cropImage
 cropping selected image.
*/
  cropImage() {
    console.log('cropImage', this.state.selectedImages)
    if (this.state.selectedImages[this.state.selectedImages.length - 1].isType == 'image'){
      return this.refs.cropper.crop().then(
        img => {
          this.state.selectedImages[this.state.selectedImages.length - 1]['uri'] = img;
          return img;
        },
        err => { }
      );
    } else{
      this.state.selectedImages[this.state.selectedImages.length - 1].uri = this.state.selectedImages[this.state.selectedImages.length - 1].imageUri;
      return true
    }
    
  }

  changeAlbums(value) {
    this.setState({ albumName: value });
    this.reloadAlbums();
  }

  renderPresentedImage() {
    return (
      <View style={{ position: 'absolute', width, height, backgroundColor: 'green' }}>
        <View style={styles.container}>
          <Image
            resizeMode={Image.resizeMode.cover}
            style={{ width: 300, height: 300 }}
            source={{ uri: this.state.presentedImage.imageUri }}
          />

          <Button
            title={'Back'}
            onPress={() => this.setState({ showPresentedImage: false })}
          />
        </View>
      </View>
    )
  }

  render() {
    if (this.props.permissions.photo.status != "authorized") {
      return (
        <View
          style={{
            backgroundColor: "white",
            flex: 1,
            height: Metrics.screenHeight
          }}
        >
          <Text style={GalleryViewStyle.textStyle}>
            Please give permission to access your photos
          </Text>
        </View>
      );
    }
    return (
      <ScrollView
        ref={c => {
          this.scrollView = c;
        }}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <View style={{ height: Metrics.screenWidth, marginTop: -10}}>
          {this.state.selectedImagesArray.length > 0 && (
            <View
              style={{ height: Metrics.screenWidth, backgroundColor:'red'}}
              {...this.panResponder.panHandlers}
            >
              {
                this.state.selectedImagesArray[
                  this.state.selectedImagesArray.length - 1
                ].isType == 'image' && (
                  <ImageCrop
                    changeScrollValue={this.changeScrollValue}
                    ref={"cropper"}
                    image={
                      this.state.selectedImagesArray[
                        this.state.selectedImagesArray.length - 1
                      ].imageUri
                      //"http://geekycentral.com/wp-content/uploads/2017/09/react-native.png"
                    }
                    zoom={0}
                    imageHeight={
                      this.state.selectedImagesArray[
                        this.state.selectedImagesArray.length - 1
                      ].height
                    }
                    imageWidth={
                      this.state.selectedImagesArray[
                        this.state.selectedImagesArray.length - 1
                      ].width
                    }
                    cropWidth={Metrics.screenWidth}
                    cropHeight={Metrics.screenWidth}
                    maxZoom={100}
                    minZoom={0}
                    panToMove={true}
                    pinchToZoom={true}
                    format={"file"}
                    filePath={
                      RNFetchBlob.fs.dirs.DocumentDir +
                      "/" +
                      new Date().getTime() +
                      ".png"
                    }
                    pixelRatio={1}
                    quality={1}
                  />
                ) || (
                  <VideoPlayer
                    endWithThumbnail
                    thumbnail={{
                      uri: this.state.selectedImagesArray[
                        this.state.selectedImagesArray.length - 1
                      ].imageUri }}
                    video={{
                      uri: this.state.selectedImagesArray[
                        this.state.selectedImagesArray.length - 1
                      ].imageUri }}
                    videoWidth={width}
                    videoHeight={height*0.57}
                    disableControlsAutoHide={true}
                  />
                )
              }
          
            </View>
          )}
        </View>

        <CameraKitGalleryView
          style={{
            flex: 1,
            margin: 0,
            height: Metrics.screenHeight,
            backgroundColor: "#ffffff",
            marginTop: 0
          }}
          albumName={this.state.albumName}
          minimumInteritemSpacing={0}
          minimumLineSpacing={0}
          columnCount={4}
          selectedImages={Object.keys(this.state.selectedImagesArray)}
          onSelected={result => { }}
          onTapImage={event => this.onTapImage(event)}
          selection={{
            selectedImage: Images.selectedMultipleImages,
            enable: Object.keys(this.state.selectedImagesArray).length < 5
          }}
          overlayColor={"#ffffff"}
          unSelectedImageIcon={Images.unSelectedMultipleImages}
          imageStrokeColor={"#ffffff"}
          imageStrokeColorWidth={0.5}
          remoteDownloadIndicatorType={'progress-pie'} //spinner / progress-bar / progress-pie
          remoteDownloadIndicatorColor={'white'}
        />
      </ScrollView>
    )
  }
}
  GalleryView.navigationOptions  = ({ navigation }) => {
    return ({// tabBarIcon: ({ focused }) => {
    //   return (
    //     <Image style={{ width: 20, height: 20 }} source={Images.addPhotoTab} />
    //   );
    // },

    title: "GALLERY",
    // title: (
    //   <View style={{ height: 44, width: 200, alignSelf: "center" }}>
    //     <ModalDropdown
    //       options={[
    //         "Camera Roll",
    //         "Favorites",
    //         "Screenshots",
    //         "Recently Deleted"
    //       ]}
    //       defaultValue="Camera Roll"
    //       style={styles.dropdown_1}
    //       dropdownStyle={styles.dropdownStyle}
    //       textStyle={styles.textStyle}
    //       dropdownTextStyle={styles.dropdownTextStyle}
    //       onSelect={(idx, value) => {
    //         navigation.state.params.changeAlbums(value);
    //       }}
    //     />
    //   </View>
    // ),
    headerTitleStyle: Styles.headerTitleStyle,
    headerStyle: Styles.headerStyle,
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.goBack(null);
        }}
        style={Styles.headerLeftContainer}
        >
        <Image
          source={Images.backButton}
          style={[Styles.headerLeftImage, { height: 15, width: 8 }]}
        />
        {/* <Text
          style={{
            color: Colors.white,
            marginLeft: 10,
            fontFamily: "ProximaNova-Light",
            fontSize: 16
          }}
        >
          Cancel
        </Text> */}
      </TouchableOpacity>
    ),
    headerRight : (
      <TouchableOpacity
        onPress={() => {
          // _this.nextPage()
          navigation.state.params.enableNext ? navigation.state.params.nextPage() : null;
        }}
        style={Styles.headerRightContainer}
        activeOpacity={navigation.state.params ? navigation.state.params.enableNext ? 0.5 : 1: 1}
      >
        <Text
          style={[Styles.headerRightText, navigation.state.params ? (navigation.state.params.enableNext ? GalleryViewStyle.headerRightTextActive : GalleryViewStyle.headerRightText) : GalleryViewStyle.headerRightText]}
        >
          Next
        </Text>
      </TouchableOpacity>
    )
    })
  };
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

const mapStateToProps = ({ authReducer, permissions }) => {
  const { userData, loading } = authReducer;
  return { userData, loading, permissions };
};
export default connect(mapStateToProps, {
  updateLoading,
  setTaggedPeople,
  setTaggedPeopleForCompare,
  setPermissions
})(GalleryView);

