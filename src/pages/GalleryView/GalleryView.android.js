import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
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
} from "react-native";

import { connect } from "react-redux";
import { TabNavigator, NavigationActions } from "react-navigation";
import {
  CameraKitGallery,
  CameraKitGalleryView
} from "react-native-camera-kit";
// import ModalDropdown from "react-native-modal-dropdown";
import { ImageCrop } from "react-native-image-cropper";

const { fs, fetch, wrap } = RNFetchBlob;
import _ from "lodash";

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
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      galleryImagePath: false,
      galleryImageList: [],
      galleryPermission: false,
      loading: false,
      user: null,
      album: { albumName: "All Photos" },
      albumName: "all photos",
      albums: [],
      dropdownVisible: false,
      images: [],
      imagesDetails: undefined,
      selectedImagesArray: [], //without crops value
      selectedImageId: "",
      selectedImage: [], //crop values
      shouldRenderCameraScreen: false,
      tappedImage: undefined,
      getUrlOnTapImage: false,
      imageMode: "contain",
      isScroll: true,
    };
    this.tempImage = [];
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
  // static navigationOptions = ({ navigation }) => {
  //   console.log('navigation =', navigation)
  //   return ({// tabBarIcon: ({ focused }) => {
  //   //   return (
  //   //     <Image style={{ width: 20, height: 20 }} source={Images.addPhotoTab} />
  //   //   );
  //   // },

  //   title: "GALLERY",
  //   // title: (
  //   //   <View style={{ height: 44, width: 200, alignSelf: "center" }}>
  //   //     <ModalDropdown
  //   //       options={[
  //   //         "Camera Roll",
  //   //         "Favorites",
  //   //         "Screenshots",
  //   //         "Recently Deleted"
  //   //       ]}
  //   //       defaultValue="Camera Roll"
  //   //       style={styles.dropdown_1}
  //   //       dropdownStyle={styles.dropdownStyle}
  //   //       textStyle={styles.textStyle}
  //   //       dropdownTextStyle={styles.dropdownTextStyle}
  //   //       onSelect={(idx, value) => {
  //   //         navigation.state.params.changeAlbums(value);
  //   //       }}
  //   //     />
  //   //   </View>
  //   // ),
  //   headerTitleStyle: Styles.headerTitleStyle,
  //   headerStyle: Styles.headerStyle,
  //   headerLeft: (
  //     <TouchableHighlight
  //       onPress={() => {
  //         navigation.goBack(null);
  //       }}
  //       style={{ padding: 15 }}
  //     >
  //       <Text
  //         style={{
  //           color: Colors.white,
  //           marginLeft: 10,
  //           fontFamily: "ProximaNova-Light",
  //           fontSize: 16
  //         }}
  //       >
  //         Cancel
  //       </Text>
  //     </TouchableHighlight>
  //   ),
  //   headerRight : (
  //     <TouchableOpacity
  //       onPress={() => {
  //         // _this.nextPage()
  //         navigation.state.params.nextPage();
  //       }}
  //       style={Styles.headerRightContainer}
  //       activeOpacity={0.5}
  //     >
  //       <Text
  //         style={[Styles.headerRightText, navigation.state.params ? (navigation.state.params.enableNext ? GalleryViewStyle.headerRightTextActive : GalleryViewStyle.headerRightText) : GalleryViewStyle.headerRightText]}
  //       >
  //         Next
  //       </Text>
  //     </TouchableOpacity>
  //   )
  //   })
  // };

  componentWillMount() {
    this.getUserPermission();
    // _checkPermission("photo").then(data => {
    //   // if(data == 'authorized'){
    //   //   // this.reloadAlbums()
    //   // } else {
    //   //   alert("Please give permission to access your photos from Settings.")
    //   // }
    //   setTimeout(() => {
    //     this.setState({ galleryPermission: true });
    //   }, 100);
    // });
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
  nextPage() {
    if (this.state.selectedImage.length > 0) {
      this.cropImage();
      this.props.setTaggedPeople([]);
      this.props.setTaggedPeopleForCompare([]);
      // this.props.navigation.dispatch({ type: 'PhotoTags', params: this.tempImage})
      navigateTo(this.props.navigation, 'NewPost', {
        images: this.state.selectedImage
      });
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

  changeAlbums(value) {
    this.setState({ albumName: value });
    this.reloadAlbums();
  }
  cloneObject(obj) {
    return JSON.stringify(JSON.parse(obj));
  }
  async reloadAlbums() {
    const newAlbums = await CameraKitGallery.getAlbumsWithThumbnails();
    let albums = [];
    for (let name in newAlbums.albums) {
      albums.push(_.get(newAlbums, ["albums", name]));
    }
    this.setState({ albums });
  }
  async imageTapped(selected) {
    // console.log(this.props.navigation.state.params)
    if (Platform.OS === "ios") {
      if (this.state.images.indexOf(selected) < 0) {
        // First time image selected

       if (this.state.images.length >= 5) {
        await this.cropImage(); 
        return;
         
       }

        if (this.state.selectedImage.length > 0) {
          await this.cropImage();
          await this.setState({ selectedImagesArray: [] });
        }
        this.setState({
          images: _.concat(this.state.images, selected),
          tappedImage: selected
        });
        setTimeout(() => {
          this.getImagesForIds();
        }, 100);
      } else {
        // Image already selected
        let indexOfTappedImage = _.findIndex(this.state.selectedImage, o => {
          return o.id == selected;
        });
        if (indexOfTappedImage > -1) {
          this.state.selectedImage.splice(indexOfTappedImage, 1);
        }
        this.setState({ images: _.without(this.state.images, selected) });
        setTimeout(() => {
          this.getImagesForIds();
        }, 100);
      }
    } else {
      let uri = "file://" + selected;
      console.log("=====file", uri)
      if (this.state.images[selected]) {
        // Crop image
        if (this.state.selectedImage.length > 0) {
          await this.cropImage();
        }
        delete this.state.images[selected];
        let indexOfTappedImage = _.findIndex(
          this.state.selectedImagesArray,
          o => {
            return o.uri == uri;
          }
        );

        if (indexOfTappedImage > -1) {
          this.state.selectedImagesArray.splice(indexOfTappedImage, 1);
          this.state.selectedImage.splice(indexOfTappedImage, 1);
          this.setState({
            selectedImage: this.state.selectedImage,
            selectedImagesArray: this.state.selectedImagesArray,
          }, () => {
            this.props.navigation.setParams({
              enableNext: this.state.selectedImagesArray.length > 0 ? true : false
            });
          });
        }
      } else {
        this.state.images[selected] = true;
        if (this.state.selectedImage.length > 0) {
          await this.cropImage();
        }
        // Get image height and width
        Image.getSize(uri, (width, height) => {
          //update state
          let tempImageArr = {
            uri: uri,
            height: height,
            width: width,
            isType: "image"
          };
          if (this.state.selectedImagesArray.length > 0) {
            let selectedImage = this.state.selectedImage;
            let selectedImagesArray = this.state.selectedImagesArray;
            selectedImage.push(JSON.parse(JSON.stringify(tempImageArr)));
            selectedImagesArray.push(JSON.parse(JSON.stringify(tempImageArr)));
            this.setState({
              selectedImage: selectedImage,
              selectedImagesArray: selectedImagesArray
            }, () => {
              this.props.navigation.setParams({
                enableNext: this.state.selectedImagesArray.length > 0 ? true : false
              });
            });
          } else {
            this.setState({
              selectedImage: [JSON.parse(JSON.stringify(tempImageArr))],
              selectedImagesArray: [JSON.parse(JSON.stringify(tempImageArr))]
            }, () => {
              this.props.navigation.setParams({
                enableNext: this.state.selectedImagesArray.length > 0 ? true : false
              });
            }, () => {
              this.props.navigation.setParams({
                enableNext: this.state.selectedImagesArray.length > 0 ? true : false
              });
            });
          }
        });
      }
      this.setState({ images: { ...this.state.images } });
    }
  }
  cropImage() {
    return this.refs.cropper.crop().then(
      img => {
        this.state.selectedImage[this.state.selectedImage.length - 1].uri = img;
        // let tempSelectedImages = this.state.selectedImage;
        // tempSelectedImages[tempSelectedImages.length-1].uri = img;
        // this.setState({
        //   selectedImage: tempSelectedImages
        // })
        return img;
      },
      err => {
      }
    );
  }

  renderImagesDetails() {
    if (!this.state.imagesDetails) {
      return null;
    }
    return (
      <View>
        <Text>{JSON.stringify(this.state.imagesDetails)}</Text>
      </View>
    );
  }

  async getImagesForIds() {
    const imagesDict = await CameraKitGallery.getImagesForIds(
      this.state.images
    );
    this.setState({ imagesDetails: imagesDict });
    this.setState({ selectedImagesArray: this.state.imagesDetails.images }, () => {
      this.props.navigation.setParams({
        enableNext: this.state.selectedImagesArray.length > 0 ? true : false
      });
    });

    // Check image is already selected or not
    let tappedImageDetails = _.find(this.state.selectedImagesArray, o => {
      return o.id == this.state.tappedImage;
    });
    if (tappedImageDetails) {
      let tempSelectedImage = this.state.selectedImage;
      let index = _.findIndex(this.state.selectedImage, o => {
        return o.id == tappedImageDetails.id;
      });
      if (index < 0) {
        tempSelectedImage.push(tappedImageDetails);
        this.setState({ selectedImage: tempSelectedImage });
      }
    }
  }

  async onGetAlbumsPressed() {
    let albums = await CameraKitGallery.getAlbumsWithThumbnails();
    albums = albums.albums;
    this.setState({
      albumsDS: this.state.albumsDS.cloneWithRows(albums),
      albums: { albums },
      shouldShowListView: true
    });
  }

  render() {
    if (this.props.permissions.photo.status != "authorized") {
      return (
        <View
          style={{
            backgroundColor: "#000",
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
        style={{ flex: 1, backgroundColor: "#000" }}
      >
        <View style={{ height: Metrics.screenWidth, marginTop: -10 }}>
          {this.state.selectedImagesArray.length > 0 && (
            <View
              style={{ flex: 1 }}
              {...this.panResponder.panHandlers}
            >
              <ImageCrop
                changeScrollValue={this.changeScrollValue}
                ref={"cropper"}
                image={
                  this.state.selectedImagesArray[
                    this.state.selectedImagesArray.length - 1
                  ].uri
                  // "http://geekycentral.com/wp-content/uploads/2017/09/react-native.png"
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

              {/* <View style={[{ flex: 0.3 }, GalleryViewStyle.imageModeOverlay]}>
                  <View style={GalleryViewStyle.imageIconOverlay}>
                    <TouchableOpacity
                      onPress={() => {
                        // this.setState({
                        //   imageMode:
                        //     this.state.imageMode == "contain"
                        //       ? "cover"
                        //       : "contain"
                        // });
                        this.cropImage();
                      }}
                    >
                      <Image
                        source={Images.fullScreen}
                        style={GalleryViewStyle.imageIcon}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Image
                        source={Images.multipleImagesIcon}
                        style={GalleryViewStyle.imageIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View> */}
            </View>
          )}
        </View>
        <View>
          {/* <CameraKitGalleryView
              ref={gallery => {
                this.gallery = gallery;
              }}
              style={{
                flex: 1,
                zIndex: 99,
                height: Metrics.screenHeight,
                backgroundColor: "#000"
              }}
              minimumInteritemSpacing={0}
              minimumLineSpacing={0}
              columnCount={4}
              albumName={this.state.albumName}
              onTapImage={result => {
                this.imageTapped(result.nativeEvent.selected);
              }}
              selection={{
                selectedImage: Images.selectedMultipleImages,
                imageSizeAndroid: "large",
                overlayColor: "#ecf0f1aa"
              }}
              unSelectedImageIcon={Images.unSelectedMultipleImages}
              imageStrokeColor={"#edeff0"}
              getUrlOnTapImage={this.state.getUrlOnTapImage}
            /> */}
          <CameraKitGalleryView
            ref={gallery => {
              this.gallery = gallery;
            }}
            style={{
              flex: 1,
              margin: 0,
              height: Metrics.screenHeight,
              backgroundColor: "#ffffff",
              marginTop: 0
            }}
          
            // albumName={this.state.album}
            minimumInteritemSpacing={0}
            minimumLineSpacing={0}
            columnCount={4}
            selectedImages={Object.keys(this.state.images)}
            onSelected={result => {}}
            onTapImage={result => {
              this.imageTapped(result.nativeEvent.selected);
            }}
            selection={{
              selectedImage: Images.selectedMultipleImages,
              enable: Object.keys(this.state.images).length < 5
            }}
            unSelectedImageIcon={Images.unSelectedMultipleImages}
            imageStrokeColor={"#000"}
            imageStrokeColorWidth={0.5}
            // fileTypeSupport={{
            //   supportedFileTypes: ["image/jpeg"],
            //   unsupportedOverlayColor: "#00000055",
            //   unsupportedImage: require("../images/unsupportedImage.png"),
            //   //unsupportedText: 'JPEG!!',
            //   unsupportedTextColor: "#ff0000"
            // }}
            // customButtonStyle={{
            //   image: require("../images/openCamera.png"),
            //   backgroundColor: "#06c4e9"
            // }}
            // onCustomButtonPress={() =>
            //   this.setState({ shouldRenderCameraScreen: true })
            // }
          />
        </View>
      </ScrollView>
    );
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
      <TouchableHighlight
        onPress={() => {
          navigation.dispatch(backAction);
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
    justifyContent: "center",
    backgroundColor: "red",
    marginTop: 20
  },
  buttonText: {
    color: "blue",
    marginBottom: 20,
    fontSize: 20
  },
  dropdown_1: {
    backgroundColor: "#000",
    justifyContent: "center",
    width: null,
    alignItems: "center",
    zIndex: 99,
    marginTop: 5,
    padding: 20
  },
  dropdownStyle: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    justifyContent: "center",
    borderColor: "#ccc"
  },
  textStyle: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "ProximaNova-Semibold"
  },
  dropdownTextStyle: {
    fontSize: 16,
    fontFamily: "ProximaNova-Semibold"
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
