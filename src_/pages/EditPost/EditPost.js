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
import TextArea from "../../components/TextArea/TextArea";
import { Card, CardSection, Button } from "../../components";
import { NewPostStyle } from "../NewPost/NewPostStyle";
import { AddCaptionModalStyle } from '../AddCaptionModal/AddCaptionModalStyle';
import { MentionsTextInput, SuggestionsList } from 'react-native-mentions';
import { Colors, Images, Metrics, Styles } from "../../theme";
import { getData } from "./../../services/StorageService";
import { apiCall, postCall } from "./../../services/AuthService";
import { alert, toastMessage } from "./../../services/AlertsService";
import { getCurrentLocation, fetchNearByLocation } from './../../services/LocationService';
import { updateLoading, setPermissions, setTaggedPeople, setTaggedPeopleForCompare } from "../../actions";
import { _checkPermission } from "./../../services/AskPermission";
import { navigateTo } from '../../services/CommonFunctions';
import { editPost } from '../../services/PotsActions';
import { checkNetworkConnection } from '../../services/CommonFunctions';
import _ from "lodash";

const screenHeight = Dimensions.get("window").height;

class EditPost extends Component {
  constructor(props) {
    super(props);
    this.editPostDone = this.editPostDone.bind(this);

    this.state = {
      caption: this.props.navigation.state.params.post.caption,
      location: this.props.navigation.state.params.post.location,
      taggedPeople: this.props.navigation.state.params.post.taggedPeoples,
      medias: this.props.navigation.state.params.post.medias,
      selectedLocation: this.props.navigation.state.params.post.location,
      nearByLocations: [],
      triggeredFetchLocations: false,
      hasChanged: false,
      generatedHashTags: [],
      mentionedUsers: [],
      tempMentionedUsers: this.props.navigation.state.params.post.mentions
    };
    this.compareTaggedPeople = new Array();
    console.log('original = ', this.props.navigation.state.params.post)
  }

  componentWillMount () {
    this.getLocationPermission();
    DeviceEventEmitter.addListener("locationUpdated", e => {
        this.setState({ selectedLocation: e, location: e });
    });
    DeviceEventEmitter.addListener("taggedPeople", t => {
      this.setState({ taggedPeople: t }, () => {
      });
    });
    this.props.navigation.setParams({ editPostDone: this.editPostDone, isUpdatingPost: false });
    let alreadyTaggedPeople = new Array();
    for(let i = 0; i < this.props.navigation.state.params.post.taggedPeoples.length; i++) {
      let taggedPeopleObject = {
        locationX: this.props.navigation.state.params.post.taggedPeoples[i].locationX,
        locationY: this.props.navigation.state.params.post.taggedPeoples[i].locationY,
        mediaNumber: this.props.navigation.state.params.post.taggedPeoples[i].mediaNumber,
        name: this.props.navigation.state.params.post.taggedPeoples[i].user.name,
        user: this.props.navigation.state.params.post.taggedPeoples[i].user,
        username: this.props.navigation.state.params.post.taggedPeoples[i].user.username
      }
      alreadyTaggedPeople.push(taggedPeopleObject);
      this.compareTaggedPeople.push(this.props.navigation.state.params.post.taggedPeoples[i].user)
    }
    
    this.props.setTaggedPeople(alreadyTaggedPeople);
    this.props.setTaggedPeopleForCompare(this.compareTaggedPeople);
  }

  // get mentions user from caption  
  getMentionsUsers(caption) {
    let patt = /@([a-zA-Z0-9.,]+)(?:^|[ ])/g
    let result = caption.match(patt);
    let tempArr = [];
    if (result) {
      for (let i = 0; i < result.length; i++) {
        tempArr.push({ username: result[i].trim().replace('@', '') })
      }
      var removedMentionsUserArray = _.differenceBy(this.state.tempMentionedUsers, tempArr, 'username');
      var newMentionsUserArray = _.differenceWith(this.state.tempMentionedUsers, removedMentionsUserArray, _.isEqual)
      var tempNewMentionUser = []
      for (let i = 0; i < newMentionsUserArray.length; i++) {
        let index = tempNewMentionUser.indexOf(newMentionsUserArray[i]._id);
        if (index < 0) {
          tempNewMentionUser.push(newMentionsUserArray[i]._id);
        }
      }
      this.setState({
        mentionedUsers: tempNewMentionUser
      })
    } else {
      this.setState({
        mentionedUsers: []
      })
    }
  }

