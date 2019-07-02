import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  Platform,
  Switch,
  PermissionsAndroid,
  DeviceEventEmitter,
  NetInfo,
  ActivityIndicator,
  Dimensions,
  Alert,
  Linking
} from "react-native";
import { NavigationActions } from "react-navigation";
import { CachedImage } from "react-native-cached-image";
import { connect } from "react-redux";
var SaveAssetLibrary = require("react-native-save-asset-library");
import async from "async";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Card, CardSection, Button } from "../../components";
import { NewPostStyle } from "./NewPostStyle";
import { Colors, Images, Metrics, Styles } from "../../theme";
import { getData } from "./../../services/StorageService";
import { apiCall, postCall } from "./../../services/AuthService";
import { alert, toastMessage } from "./../../services/AlertsService";
import { getCurrentLocation, fetchNearByLocation } from './../../services/LocationService';
import { updateLoading, setPermissions } from "../../actions";
import { _checkPermission } from "./../../services/AskPermission";
import { navigateTo } from '../../services/CommonFunctions';
import _ from "lodash";

const screenHeight = Dimensions.get("window").height;

class NewPost extends Component {
  constructor(props) {
    super(props);
    this.postAction = this.postAction.bind(this);
    let params = this.props.navigation.state.params;
    console.log('images', params.images)
    const { navigation, jumpToIndex } = this.props;
    this.isNevigateToPhotoTags = true;
    this.isNevigateTonearByLocations = true;
    this.isNevigateToPost = true;
    this.state = {
      caption: "",
      commentingStatus: false,
      locationScrollViewHeight: 40,
      latitude: 0,
      longitude: 0,
      locationError: null,
      nearByLocations: [],
      showLocationsArray: true,
      chooseMultipleImage: params.images,
      triggeredFetchLocations: false
    };
    selectedLocation = {};
    taggedPeoples = [];
    locationScrollViewHeight: 40;
    medias = [];
    tempMedias = [];
    saveeMedias = [];
    generatedHashTags = [],
    mentionedUsers = [],
    tempMentionedUsers = []
    this.result = _.filter(this.state.chooseMultipleImage, (o) => { return o.isType == 'image' || o.isType == 'camera'; })
  }

  getLocationPermission() {
    _checkPermission("location").then(result => {
      if (result === "denied") {
        if (Platform.OS === "ios") {
          Alert.alert(
            "Warning",
            "Starbuds needs location permission please goto settings and enable it",
            [
              {
                text: "OK",
                onPress: () => {
                  Linking.openURL("app-settings:");
                  this.props.updateLoading(false);
                    this.setState({
                      locationError: 'disabled'
                    })
                }
              }
            ],
            { cancelable: false }
          );
        } else {
          // for android
          this.getLocationPermission();
          Alert.alert(
            "Warning",
            "This app needs location permission please goto settings and enable it",
            [
              {
                text: "OK",
                onPress: () => {
                  Linking.openURL("app-settings:");
                  this.props.updateLoading(false);
                  this.setState({
                    locationError: 'disabled'
                  })
                }
              }
            ],
            { cancelable: false }
          );
        }
        let watchId = navigator.geolocation.watchPosition(locationChange => {
          if(!this.state.triggerFetchLocations) {
            this.startFetchingLocations();
            this.setState({ triggeredFetchLocations: true })
            navigator.geolocation.clearWatch(watchId)
          }
        },error => {
        })
      } else if (result === "restricted") {
        alert(
          "Permission",
          "This apps needs location permission, please goto settings and enable it"
        );
      } else if (result === 'authorized'){
        //get user's current location
        this.startFetchingLocations();
      }
    }).catch(error =>  {
      this.props.updateLoading(false);
      this.setState({
        locationError: 'unknown'
      })
    });
  }

  startFetchingLocations() {
    console.log(' start fetching location')
    getCurrentLocation().then(position => {
      this.setState({
        latitude: position.latitude,
        longitude: position.longitude,
        locationError: null
      });
      getData("nearbyLocations")
        .then(locations => {
          this.setState({ nearByLocations: locations });
          this.props.updateLoading(false);
        }).catch(error => {
          fetchNearByLocation(position).then(locations => {
            this.setState({ nearByLocations: locations });
            this.props.updateLoading(false);
          }).catch(error => {
            this.props.updateLoading(false);
            this.setState({
              locationError: error
            })
          });
        })
    }).catch(error => {
      this.props.updateLoading(false);
    })
  }

