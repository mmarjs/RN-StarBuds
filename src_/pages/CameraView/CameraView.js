import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image,
  View,
  Animated,
  Platform,
  Dimensions,
  NativeModules,
  ActivityIndicator
} from "react-native";
import * as Progress from "react-native-progress";
import Camera from "react-native-camera";
import { connect } from "react-redux";
import Video from "react-native-video";
import RNThumbnail from "react-native-thumbnail";
import { CameraKitCameraScreen } from "react-native-camera-kit";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialIcons";
import VideoPlayer from "react-native-video-player";
import { navigateTo } from '../../services/CommonFunctions';
const VideoCroppingManager = NativeModules.VideoCroppingManager;
// VideoCroppingManager.addEvent("Birthday Party", "4 Privet Drive", new Date().toISOString, (res)=>{
//   alert(res);
// });
import { getUser } from "./../../services/StorageService";
import { alert } from "./../../services/AlertsService";
import { CameraViewStyle } from "./CameraViewStyle";
import { Images, Colors, Metrics, Styles } from "../../theme";
import { apiCall, facebookLogin } from "./../../services/AuthService";
import {
  setUserData,
  updateLoading,
  setTaggedPeople,
  setTaggedPeopleForCompare
} from "../../actions";

class CameraView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params ? navigation.state.params.titleText : 'PHOTO',
    headerTitleStyle: Styles.headerTitleStyle,
    headerStyle: Styles.headerStyle,
    headerLeft: (
      <TouchableHighlight
        onPress={() => {
          navigation.state.params.tabAction(navigation);
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
          navigation.state.params.enableNext ? navigation.state.params.nextPage() : null;
        }}
        style={Styles.headerRightContainer}
        activeOpacity={navigation.state.params ? navigation.state.params.enableNext ? 0.5 : 1: 1}
      >
        {/* <Text
          style={[
            Styles.headerRightText,
            {
              color: Colors.primary,
              marginLeft: 10,
              fontFamily: "ProximaNova-Light",
              fontSize: 16,
              textAlign: "right"
            }
          ]}
        >
          Done
        </Text> */}
        <Text style={[Styles.headerRightText, navigation.state.params ? navigation.state.params.enableNext ? CameraViewStyle.headerRightTextActive : CameraViewStyle.headerRightText : CameraViewStyle.headerRightText]}>
          Next
        </Text>
      </TouchableOpacity>
    )
  });
  constructor(props) {
    super(props);
    this.tabAction = this.tabAction.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.camera = null;
    this.progress = 0;
    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fit,
        captureTarget: Camera.constants.CaptureTarget.disk,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto
      },
      galleryImagePath: false,
      cameraImagePath: false,
      videoImagePath: "",
      isRecording: false,
      isCameraButton: false,
      animated: new Animated.Value(0),
      opacityA: new Animated.Value(1),
      isVideoPlay: false,
      isVideoPausedIOS: 0.0,
      isVideoPausedAndroid: true,
      totalDuration: 90000,
      progress: 0,
      videoRecordingTimer: "00 : 00",
      isVideoTimer: false
    }; //https://www.rmp-streaming.com/media/bbb-360p.mp4
  }
  componentWillMount() {
    // _checkPermission('camera');
    this.props.navigation.setParams({
      enableNext: false,
      titleText: 'PHOTO'
    });
  }

  nextPage() {
    if (this.state.videoImagePath) {
      let tempImage = [];
      RNThumbnail.get(this.state.videoImagePath).then(result => {
        tempImage.push({
          uri: this.state.videoImagePath,
          path: this.state.videoImagePath,
          thumbnail: result.path,
          isType: "video"
        });
        // Pause video if play
        if (Platform.OS === "android") {
          if (this.state.isVideoPausedAndroid) {
            this.setState({ isVideoPausedAndroid: false });
          }
        } else {
          if (this.state.isVideoPausedIOS === 1.0) {
            this.setState({
              isVideoPausedIOS: 0.0,
              isVideoPausedAndroid: false
            });
          }
        }
        this.props.setTaggedPeople([]);
        this.props.setTaggedPeopleForCompare([]);
        navigateTo(this.props.navigation, 'NewPost', { images: tempImage });
      });
    } else {
      alert("Error", "Please capture photo ...");
    }
  }

  componentDidMount() {
    const user = this.props.userData;
    this.props.navigation.setParams({
      nextPage: this.nextPage,
      tabAction: this.tabAction
    });
    this.setState({
      user: user
    });
  }

  tabAction(navigation) {
    if (this.state.videoImagePath) {
      this.setState({
        galleryImagePath: false,
        cameraImagePath: false,
        videoImagePath: "",
        isRecording: false,
        isCameraButton: false,
        isVideoPlay: false,
        isVideoPausedIOS: 0.0,
        isVideoPausedAndroid: true,
        totalDuration: 90000,
        progress: 0,
        videoRecordingTimer: "00 : 00",
        isVideoTimer: false
      });
      this.props.navigation.setParams({
        enableNext: false,
        titleText: 'PHOTO'
      })
    } else {
      navigation.goBack(null);
    }

    // let user = this.state.user;
    // this.props.navigation.dispatch({
    //   type: "Tabs",
    //   params: this.props.userData
    // });
    //  this.props.setTaggedPeople([]);
    //  this.props.setTaggedPeopleForCompare([]);
    //    this.props.navigation.dispatch({ type: 'NewPost', params:{ images :tempImage }})
  }
  takePicture = () => {
    if (this.camera && !this.state.isRecording) {
      //this.props.updateLoading(true);
      this.setState({ loading: true });
      this.camera
        .capture()
        .then(data => {

          const d = new Date();
          var timestamp = d.getTime();
          let tempImage = [];
          // let tempDataUrl = Platform.OS === "ios" ? ("file://" + data.path) : (data.path);

          //Calling native module for cropped image
           
          this.props.navigation.setParams({
            enableNext: false
          })

          if (Platform.OS !== "ios") {
            console.log("===data path", data.path)
            VideoCroppingManager.cropImage(data.path, res => {
              let resUrl = "file://" + res;

              this.setState({ cameraImagePath: resUrl, loading: false });
              tempImage.push({
                uri: resUrl,
                filename: "test",
                width: 500,
                height: 500,
                isType: "camera"
              });

              this.props.setTaggedPeople([]);
              this.props.setTaggedPeopleForCompare([]);
              console.log("===take picture", tempImage)

              this.props.navigation.setParams({
                titleText: 'PHOTO'
              });
              navigateTo(this.props.navigation, 'NewPost', { images: tempImage });
            });
          } else {
            this.setState({ cameraImagePath: data.path, loading: false });
            tempImage.push({
              uri: data.path,
              filename: "test",
              width: 500,
              height: 500,
              isType: "camera"
            });
            // this.props.updateLoading(false);
            this.props.setTaggedPeople([]);
            this.props.setTaggedPeopleForCompare([]);
            this.props.navigation.setParams({
              titleText: 'PHOTO'
            });
            navigateTo(this.props.navigation, 'NewPost', {
              images: tempImage
            });

          }
        })
        .catch(err => console.error(err));
    }
  };

  switchType = () => {
    let newType;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
    } else if (this.state.camera.type === front) {
      newType = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType
      }
    });
  };

  get typeIcon() {
    let icon;
    const { back, front } = Camera.constants.Type;
    if (this.state.camera.type === back) {
      icon = Images.rearCameraIcon;
    } else if (this.state.camera.type === front) {
      icon = Images.frontCameraIcon;
    }
    return icon;
  }

  switchFlash = () => {
    let newFlashMode;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode
      }
    });
  };

  get flashIcon() {
    let icon;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      icon = Images.autoFlashIcon;
    } else if (this.state.camera.flashMode === on) {
      icon = Images.onFlashIcon;
    } else if (this.state.camera.flashMode === off) {
      icon = Images.offFlashIcon;
    }
    return icon;
  }

  getSelectedImages(image, current) {
    this.setState({ galleryImagePath: current.uri });
  }

  startRecording = () => {
    this.props.navigation.setParams({
      titleText: 'VIDEO'
    })
    if (this.camera) {
      let progress = 0.0033333;
      this.setState({
        isVideoTimer: true,
        isRecording: true
      });
      this.startTimer();
      this.setState({ isVideoRecording: true });
      this.camera
        .capture({ mode: Camera.constants.CaptureMode.video })
        .then(data => {
          this.props.updateLoading(true);
          this.setState({
            loading: true
          });
          let tempDataPath =
            Platform.OS === "ios" ? "file://" + data.path : data.path;
          VideoCroppingManager.cropVideo(tempDataPath, res => {
            let resUrl = Platform.OS === "ios" ? res : "file://" + res;
            this.setState({ videoImagePath: resUrl });
            this.setState({
              loading: false
            }, () => {
              this.props.navigation.setParams({
                enableNext: true
              })
            });
            //this.props.updateLoading(false);
          });
        })
        .catch(err => {
        });
    }
  };

  stopRecording = () => {
    if (this.camera) {
      this.camera.stopCapture();
      this.setState({
        isVideoRecording: false,
        isRecording: false,
      });

      this.stopTimer();
      clearInterval(this.videoRecordingProgress);
    }
  };

  // This function for video progress bar timer
  startTimer() {
    let timer = 1;
    let progress = 0.10
     this.videoRecordingProgress = setInterval(() => {
      progress = progress + 0.10;
       this.setState({
         progress: progress * 0.033333
       });
      // this.progress = progress * 0.033333
     }, 98);
    this.videoRecorderTimer = setInterval(() => {
      this.setState({
        videoRecordingTimer: moment()
          .hour(0)
          .minute(0)
          .second(timer++)
          .format("mm : ss"),
      });

      if(timer>30){
        clearInterval(this.videoRecordingProgress);
        this.stopRecording();
      }
    }, 1000);
  }

  // This function for stop video progress bar timer
  stopTimer() {
    if (this.videoRecorderTimer) {
      clearInterval(this.videoRecorderTimer);
    }
  }

  cancleImage() {
    this.setState({ cameraImagePath: false });
  }

  onBottomButtonPressed(event) {
    const captureImages = JSON.stringify(event.captureImages);
  }

  // Render Camera Preview using React-native-Camera Library
  renderCamera() {
    return (
      <View style={{ flex: 1 }}>
        <Camera
          ref={cam => {
            this.camera = cam;
          }}
          style={{ flex: 1 }}
          aspect={Camera.constants.Aspect.fill}
          captureTarget={this.state.camera.captureTarget}
          type={this.state.camera.type}
          flashMode={this.state.camera.flashMode}
          onFocusChanged={() => { }}
          onZoomChanged={() => { }}
          defaultTouchToFocus
          mirrorImage={false}
          totalSeconds={30}
          captureQuality={Camera.constants.CaptureQuality["720p"]}
          audio={true}
          captureAudio={true}
        >
          <View style={[{ flex: 0.3 }, CameraViewStyle.bottomOverlay]}>
            <View style={CameraViewStyle.frontCameraOverlay}>
              <TouchableOpacity
                style={CameraViewStyle.typeButton}
                onPress={this.switchType}
              >
                <Image source={this.typeIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={CameraViewStyle.flashButton}
                onPress={this.switchFlash}
              >
                <Image source={this.flashIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      </View>
    );
  }

  // Render Camera View using React-native-Camera-kit
  // renderCamera() {
  //   return (
  //     <View style={{ flex: 1 }}>
  //       <CameraKitCameraScreen
  //       actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
  //       onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
  //       flashImages={{
  //         on: Images.typeIcon,
  //         off: Images.switchFlash,
  //         auto: Images.switchFlash
  //       }}
  //       cameraFlipImage={Images.typeIcon}
  //       captureButtonImage={Images.cameraImage}
  //     />
  //     </View>
  //   );
  // }

  // Render Capture and Video recording Button
  renderCaptureButton() {
    if (this.state.videoImagePath == "") {
      return (
        <View style={CameraViewStyle.buttonOverlay}>
         <View style={CameraViewStyle.timerProgressContainer}>
          
            <Progress.Bar
             style={CameraViewStyle.progress}
              progress={this.state.progress}
             indeterminate={false}
             color={Colors.primary}
             borderWidth={0}
             width={Metrics.screenWidth}
           />
           <View style={{ height: 25 }}>
             <Text style={CameraViewStyle.timerStyle}>
               {this.state.isVideoTimer
                 ? this.state.videoRecordingTimer
                 : "Press and hold to record"}
              </Text>
           </View>
         </View>
          {/* <View style={CameraViewStyle.captureView}>
            <TouchableHighlight
              style={CameraViewStyle.captureButton}
              onPress={() => {
                this.takePicture();
              }}
              onPressOut={() => {
                this.stopRecording();
              }}
              onLongPress={() => {
                this.startRecording();
              }}
            >
              <Image
                source={Images.cameraImage}
                style={{ height: 85, width: 85 }}
              />
            </TouchableHighlight>
          </View> */}
          <View style={CameraViewStyle.captureView}>
            <TouchableOpacity
              style={CameraViewStyle.captureButton}
              onPress={() => {
                this.takePicture();
              }}
              onPressOut={() => {
                setTimeout(() => {
                  this.stopRecording();
                }, 500);
              }}
              onLongPress={() => {
                this.startRecording();
              }}
            >
              <View
                ref={c => {
                  this.captureButtonView = c;
                }}
                style={[
                  CameraViewStyle.captureButtonInside,
                  this.state.isRecording
                    ? CameraViewStyle.captureButtonInsideVideo
                    : CameraViewStyle.captureButtonInsideCamera
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return <View style={CameraViewStyle.buttonOverlay} />;
    }
  }

  renderVideo(){
    return (
      <View >
        <VideoPlayer
          endWithThumbnail
          video={{ uri: this.state.videoImagePath }}
          videoWidth={Metrics.screenWidth}
          videoHeight={Metrics.screenHeight*0.60}
          disableControlsAutoHide={true}
        />
      </View>
    )
  }

  // Recorded video player
  // renderVideo() {
  //   return (
  //     <TouchableWithoutFeedback
  //       onPress={() => {
  //         if (Platform.OS === "android") {
  //           if (this.state.isVideoPausedAndroid) {
  //             this.setState({ isVideoPausedAndroid: false });
  //           } else {
  //             this.setState({ isVideoPausedAndroid: true });
  //           }
  //         } else {
  //           if (this.state.isVideoPausedIOS === 1.0) {
  //             this.setState({
  //               isVideoPausedIOS: 0.0,
  //               isVideoPausedAndroid: false
  //             });
  //           } else {
  //             this.setState({
  //               isVideoPausedIOS: 1.0,
  //               isVideoPausedAndroid: false
  //             });
  //           }
  //         }
  //       }}
  //     >
  //       <View style={{ flex: 1, backgroundColor: "#000" }}>
  //         <View style={CameraViewStyle.playBtn}>
  //           <View style={CameraViewStyle.playButton}>
  //             {(Platform.OS === "android" && (
  //               <Icon
  //                 name={
  //                   this.state.isVideoPausedAndroid ? "play-arrow" : "pause"
  //                 }
  //                 style={{ color: "#1DC43C" }}
  //                 size={42}
  //               />
  //             )) ||
  //               (Platform.OS === "ios" && (
  //                 <Icon
  //                   name={
  //                     this.state.isVideoPausedIOS === 0.0
  //                       ? "play-arrow"
  //                       : "pause"
  //                   }
  //                   style={{ color: "#1DC43C" }}
  //                   size={42}
  //                 />
  //               ))}
  //           </View>
  //         </View>
  //         <Video
  //           source={{ uri: this.state.videoImagePath }}
  //           ref={ref => {
  //             // Can be a URL or a local file.  source={{uri:this.state.videoImagePath}}
  //             this.player = ref;
  //           }}
  //           rate={
  //             this.state.isVideoPausedIOS // Store reference
  //           }
  //           volume={
  //             1.0 // 0 is paused, 1 is normal.
  //           }
  //           muted={
  //             false // 0 is muted, 1 is normal.
  //           }
  //           paused={
  //             this.state.isVideoPausedAndroid // Mutes the audio entirely.
  //           }
  //           resizeMode="cover"
  //           repeat={
  //             true // Pauses playback entirely. // Fill the whole screen at aspect ratio.*
  //           }
  //           playInBackground={
  //             false // Repeat forever.
  //           }
  //           playWhenInactive={
  //             false // Audio continues to play when app entering background.
  //           }
  //           ignoreSilentSwitch={
  //             "ignore" // [iOS] Video continues to play when control or notification center are shown.
  //           }
  //           progressUpdateInterval={
  //             250.0 // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
  //           }
  //           onLoadStart={() => {
  //             // [iOS] Interval to fire onProgress (default to ~250ms)
  //           }}
  //           onLoad={
  //             this.setDuration // Callback when video starts to load
  //           }
  //           onProgress={
  //             this.setTime // Callback when video loads
  //           }
  //           onEnd={() => {
  //             // Callback every ~250ms with currentTime
  //             if (Platform.OS === "android") {
  //               this.setState({ isVideoPausedAndroid: true });
  //             } else {
  //               this.setState({ isVideoPausedIOS: 0.0 });
  //             }
  //           }}
  //           onError={
  //             this.videoError // Callback when playback finishes
  //           }
  //           onBuffer={
  //             this.onBuffer // Callback when video cannot be loaded
  //           }
  //           onTimedMetadata={
  //             this.onTimedMetadata // Callback when remote video is buffering
  //           }
  //           style={
  //             {
  //               top: 0,
  //               left: 0,
  //               right: 0,
  //               width: Metrics.screenWidth,
  //               height: Metrics.screenHeight * 0.56
  //             } // Callback when the stream receive some metadata
  //           }
  //         />
  //       </View>
  //     </TouchableWithoutFeedback>
  //   );
  // }

  render() {
    if (this.props.permissions.camera.status != "authorized") {
      return (
        <View
          style={{
            backgroundColor: "#000",
            flex: 1,
            height: Metrics.screenHeight
          }}
        >
          <Text style={CameraViewStyle.textStyle}>
            Please give permission to Camera for capturing your photos.
          </Text>
        </View>
      );
    }

    // if (this.props.loading) {
    //   return (
    //     <ActivityIndicator
    //       animating
    //       size="large"
    //       style={{
    //         flex: 1,
    //         alignItems: "center",
    //         justifyContent: "center",
    //         backgroundColor: "#0f0f0f"
    //       }}
    //       color={Colors.primary}
    //     />
    //   );
    // }

    return (
      <View style={CameraViewStyle.container}>
        {
          this.state.videoImagePath == "" &&
          (<View style={{ flex: 1 }}><View style={{ flex: 0.7 }}>
            {this.renderCamera()}
          </View>
          <View style={{ flex: 0.301 }}>
            {this.renderCaptureButton()}
          </View></View>) || 
          (<View style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
              {this.renderVideo()}
          </View>
           )
        }
        {this.state.loading && (
          <Spinner
            color={Colors.primary}
            visible={this.state.loading}
            overlayColor="rgba(0, 0, 0, 0.75)"
          />
        )}
      </View>
    );
  }
  // render() {
  //   return (
  //     <CameraKitCameraScreen
  //       actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
  //       onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
  //       flashImages={{
  //         on: Images.typeIcon,
  //         off: Images.switchFlash,
  //         auto: Images.switchFlash
  //       }}
  //       cameraFlipImage={Images.typeIcon}
  //       captureButtonImage={Images.cameraImage}
  //     />
  //   );
  // }
}
const mapStateToProps = ({ authReducer, permissions }) => {
  const { userData, loading } = authReducer;
  return { userData, loading, permissions };
};
export default connect(mapStateToProps, {
  setUserData,
  updateLoading,
  setTaggedPeople,
  setTaggedPeopleForCompare
})(CameraView);