  // get mentions hash tags from caption
  getMentionsHashTags(caption) {
    let patt = /#([a-zA-Z0-9.,]+)/g
    let result = caption.match(patt);
    let tempArr = [];
    if (result) {
      for (let i = 0; i < result.length; i++) {
        tempArr.push(result[i].trim().replace('#', ''))
      }
      console.log("generatedHashTags", tempArr)
      this.setState({
        generatedHashTags: tempArr
      })
    } else {
      this.setState({
        generatedHashTags: []
      })
    }
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
        }).catch(error => {
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
      this.setState({
        locationError: 'unknown'
      })
    });
  }

  startFetchingLocations() {
    getCurrentLocation().then(position => {
      this.setState({
        latitude: position.latitude,
        longitude: position.longitude,
        locationError: null
      });
      getData("nearbyLocations")
        .then(locations => {
          this.setState({ nearByLocations: locations });
        }).catch(error => {
          fetchNearByLocation(position).then(locations => {
          this.setState({ nearByLocations: locations });
          }).catch(error => {
          this.setState({
              locationError: error
            })
          });
        })
    }).catch(error => {
    })
  }

  goToTagPeople() {
    navigateTo(this.props.navigation, 'PhotoTags', 
    { 
      chooseMultipleImage: this.props.navigation.state.params.post.medias,
      taggedPeople: this.props.navigation.state.params.post.taggedPeoples,
    })
  }

  goToSearchPage() {
    navigateTo(this.props.navigation, 'AddLocationModal', {
      nearByLocations: this.state.nearByLocations
    });
  }

  async editPostDone () {
    await this.getMentionsUsers(this.state.caption);
    await this.getMentionsHashTags(this.state.caption);
    console.log("this.state.mentionedUsers", this.state.mentionedUsers)
    this.props.navigation.setParams({ isUpdatingPost: true });
    let params = {
      "user": this.props.userData._id,
      "post": this.props.navigation.state.params.post._id,
      "taggedPeoples": this.state.taggedPeople,
      "caption": this.state.caption,
      "location": {
        "latitude" : this.state.selectedLocation.latitude ? this.state.selectedLocation.latitude : "",
        "longitude" : this.state.selectedLocation.longitude ? this.state.selectedLocation.longitude : "",
        "title" : this.state.selectedLocation.title ? this.state.selectedLocation.title : "",
        "description" : this.state.selectedLocation.description ? this.state.selectedLocation.description : ""
      },
      "mentions" : this.state.mentionedUsers,
      "hashTagNames": this.state.generatedHashTags
    }

    console.log("==editPost params", params)

    editPost(params, this.props.userData, this.props.token).then(response => {
      DeviceEventEmitter.emit('refreshProfileFeed', response.result);
      DeviceEventEmitter.emit('refreshHomeFeed', response.result);
      DeviceEventEmitter.emit('refreshPostDetail', response.result);
      this.props.navigation.setParams({ isUpdatingPost: false });
      this.props.navigation.dispatch(backAction);
    }).catch(error => {
      this.props.navigation.setParams({ isUpdatingPost: false });
      if(error == 'no network') {
        alert('No Internet Connection', 'Please check your internet connection.');
      } else {
        alert('Error', 'Failed to update your post!');
      }
    })
  }

  clearSelectedLocation() {
    this.setState({ 
      selectedLocation: {
        title: "",
        description: "",
        address: "",
        latitude: 0,
        longitude: 0
      } 
    });
  }
  getUserSuggestions(searchText) {
    return new Promise((resolve, reject) => {
      const data = {
        query: searchText.substring(1),
      };
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
        userid: this.props.userData._id
      };
      apiCall('users/searchAllUsers', data, headers).then(response => {
        resolve(response.result);
      }).catch(error => {
        reject(error)
      })
    });
  }

  getHashTags(searchText) {
    return new Promise((resolve, reject) => {
      const data = {
        query: searchText.substring(1),
      };
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
        userid: this.props.userData._id
      };
      apiCall('users/searchAllUsers', data, headers).then(response => {
        resolve(response.result);
      }).catch(error => {
        reject(error)
      })
    })
  }

  onSuggestion1Tap(user, hidePanel) {
    console.log("user", user)
    hidePanel();
    const comment = this.state.caption.slice(0, - this.state.keyword.length)
    this.setState({
      users: [],
      caption: comment + '@' + user.username + ' ',
      tempMentionedUsers: [...this.state.tempMentionedUsers, user]
    }, () => {
      console.log("===tempMentionedUsers", this.state.tempMentionedUsers)
    })
  }

  onSuggestion2Tap(hashtag, hidePanel) {
    hidePanel();
    const comment = this.state.caption.slice(0, - this.state.keyword.length)
    this.setState({
      hashTags: [],
      caption: comment + '#' + hashtag + ' ',
      // generatedHashTags: [...this.state.generatedHashTags, hashtag]
    }, () => {
    })
  }

  callback1(keyword) {
    if (keyword.length > 0 && keyword != '@') {
      if (this.reqTimer) {
        clearTimeout(this.reqTimer);
      }
      this.reqTimer = setTimeout(() => {
        if (checkNetworkConnection()) {
          this.getUserSuggestions(keyword)
            .then(data => {
              this.setState({
                keyword: keyword,
                users: [...data],
                suggestionRowHeight: data.length
              })
            })
            .catch(err => {
            });
        } else {
          alert('No internet connection', 'Please check your network connectivity.');
        }
      }, 200);
    }
  }

  callback2(keyword) {
    if (keyword.length > 0 && keyword != '#') {
      if (this.reqTimer) {
        clearTimeout(this.reqTimer);
      }
      // this.reqTimer = setTimeout(() => {
      //   this.getHashTags(keyword)
      //     .then(data => {
      //       this.setState({
      //         keyword: keyword,
      //         data: [...data]
      //       })
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     });
      // }, 200);
    }
  }

  onCaptionChange = (val) => {
    if (val.length == 0) {
      this.setState({ users: [] })
    } else if (val.slice(-1) == '@') {
      this.setState({ users: [] })
    } else if (val.slice(-1) == '#') {
      // @todo - uncomment this after hashtag api is available
      // this.setState({ hashTags: [] })
    }
    console.log("caption", val)
    this.setState({ caption: val })
  }

  renderSuggestionsRow1({ item, index }, hidePanel) {
    return (
      <TouchableOpacity onPress={() => this.onSuggestion1Tap(item, hidePanel)} key={index}>
        <View style={AddCaptionModalStyle.suggestionsRowContainer} key={index}>
          <View style={AddCaptionModalStyle.userIconBox}>
            <CachedImage
              style={AddCaptionModalStyle.avtarImage}
              source={{ uri: item.thumbnail }}
              defaultSource={Images.defaultUser}
              fallbackSource={Images.defaultUser}
              activityIndicatorProps={{ display: "none", opacity: 0 }}
            />
          </View>
          <View style={AddCaptionModalStyle.userDetailsBox}>
            <Text style={AddCaptionModalStyle.displayNameText}>{item.name}</Text>
            <Text style={AddCaptionModalStyle.usernameText}>@{item.username}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderSuggestionsRow2({ item, index }, hidePanel) {
    return (
      <TouchableOpacity onPress={() => this.onSuggestion2Tap(item, hidePanel)} key={index}>
        <Text style={AddCaptionModalStyle.hashTags}>#{item}</Text>
      </TouchableOpacity>
    )
  }

  renderSuggestionsLoadingComponent = () => {
    return (
      <View style={{ flex: 1, width: Metrics.screenWidth, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.black }}>
        <ActivityIndicator
          animating
          size='small'
          style={{ padding: 15 }}
          color={Colors.primary}
        />
      </View>
    )
  }

  renderCaptioncontainer() {
    return (
      <View style={AddCaptionModalStyle.captionConatiner}>
          <View style={AddCaptionModalStyle.avatarImageContainer}>
            <CachedImage
              style={AddCaptionModalStyle.avtarImage}
              source={{ uri: this.props.userData.profileImageUrl }}
              defaultSource={Images.defaultUser}
              fallbackSource={Images.defaultUser}
              activityIndicatorProps={{ display: "none", opacity: 0 }}
            />
          </View>
          <View style={AddCaptionModalStyle.captionTextContainerOuter}>
            <View style={AddCaptionModalStyle.captionTextContainer}>
              {/* <TextArea
                placeholder="Write a caption..."
                placeholderTextColor={Colors.white}
                value={this.state.caption}
                style={AddCaptionModalStyle.textAreaStyle}
                onChangeText={caption => {
                  this.setState({ caption: caption })
                }}
                autoCapitalize="sentences"
                multiline={true}
                inputRef={r => {
                  this.caption = r;
                }}
              /> */}
            <MentionsTextInput
              textInputStyle={AddCaptionModalStyle.textAreaStyle}
              textInputMinHeight={30}
              textInputMaxHeight={80}
              inputValue={this.state.caption}
              keyboardAppearance="dark"
              autoFocus={true}
              underlineColorAndroid="transparent"
              selectionColor={Colors.primary}
              onChangeText={this.onCaptionChange}
            />
            </View>
            <View style={AddCaptionModalStyle.selectedPhotoContainer}>
              <CachedImage
                style={AddCaptionModalStyle.selectedPhoto}
                source={{ uri: this.state.medias[0].thumbnail }}
                defaultSource={Images.placeHolder}
                fallbackSource={Images.placeHolder}
                activityIndicatorProps={{ display: "none", opacity: 0 }}
              />
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

    if (this.state.selectedLocation.description == "") {
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
          {this.state.selectedLocation.description == "" && (
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
          {this.state.selectedLocation.description != "" && (
            <Text style={NewPostStyle.listTextSelected}>
              {this.state.selectedLocation.title ? this.state.selectedLocation.title : this.state.selectedLocation.description}
            </Text>
          )}
        </View>
        {this.state.selectedLocation.description != "" && (
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

  render() {
    return (
      <View style={NewPostStyle.container}>
        <ScrollView>
          {this.renderCaptioncontainer()}
          {/* {this.state.medias[0].mediaType !== 2 &&
            this.renderTagPeople()}
          {this.renderAddLocation()} */}
          <SuggestionsList
            suggestionsPanelStyle={AddCaptionModalStyle.suggestionsPanelStyle}
            loadingComponent={this.renderSuggestionsLoadingComponent}
            trigger={['@', '#']}
            triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
            inputValue={this.state.caption}
            triggerCallback={[this.callback1.bind(this), this.callback2.bind(this)]}
            renderSuggestionsRow={[this.renderSuggestionsRow1.bind(this), this.renderSuggestionsRow2.bind(this)]}
            suggestionsData={[this.state.users, this.state.hashTags]} // array of objects
            keyExtractor={(item, index) => index}
            suggestionRowHeight={70}
            horizontal={false} // default is true, change the orientation of the list
            MaxVisibleRowCount={4} // this is required if horizontal={false}
          />
        </ScrollView>
      </View>
    );
  }
}

const backAction = NavigationActions.back({ key: null });

EditPost.navigationOptions = ({ navigation }) => ({
  title: "Edit Post",
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
      onPress={() => navigation.state.params.editPostDone()}
    >
      {navigation.state.params && !navigation.state.params.isUpdatingPost && (
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
          Done
        </Text>
      )}
      {navigation.state.params && navigation.state.params.isUpdatingPost && (
        <ActivityIndicator
          animating
          size="small"
          style={{ flex: 1 }}
          color={Colors.primary}
        />
      )}
    </TouchableOpacity>
  )
});

const mapStateToProps = ({ authReducer, userActionReducer }) => {
  const { userData, token } = authReducer;
  const { taggedPeople, taggedPeopleForCompare } = userActionReducer;
  return { userData, token };
};

export default connect(mapStateToProps, {
  setTaggedPeople,
  setTaggedPeopleForCompare
})(EditPost);