  componentWillMount() {
    DeviceEventEmitter.addListener("captionUpdated", e => {
      this.setState({ 
        caption: e.caption, 
        generatedHashTags: e.generatedHashTags, 
        mentionedUsers: e.mentionedUsers,
        tempMentionedUsers: e.tempMentionedUsers
      });
    });

    DeviceEventEmitter.addListener("locationUpdated", e => {
      this.setState({ selectedLocation: e });
      let tempData = {
        address: e.address,
        description: e.description,
        latitude: e.latitude,
        longitude: e.longitude
      };
      if (tempData.description) {
        this.setState({ showLocationsArray: false });
        let locations = this.state.nearByLocations;
        for (let i in locations) {
          if (locations[i].selected) {
            locations[i].selected = false;
          }
        }
        this.selectedLocation = tempData;
      }
    });
    this.selectedLocation = {
      description: "",
      address: "",
      latitude: 0,
      longitude: 0
    };
    this.props.updateLoading(true);
  }

  componentDidMount() {
    this.getLocationPermission();
    this.props.navigation.setParams({ postAction: this.postAction });
    NetInfo.isConnected.addEventListener("change", Function.prototype);
  }

  goToTagPeople() {
    if(this.isNevigateToPhotoTags){
      this.isNevigateToPhotoTags = false;
      navigateTo(this.props.navigation, 'PhotoTags', { chooseMultipleImage: this.state.chooseMultipleImage })
      setTimeout(() => {
        this.isNevigateToPhotoTags = true
      }, 2000);
    }
  }

  goToSearchPage() {
    if (this.isNevigateTonearByLocations) {
      this.isNevigateTonearByLocations = false;
      navigateTo(this.props.navigation, 'AddLocationModal', {
        nearByLocations: this.state.nearByLocations
      });
      setTimeout(() => {
        this.isNevigateTonearByLocations = true
      }, 2000);
    }
    
  }

  updateSelectedLocation(index, val) {
    let locations = this.state.nearByLocations;
    for (let i in locations) {
      if (locations[i].selected) {
        locations[i].selected = false;
      }
    }
    locations[index].selected = true;
    this.setState({ nearByLocations: locations, showLocationsArray: false });
    this.selectedLocation = val;
  }

  clearSelectedLocation() {
    let locations = this.state.nearByLocations;
    for (let i in locations) {
      if (locations[i].selected) {
        locations[i].selected = false;
      }
    }
    this.selectedLocation = {
      description: "",
      address: "",
      latitude: 0,
      longitude: 0
    };
    this.setState({ nearByLocations: locations, showLocationsArray: true });
  }

  postAction() {
    if (this.isNevigateToPost){
      this.isNevigateToPost = false;
      let user = this.props.userData;
      this.medias = [];
      this.file = {};
      this.tempMedias = this.state.chooseMultipleImage;
      console.log("==tempMedia", this.tempMedias)
      this.props.updateLoading(true);
      for (let i = 0; i < this.tempMedias.length; i++) {
        // let isType = this.tempMedias[i].isType
        //   ? this.tempMedias[i].isType == "camera" ? 1 : this.tempMedias[i].isType == "image" : 1 ? 2
        //     : 1;
        let isType = this.tempMedias[i].isType ? ( this.tempMedias[i].isType == "camera" ? 1 : (this.tempMedias[i].isType == "image" ? 1 : 2 )) : 1
        console.log('isType', isType)
        this.file["file" + i] = {
          uri: this.tempMedias[i].uri,
          type: this.tempMedias[i].isType === "video" ? "video/*" : "image/jpeg",
          name: this.tempMedias[i].uri.substring(
            this.tempMedias[i].uri.lastIndexOf("/") + 1
          )
          // name: this.tempMedias[i].name
          //   ? this.tempMedias[i].name
          //   : this.tempMedias[i].isType === "video" ? urlstr.substring(urlstr.lastIndexOf('/')+1) :urlstr.substring(urlstr.lastIndexOf('/')+1);
        };
        this.medias.push({ mediaType: isType });
      }
      console.log("file ", this.file)
      this.makeApiCallToAddNewPost(this.file, this.medias);
      setTimeout(() => {
        this.isNevigateToPost = true;
      }, 2000);
    }
    
  }

  makeApiCallToAddNewPost(file, medias) {
    let data = new FormData();
    data.append("user", this.props.userData._id);
    data.append("medias", JSON.stringify(medias));
    data.append(
      "location",
      JSON.stringify({
        latitude: this.selectedLocation.latitude,
        longitude: this.selectedLocation.longitude,
        title: this.selectedLocation.description,
        description: this.selectedLocation.address
      })
    );
    data.append("caption", this.state.caption);
    data.append("mentions", this.state.mentionedUsers ? JSON.stringify(this.state.mentionedUsers) : JSON.stringify([]));
    data.append("hashTagsName", this.state.generatedHashTags ? JSON.stringify(this.state.generatedHashTags) : JSON.stringify([]));
    data.append("taggedPeoples", JSON.stringify(this.props.taggedPeople));
    data.append("commentFlag", !this.state.commentingStatus);
    for (var key in file) {
      if (file.hasOwnProperty(key)) {
        data.append(key, file[key]);
      }
    }
    console.log("body data", data);
    this.props.updateLoading(false);
    setTimeout(() => {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          postCall(
            Metrics.serverUrl + "posts/insertPost",
            {
              method: "post",
              headers: {
                // "Content-Type": "application/json",
                Authorization: "Bearer " + this.props.token,
                userid: this.props.userData._id
              },
              body: data
            },
            this.updateProgress.bind(this)
          )
            .then(responseJson => {
              console.log('posting report ', JSON.parse(responseJson))
              if (JSON.parse(responseJson).status) {
                DeviceEventEmitter.emit(
                  "postSuccess",
                  JSON.parse(responseJson)
                );
                toastMessage("Post has been added");
              } else {
                DeviceEventEmitter.emit(
                  "postError",
                  JSON.parse(responseJson).message
                );
                toastMessage("Something want to wrong");
              }
            })
            .catch(error => {
              console.log('posting report catch error', error)
              DeviceEventEmitter.emit(
                "postError",
                "Please check your network connectivity."
              );
              toastMessage("Please check your network connectivity.");
              // DeviceEventEmitter.emit("postError", "Something want wrong please try again");
            });
          navigateTo(this.props.navigation, 'Tabs')
        } else {
          alert("Network Failed", "Please check your network connection...");
        }
      });
    }, 100);
  }

  updateProgress(oEvent) {
    if (oEvent.lengthComputable) {
      var progress = oEvent.loaded / oEvent.total;
      DeviceEventEmitter.emit("postProgress", progress);
    } else {
      // Unable to compute progress information since the total size is unknown
    }
  }

  renderAddCaptionModal() {
    navigateTo(this.props.navigation, 'AddCaptionModal', {
      caption: this.state.caption,
      mentionedUsers: this.state.mentionedUsers,
      generatedHashTags: this.state.generatedHashTags,
      selectedImages: this.state.chooseMultipleImage,
      tempMentionedUsers: this.state.tempMentionedUsers
    });
  }

  renderCaptioncontainer() {
    let currentCaption = "";
    if (this.state.caption) {
      currentCaption = this.state.caption;
    } else {
      currentCaption = "Write a caption...";
    }
    return (
      <View style={NewPostStyle.captionConatiner}>
        <View style={NewPostStyle.avatarImageContainer}>
          <CachedImage
            style={NewPostStyle.avtarImage}
            source={{ uri: this.props.userData.profileImageUrl }}
            defaultSource={Images.defaultUser}
            fallbackSource={Images.defaultUser}
            activityIndicatorProps={{ display: "none", opacity: 0 }}
          />
        </View>
        <View style={NewPostStyle.captionTextContainerOuter}>
          <TouchableHighlight
            style={NewPostStyle.captionTextContainer}
            onPress={() => {
              this.renderAddCaptionModal();
            }}
          >
            <Text style={NewPostStyle.textAreaStyle} ellipsizeMode={"tail"}>
              {currentCaption}
            </Text>
          </TouchableHighlight>
          <View style={NewPostStyle.selectedPhotoContainer}>
            {(this.state.chooseMultipleImage[0].isType == "video" && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View style={NewPostStyle.selectedVideoThumbnai}>
                  <Icon
                    name={"play-arrow"}
                    style={{ color: "#1DC43C" }}
                    size={32}
                  />
                </View>
                <Image
                  source={{
                    uri: this.state.chooseMultipleImage[0].thumbnail
                  }}
                  style={NewPostStyle.selectedPhoto}
                />
              </View>
            )) || (
              <Image
                source={{ uri: this.state.chooseMultipleImage[0].uri }}
                style={NewPostStyle.selectedPhoto}
              />
            )}
          </View>
        </View>
      </View>
    );
  }

  renderTagPeople() {
    return (
      <View style={NewPostStyle.tagPeopleConatiner}>
        <View style={NewPostStyle.iconContainer}>
          <Image
            source={Images.tagPeopleIcon}
            style={NewPostStyle.tagIconStyle}
          />
        </View>
        <View style={NewPostStyle.textContainer}>
          <TouchableOpacity onPress={() => this.goToTagPeople()}>
            <Text style={NewPostStyle.listText}>Tag People</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderAddLocation() {
    let locationIconSource = "";

    if (this.selectedLocation.description == "") {
      locationIconSource = Images.addLocationIcon;
    } else {
      locationIconSource = Images.addLocationIconSelected;
    }

    return (
      <View
        style={
          this.state.showLocationsArray
            ? NewPostStyle.addLocationConatiner
            : NewPostStyle.addLocationConatinerSelected
        }
      >
        <View style={NewPostStyle.iconContainer}>
          <Image
            source={locationIconSource}
            style={NewPostStyle.locationIconStyle}
          />
        </View>
        <View style={NewPostStyle.textContainer}>
          {this.selectedLocation.description == "" && (
            <TouchableWithoutFeedback
              onPress={() => {
                this.goToSearchPage();
              }}
            >
              <View>
                <Text style={NewPostStyle.listText}>+ Location</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
          {this.selectedLocation.description != "" && (
            <Text style={NewPostStyle.listTextSelected}>
              {this.selectedLocation.description}
            </Text>
          )}
        </View>
        {this.selectedLocation.description != "" && (
          <TouchableOpacity
            onPress={() => this.clearSelectedLocation()}
            style={{ position: "absolute", right: 30 }}
          >
            <Image
              source={Images.closeIconActive}
              style={NewPostStyle.closeIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  renderLocations() {
    let locationsList,
      selectedlocationContainerStyle,
      selectedlocationTextStyle;
    if (this.state.nearByLocations.length > 0) {
      locationsList = this.state.nearByLocations.map((val, index, arr) => (
        <TouchableWithoutFeedback
          key={index}
          onPress={() => {
            this.updateSelectedLocation(index, val);
          }}
        >
          <View
            style={
              val.selected
                ? NewPostStyle.locationTextContainerSelected
                : NewPostStyle.locationTextContainer
            }
          >
            <Text
              style={
                val.selected
                  ? NewPostStyle.locationTextSelected
                  : NewPostStyle.locationText
              }
            >
              {val.description}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      ));
    }
    return (
      <View style={NewPostStyle.locationsContainer}>
        {this.state.nearByLocations.length > 0 && !this.props.loading ? (
          <ScrollView
            horizontal={true}
            automaticallyAdjustContentInsets={false}
            contentContainerStyle={NewPostStyle.locationScrollView}
            showsHorizontalScrollIndicator={false}
          >
            {locationsList}
            <TouchableWithoutFeedback
              onPress={() => {
                this.goToSearchPage();
              }}
            >
              <View style={NewPostStyle.locationTextContainer}>
                <Text style={NewPostStyle.locationText}>Search</Text>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        ) : this.props.loading ? (
          <View
            style={{ justifyContent: "center", flex: 1, flexDirection: "row" }}
          >
            <Text style={{ color: Colors.white, marginLeft: 20 }}>
              Fetching nearby locations...
            </Text>
            <ActivityIndicator
              animating
              size="small"
              style={{
                flex: 1,
                zIndex: 2
              }}
              color={Colors.primary}
            />
          </View>
        ) : (
          <Text style={{ color: Colors.white, marginLeft: 20 }}>Location is disabled.</Text>
        )}
      </View>
    );
  }

  renderTurnOffCommenting() {
    return (
      <View style={NewPostStyle.turnOffCommentingContainer}>
        <View style={NewPostStyle.iconContainer}>
          <Switch
            onValueChange={value => {
              this.setState({ commentingStatus: value });
            }}
            value={this.state.commentingStatus}
            tintColor={"rgb(76, 76, 76)"}
            onTintColor={Colors.primary}
            thumbTintColor={Colors.white}
          />
        </View>
        <View style={NewPostStyle.textContainer}>
          <Text style={NewPostStyle.listText}>Turn Off Commenting</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={NewPostStyle.container}>
        <ScrollView>
          {this.renderCaptioncontainer()}
          {this.result.length >0 && (this.renderTagPeople()) || null}
          {this.renderAddLocation()}
          {this.state.showLocationsArray && this.renderLocations()}
          {this.renderTurnOffCommenting()}
        </ScrollView>
      </View>
    );
  }
}

const backAction = NavigationActions.back({ key: null });

NewPost.navigationOptions = ({ navigation }) => ({
  title: "NEW POST",
  headerTitleStyle: Styles.headerTitleStyle,
  headerStyle: Styles.headerStyle,
  headerLeft: (
    <TouchableOpacity
      onPress={() => {
        navigation.dispatch(backAction);
      }}
      style={Styles.headerLeftContainer}
      activeOpacity={0.5}
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
      onPress={() => navigation.state.params.postAction()}
    >
      <Text
        style={[
          Styles.headerRightText,
          {
            color: Colors.primary,
            fontFamily: "ProximaNova-Bold",
            letterSpacing: 0.8,
            fontSize: 16,
            textAlign: "left"
          }
        ]}
      >
        Post
      </Text>
    </TouchableOpacity>
  )
});

const mapStateToProps = ({ authReducer, userActionReducer }) => {
  const { userData, loading, token } = authReducer;
  const { taggedPeople } = userActionReducer;
  return { userData, loading, token, taggedPeople };
};

export default connect(mapStateToProps, { updateLoading, setPermissions })(
  NewPost
);
