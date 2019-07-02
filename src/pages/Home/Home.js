import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Alert,
  TouchableHighlight,
  Linking,
  DeviceEventEmitter,
  Platform,
  ImageBackground,
  Clipboard,
  Modal,
  NetInfo,
  StyleSheet,
  PushNotificationIOS
} from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";
import ReadMore from "react-native-read-more-text";
import Swiper from "react-native-swiper";
import * as Progress from "react-native-progress";
import { Colors, Images, Styles, Metrics } from "../../theme";
import { CachedImage } from "react-native-cached-image";
import FeedVideo from "../../components/FeedVideo/FeedVideo";
import { NoNetworkView } from '../../components';
import { HomeStyle } from "./HomeStyle";
import {
  setUserData,
  setToken,
  updateLoading,
  setPermissions,
} from "../../actions";
import { _checkPermission } from "./../../services/AskPermission";
import { apiCall } from "./../../services/AuthService";
import { calculateTimeDuration, navigateTo, isIPhoneX } from "./../../services/CommonFunctions";
import { deleteUser, saveData } from "./../../services/StorageService";
import firebase from "react-native-firebase";
import { alert, toastMessage } from "./../../services/AlertsService";
import SharePostModal from "./../SharePostModal/SharePostModal";
import ShareActionSheet from "./../../components/ActionSheet/ShareActionSheet";
import { getCurrentRouteName } from "./../../services/CommonFunctions";
import ParsedText from 'react-native-parsed-text';

//const Fabric = require("react-native-fabric");
//const { Crashlytics } = Fabric;

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
var arrayImages = [Images.story1,Images.story2,Images.story3,Images.story4,Images.story5,
  Images.story1,Images.story2,Images.story3,Images.story4,Images.story5];

class Home extends Component {
  constructor(props) {
    super(props);
    this.changeCommentCount = this.changeCommentCount.bind(this);
    this.state = {
      likePress: false,
      commentPress: false,
      sharePress: false,
      savePress: false,
      pageNo: 0,
      nextPageAvailable: false,
      loadingMore: false,
      posts: [],
      showedEndAlert: false,
      commentPostIndex: 0,
      progress: 0,
      isProgress: false,
      chatActive: false,
      modalVisible: false,
      shareInChatPost: {},
      headerLeftActive: false,
      isActivityIndicator: true,
      isError: false,
      isConnected: true,
      refreshing: false
    };
    this.conversationRef = firebase.firestore().collection("conversations");
    DeviceEventEmitter.addListener("notification", notification => {
      console.log("======notification", notification)
    });
    DeviceEventEmitter.addListener("refreshHomeFeed", e => {
      console.log("======refreshHomeFeed")
      setTimeout(function(){
        this.getPosts(0);
      }, 2000)

    });
    DeviceEventEmitter.addListener('scrollHomePageToTop', () => {
      console.log('Listened scrollHomePageToTop')

      if(this.state.posts.length > 3 && this.state.isConnected){
        this.flatListRef.scrollToIndex({animated: true, index: 0})
      }
    });
    this.isNavigateToChats = true;

  }

  changeCommentCount(value) {
    value.currentPost.totalComments = value.commentCount;
    const newArray = [...this.state.posts];
    newArray[this.state.commentPostIndex].totalComments = value.commentCount;
    this.setState({ posts: newArray });
  }

  getPosts(page) {
    const data = {
      userId: this.props.userData._id,
      pageNo: page
    };
    
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/getPostsForFeed", data, headers)
      .then(response => {
        let tempPosts = new Array(),
          postObj;
        if (page == 0) {
          if (response.result.posts.length == 0) {
            this.setState({
              posts:[],
              isActivityIndicator: false,
              refreshing: false
            });
          } else if (response.result.posts.length == 1) {
            postObj = response.result.posts[0];
            postObj.showTag = false;
            tempPosts.push(postObj);
            this.setState(
              {
                isActivityIndicator: false
              },
              () => {
                this.setState({
                  posts: tempPosts,
                  refreshing: false
                });
              }
            );
          } else if (response.result.posts.length > 1) {
            for (let i = 0; i < response.result.posts.length; i++) {
              postObj = response.result.posts[i];
              postObj.showTag = false;
              tempPosts.push(postObj);
            }
            this.setState({
              isActivityIndicator: false,
              posts: tempPosts,
              refreshing: false
            });
          }
        } else {
          for (let i = 0; i < response.result.posts.length; i++) {
            postObj = response.result.posts[i];
            postObj.showTag = false;
            tempPosts.push(postObj);
          }
          tempData = this.state.posts.concat(tempPosts);
          this.setState({
            isActivityIndicator: false,
            posts: tempData,
            refreshing: false,
            loadingMore: false
          });
        }
        if (response.result.nextPageAvailable) {
          this.setState({ nextPageAvailable: true });
        } else {
          this.setState({ nextPageAvailable: false });
        }
      })
      .catch(error => {
        this.setState({
          isActivityIndicator: false,
          isError: true
        });
        if (
          error.message ==
          "You are not authorized. Token required to access the API."
        ) {
          alert(
            "Session Expired",
            "Please login again. Your session has expired."
          );
          deleteUser("user");
          this.props.setUserData("");
          this.props.setToken("");
          navigateTo(navigation, 'GetStart')
        } else if(error == 'no network') {
          this.setState({ isConnected: false });
        }
      });
  }

  chatAction = () => {
    
    if (this.isNavigateToChats) { 
      this.isNavigateToChats = false;
      this.props.navigation.navigate('AllChats', {
        userData: this.props.userData,
        from: 'Home'
      });
      setTimeout(() => {
        this.isNavigateToChats = true;
      }, 2000);
    }
  };

  headerLeftActionPressIn = () => {
    this.props.navigation.setParams({
      headerLeftActive: true,
      disableChatAction: true,
      // chatActive: true
    });
  };

  headerLeftActionPressOut = () => {
    this.props.navigation.setParams({
      headerLeftActive: false,
      disableChatAction: false,
      // chatActive: false
    });
  };

  headerLeftAction = () => {
    Linking.openURL("https://www.leafly.com/");
  };

  headerRightActionPressIn = () => {
    this.props.navigation.setParams({
      chatActive: true,
    });
  };

  headerRightActionPressOut = () => {
    this.props.navigation.setParams({
      chatActive: false,
    });
  };

  getActionSheetRef = ref => {
    this.actionSheet = ref;
  };

  shareOnFacebook = () => {
    const shareLinkContent = {
      contentType: "link",
      contentUrl: this.state.postIdURL,
      contentDescription: "Check this post"
    };
    ShareDialog.canShow(shareLinkContent)
      .then(
        canShow => {
          if (canShow) {
            return ShareDialog.show(shareLinkContent);
          }
        },
        function(error) {
          return error;
          alert("error", error.message);
        }
      )
      .then(
        result => {
          if (result.isCancelled) {
            alert("Share operation was cancelled");
          } else {
            alert("Share was successful");
          }
        },
        function(error) {
          alert("Share failed with error: " + error.message);
        }
      );
  };

  componentDidMount() {
    this.props.navigation.setParams({
      chatAction: this.chatAction,
      notificationCount: 0,
      chatActive: false,
      headerLeftActive: false,
      headerLeftAction: this.headerLeftAction,
      headerLeftActionPressIn: this.headerLeftActionPressIn,
      headerLeftActionPressOut: this.headerLeftActionPressOut,
      headerRightActionPressIn: this.headerRightActionPressIn,
      headerRightActionPressOut: this.headerRightActionPressOut
    });
    NetInfo.isConnected.fetch().then(isConnected => {
      isConnected ? this.getPosts(0) : this.setState({ isConnected: false, isActivityIndicator: false });
v    });
    NetInfo.isConnected.addEventListener('change', this._handleConnectionChange);
    // const dispatchConnected = isConnected => this.props.dispatch(setIsConnected(isConnected));
    // NetInfo.isConnected.addEventListener("change", Function.prototype);
  }

  componentWillMount() {
    saveData('currentScreen', "Home");
    // make request to get postss
    setTimeout(() => this.getUserPermission(), 1000);
    //this.getNotificationCount();
    DeviceEventEmitter.addListener("postProgress", e => {
    if (this.state.isProgress) {
        this.setState({ progress: e });
      } else {
        this.setState({ progress: e, isProgress: true });
      }
    });
    DeviceEventEmitter.addListener("postError", e => {
      toastMessage(e);
      this.setState({ progress: 0, isProgress: false });
    });
    DeviceEventEmitter.addListener("postSuccess", e => {
      let postRes = e.result;
      // postRes["userDetail"] = [this.props.userData];
      postRes.likedOrNot = false;
      postRes.postSavedOrNot = false;
      postRes.showTag = false;
      postRes.totalComments = postRes.totalComments;
      postRes.totalLikes = postRes.totalLikes;
      if (this.state.posts.length > 0) {
        tempData = this.state.posts;
        tempData.unshift(postRes);
      } else {
        tempData = [];
        tempData.push(postRes);
      }
      this.setState({
        progress: 0,
        isProgress: false,
        posts: tempData,
        refreshing: false,
        loadingMore: false,
        isActivityIndicator: false
      });
      DeviceEventEmitter.emit('refreshProfileFeed', {});
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('change', this._handleConnectionChange);
    if (this.conversationListener) {
      this.conversationListener();
    }
  }
  
  _handleConnectionChange = (isConnected) => {
    if(isConnected) {
      this.setState({ isConnected: true }, () => {
        this.setState({ isActivityIndicator: true });
        this.getPosts(0)
      })
    } else {
      this.setState({ isConnected: false })
    }
  };

  getNotificationCount = () => {
    let { _id } = this.props.userData;
    this.conversationListener = this.conversationRef
      .where(`collaborators.${_id}._id`, "==", _id)
      .onSnapshot(querySnapShot => {
        let refsDoc = [];
        let docData = [];
        querySnapShot.forEach(function(doc) {
          docData.push(doc.data());
        });
        let notificationCount = docData.reduce((sum, conversationData) => {
          // if(!conversationData.collaborators[_id].readStatus){
          //   console.log(conversationData);
          // }
          let adder = !conversationData.collaborators[_id].readStatus ? 1 : 0;
          return sum + adder;
        }, 0);
        var currentRoute = getCurrentRouteName(this.props.nav);
        if(currentRoute == 'Home'){
          this.props.navigation.setParams({
            notificationCount: notificationCount
          });
        }
      });
  };

  openShareOptions = post => {
    this.setState(
      {
        postIdURL: `${Metrics.serverUrl}post/${post._id}`,
        postIdForSharing: post._id,
        postByUserId: post.user
      },
      () => {
        this.actionSheet.show();
      }
    );
  };
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
          "This apps needs camera permission, please goto settings and enable it"
        );
      } else if (result === "authorized") {
        _checkPermission("photo").then(result1 => {
          this.props.setPermissions("photo", result1);
          if (result1 === "denied") {
            if (Platform.OS === "ios") {
              Alert.alert(
                "Warning",
                "This app needs gallery permission please goto settings and enable it",
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

  likePost(index, post) {
    const newArray = [...this.state.posts];
    newArray[index].likedOrNot = true;
    newArray[index].totalLikes = newArray[index].totalLikes + 1;
    this.setState({ posts: newArray });
    const data = {
      post: post._id,
      user: this.props.userData._id
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/likePost", data, headers)
      .then(response => {
        if (response.status) {
          // console.log('emitted refreshProfileFeed')
          DeviceEventEmitter.emit('refreshProfileFeed', {});
        } else {
        }
      })
      .catch(error => {});
  }

  disLikePost(index, post) {
    const newArray = [...this.state.posts];
    newArray[index].likedOrNot = false;
    newArray[index].totalLikes = newArray[index].totalLikes - 1;
    this.setState({ posts: newArray });
    const data = {
      post: post._id,
      user: this.props.userData._id
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/dislikePost", data, headers)
      .then(response => {
        if (response.status) {
          console.log('emitted refreshProfileFeed')
          DeviceEventEmitter.emit('refreshProfileFeed', {});
        } else {
        }
      })
      .catch(error => {});
  }

  commentOnPost(post, from, index) {
    this.setState({ commentPostIndex: index });
    this.props.navigation.navigate("AddComment", {
      post: post,
      currentUser: this.props.userData,
      postOwner: post.userDetail[0],
      from: "Home",
      openKeyboard: from,
      commentCount: post.totalComments,
      changeCommentCount: this.changeCommentCount
    });
  }
  toggleModalVisibility = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  };

  sharePost = post => {
    this.setState(
      {
        shareInChatPost: post
      },
      () => {
        this.toggleModalVisibility();
      }
    );

    // this.props.navigation.dispatch({
    //   type: "ShareInChat",
    //   params: {
    //     post: post
    //   }
    // });
    // alert("save post");
    // const headers = { "Content-Type": "application/json", Authorization: "Bearer " + this.props.token, userid: this.props.userData._id };
    // const data = { userId: this.props.userData._id, post: post };
    // apiCall("users/sharePost", data, headers)
    //   .then(response => {
    //     if (response.status) {
    //       // add code to show that the post is saved
    //     }
    //   })
    //   .catch(error => {
    //     // add code to show that the post is saved
    //   });
  };

  gotoProfile = post => {
    if (post.userDetail[0]._id === this.props.userData._id) {
      // Navigate to Profile
      navigateTo(this.props.navigation, 'Profile');
    } else {
      navigateTo(this.props.navigation, 'OtherProfile', {
        profileId: post.userDetail[0]._id,
        profileName: post.userDetail[0].name,
        from: "Home"
      });
    }
  };

  savePost(index, post) {
    const newArray = [...this.state.posts];
    newArray[index].postSavedOrNot = true;
    this.setState({ posts: newArray });
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    const data = {
      user: this.props.userData._id,
      post: post
    };

    apiCall("posts/savePost", data, headers)
      .then(response => {
        if (response.status) {
          // add code to show that the post is saved
          DeviceEventEmitter.emit('refreshProfileFeed', {});
          DeviceEventEmitter.emit('refreshSaved', {});
        }
      })
      .catch(error => {
        // add code to show that the post is saved
      });
  }

  unsavePost(index, post) {
    const newArray = [...this.state.posts];
    newArray[index].postSavedOrNot = false;
    this.setState({ posts: newArray });
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    const data = {
      user: this.props.userData._id,
      post: [post]
    };

    apiCall("posts/unsavePost", data, headers)
      .then(response => {
        if (response.status) {
          // add code to show that the post is saved
          DeviceEventEmitter.emit('refreshProfileFeed', {});
          DeviceEventEmitter.emit('refreshSaved', {});
        }
      })
      .catch(error => {
        // add code to show that the post is saved
      });
  }

  handleRefresh = () => {
    this.setState(
      {
        pageNo: 0,
        refreshing: true
      },
      () => {
        this.getPosts(0);
      }
    );
  };

  _renderTruncatedFooter = handlePress => {
    return (
      <Text
        style={{ color: Colors.primary, marginTop: 5 }}
        onPress={handlePress}
      >
        Read more
      </Text>
    );
  };

  _renderRevealedFooter = handlePress => {
    return (
      <Text
        style={{ color: Colors.primary, marginTop: 5 }}
        onPress={handlePress}
      >
        Show less
      </Text>
    );
  };

  handleLoadMore = () => {
    if (this.state.nextPageAvailable) {
      if (!this.state.loadingMore) {
        this.setState(
          {
            pageNo: this.state.pageNo + 1,
            loadingMore: true
          },
          () => {
            this.getPosts(this.state.pageNo);
          }
        );
      }
    } else {
      if (!this.state.showedEndAlert) {
        this.setState(
          {
            showedEndAlert: true
          },
          () => {
            // alert("That's all for now!");
          }
        );
      }
    }
  };

  renderProfileImageUrl() {
    if (this.props.userData) {
      return { uri: this.props.userData.profileImageUrl };
    }
    return Images.defaultUser;
  }

  dynamicStyle(data) {
    let left = screenWidth * data.locationX / 100;
    let top = screenHeight * data.locationY / 100;
    let right = screenWidth * (100 - data.locationX) / 100;

    if (data.locationX > 70) {
      return {
        position: "absolute",
        top: data.locationY < 50 ? top : top - 37,
        right: right > 15 ? right - 20 : right,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
      };
    } else {
      return {
        position: "absolute",
        top: data.locationY < 50 ? top : top - 37,
        left: left < 22 ? 2 : left - 22,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
      };
    }
  }
  renderTag(imageData, taggedPeoples, imageIndex) {
    return taggedPeoples.map((tagged, index) => {
      if (tagged.mediaNumber == imageIndex) {
        return (
          <View
            key={imageData._id + index}
            style={this.dynamicStyle(tagged)}
          >
            {
              tagged.locationY < 50 && (<View style={tagged.locationX > 70 ? Styles.leftTagTriangle : Styles.rightTagTriangle}>
                <View style={Styles.tagTriangle} />
              </View>) || null
            }
            <View style={Styles.tagUserView}>
              <Text style={Styles.tagListText}>{tagged.user.username}</Text>
            </View>
            {
              tagged.locationY > 50 && (<View style={tagged.locationX > 70 ? Styles.leftTagTriangle : Styles.rightTagTriangle}>
                <View style={Styles.tagTriangleBottom} />
              </View>) || null
            }
          </View>
        );
      }
    });
  }

  updateTag(postIndex) {
    const newPosts = [...this.state.posts];
    newPosts[postIndex].showTag = !newPosts[postIndex].showTag;
    this.setState({ posts: newPosts });
  }

  renderImage(imageData, resizeMode, taggedPeoples, post, imageIndex) {
    if (taggedPeoples.length > 0) {
      return (
        <CachedImage
          key={imageData._id}
          style={HomeStyle.imageInList}
          source={{ uri: imageData.mediaUrl }}
          defaultSource={Images.placeHolder}
          fallbackSource={Images.placeHolder}
          activityIndicatorProps={{ display: "none", opacity: 0 }}
          resizeMode={"cover"}
        >
          {post.showTag &&
            this.renderTag(
              imageData,
              taggedPeoples,
              imageIndex ? imageIndex : 0
            )}
        </CachedImage>
      );
    } else {
      return (
        <CachedImage
          key={imageData._id}
          style={HomeStyle.imageInList}
          source={{ uri: imageData.mediaUrl }}
          defaultSource={Images.placeHolder}
          fallbackSource={Images.placeHolder}
          activityIndicatorProps={{ display: "none", opacity: 0 }}
          resizeMode={"cover"}
        />
      );
    }
  }

  renderVideo(imageData) {
    return (
      <FeedVideo
        key={imageData._id}
        videoContainerStyle={HomeStyle.videoContainer}
        ContainerStyles={HomeStyle}
        imageData={imageData}
      />
    );
  }

  renderImageInsideSwiper(post, postIndex) {
    return post.medias.map((imageData, index) => {
      if (imageData.mediaType == 1) {
        return (
          <View
            style={{ height: screenWidth, width: screenWidth }}
            key={imageData._id}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.updateTag(postIndex);
              }}
            >
              {this.renderImage(
                imageData,
                "contain",
                post.taggedPeoples,
                post,
                index
              )}
            </TouchableWithoutFeedback>
          </View>
        );
      } else {
        return this.renderVideo(imageData);
      }
    });
  }

  renderMedias(post, postIndex) {
    // images, taggedPeoples, postIndex, post
    if (post.medias.length > 1) {
      return (
        <Swiper
          style={{ height: isIPhoneX() ? screenWidth + 15 : screenHeight / 1.8 + 18 }}
          dot={<View style={Styles.swiperDot} />}
          activeDot={<View style={Styles.activeSwiperDot} />}
          paginationStyle={Styles.swiperPagination}
          loop={false}
          removeClippedSubviews={false}
        >
          {this.renderImageInsideSwiper(post, postIndex)}
        </Swiper>
      );
    } else {
      if (post.medias[0].mediaType == 1) {
        return (
          <TouchableWithoutFeedback
            onPress={() => {
              this.updateTag(postIndex);
            }}
          >
            {this.renderImage(
              post.medias[0],
              "contain",
              post.taggedPeoples,
              post
            )}
          </TouchableWithoutFeedback>
        );
      } else {
        return this.renderVideo(post.medias[0]);
      }
    }
  }

  handleMentionsUser = (user) => {    
    if (user.replace('@', '').trim() === this.props.userData.username) {
      // Navigate to Profile
      navigateTo(this.props.navigation, 'Profile');
    } else {
      navigateTo(this.props.navigation, 'OtherProfile', {
        profileName: user.replace('@', '').trim(),
        from: "mention"
      });
    }
  } 

  handleHashTag = (hashTag) => {
    // console.log('hashTag', hashTag)
    navigateTo(this.props.navigation, 'SearchHashTags', {
      hashTagName: hashTag.replace("#", ""),
    })
  }

  renderListItem = ({ item, index }) => {
     return (
      <View style={HomeStyle.imageInListContainer}>
        <View style={HomeStyle.imageTopDetails}>
          <View style={Styles.profileImageForPostContainerInFeed}>
            <CachedImage
              style={Styles.profileImageForPostInFeed}
              source={{ uri: item.userDetail[0].profileImageUrl }}
              defaultSource={Images.defaultUser}
              fallbackSource={Images.defaultUser}
              activityIndicatorProps={{ display: "none", opacity: 0 }}
            />
          </View>
          <View style={Styles.listItemTitleInFeed}>
            <TouchableWithoutFeedback onPress={() => this.gotoProfile(item)}>
              <View>
                <Text style={Styles.listItemTitleUsernameInFeed}>
                  {item.userDetail[0].username}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            {item.location.title.length > 1 && (
              <Text
                numberOfLines={1}
                ellipsizeMode={"tail"}
                style={Styles.listItemTitleLocationInFeed}
              >
                {item.location.title ? item.location.title : item.location.description}{" "}
                {(item.location.title || item.location.description) && (
                  <Image
                    source={Images.rightArrow}
                    style={Styles.rightArrowInFeed}
                  />
                )}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => this.openShareOptions(item)}
            style={Styles.threeHorizontalDotsContainerInFeed}
          >
            <Image
              source={Images.threeHorizontalDots}
              style={Styles.threeHorizontalDotsInFeed}
            />
          </TouchableOpacity>
        </View>
        {this.renderMedias(item, index)}
        <View style={HomeStyle.imageBottomDetailsBottom}>
          <View style={Styles.feedActionsRowContainer}>
            <View style={Styles.feedActionLeftContainer}>
              {!item.likedOrNot && (
                <TouchableHighlight
                  onPress={() => this.likePost(index, item)}
                  underlayColor={"transparent"}
                  style={Styles.feedActionLikeContainer}
                >
                  <Image
                    style={Styles.unlikeIcon}
                    source={Images.feedLikeInactive}
                  />
                </TouchableHighlight>
              )}
              {item.likedOrNot && (
                <TouchableHighlight
                  onPress={() => this.disLikePost(index, item)}
                  underlayColor={"transparent"}
                  style={Styles.feedActionLikeContainer}
                >
                  <Image
                    style={Styles.likeIcon}
                    source={Images.feedLikeActive}
                  />
                </TouchableHighlight>
              )}
              {item.commentFlag && (
                <TouchableHighlight
                  onPress={() => this.commentOnPost(item, "comment", index)}
                  underlayColor={"transparent"}
                  style={[Styles.feedActionCommentContainer,{right:2}]}
                >
                  <Image
                    style={Styles.commentIcon}
                    source={Images.feedCommentInactive}
                  />
                </TouchableHighlight>
              )}
              <TouchableOpacity
                onPress={() => this.sharePost(item)}
                underlayColor={"transparent"}
                style={Styles.feedActionShareContainer}
              >
                <Image
                  style={Styles.shareIcon}
                  source={Images.forward_N}
                />
              </TouchableOpacity>
            </View>
            <View style={Styles.feedActionRightContainer}>
              <Text style={Styles.likeTextInFeed}>
                {item.totalLikes}
                {item.totalLikes <= 1 ? " like" : " likes"}
              </Text>
              {!item.postSavedOrNot && (
                <TouchableHighlight
                  onPress={() => this.savePost(index, item._id)}
                  underlayColor={"transparent"}
                  style={Styles.feedActionSaveContainer}
                >
                  <Image
                    style={Styles.saveIcon}
                    source={Images.savePost_icon}
                  />
                </TouchableHighlight>
              )}
              {item.postSavedOrNot && (
                <TouchableHighlight
                  onPress={() => this.unsavePost(index, item._id)}
                  underlayColor={"transparent"}
                  style={Styles.feedActionSaveContainer}
                >
                  <Image
                    style={Styles.saveDIcon}
                    source={Images.savePost_icon}
                  />
                </TouchableHighlight>
              )}
            </View>
          </View>
          {item.caption.length < 100 && (
            <Text
              style={Styles.usernameBeforeCaptionInFeed}
              numberOfLines={5}
              ellipsizeMode={"tail"}
            >
              {item.userDetail[0].username + " "}{" "}
              {item.caption != "" && (
                // <Text style={Styles.captionTextInFeed}>{item.caption}</Text>
                <ParsedText
                  style={Styles.captionTextInFeed}
                  parse={
                    [
                      { pattern: /@([a-zA-Z0-9.,_]+)(?:^|[ ])/, style: { color: Colors.primary }, onPress: this.handleMentionsUser },
                      { pattern: /#([a-zA-Z0-9.,_]+)/, style: { color: Colors.primary }, onPress: this.handleHashTag },
                    ]
                  }
                  childrenProps={{allowFontScaling: false}}
                >
                 {item.caption}
                </ParsedText>
              )}
            </Text>
          )}
          {item.caption.length >= 100 && (
            <View style={Styles.bigCaptionWrapperInFeed}>
              <ReadMore
                numberOfLines={3}
                renderTruncatedFooter={this._renderTruncatedFooter}
                renderRevealedFooter={this._renderRevealedFooter}
              >
                <Text style={Styles.usernameBeforeCaptionInFeed}>
                  {item.userDetail[0].username + " "}{" "}
                  {item.caption != "" && (
                    // <Text style={Styles.captionTextInFeed}>{item.caption}</Text>
                     <ParsedText
                       style={Styles.captionTextInFeed}
                       parse={
                         [
                           { pattern: /@([a-zA-Z0-9.,_]+)(?:^|[ ])/, style: { color: Colors.primary }, onPress: this.handleMentionsUser},
                           { pattern: /#([a-zA-Z0-9.,_]+)/, style: { color: Colors.primary }, onPress: this.handleHashTag },
                         ]
                       }
                       childrenProps={{ allowFontScaling: false }}
                     >
                       {item.caption}
                     </ParsedText>
                  )}
                </Text>
              </ReadMore>
            </View>
          )}
          {item.commentFlag &&
            item.totalComments > 0 && (
              <TouchableHighlight
                onPress={() => this.commentOnPost(item, "view", index)}
                underlayColor={"transparent"}
              >
                <Text style={Styles.commentTextInFeed}>
                  View {item.totalComments == 1 ? "" : "all"}{" "}
                  {item.totalComments}
                  {item.totalComments == 1 ? " comment" : " comments"}
                </Text>
              </TouchableHighlight>
            )}
          <View style={Styles.durationTextContainerInFeed}>
            <Icon name="schedule" color={Styles.durationTextInFeed.color} />
            <Text style={Styles.durationTextInFeed}>
              {calculateTimeDuration(item.createdAt)}{" "}
              {calculateTimeDuration(item.createdAt) != "now" ? "ago" : ""}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  _keyExtractor = (item, index) => item._id;

  renderFooter = () => {
    if (this.state.loadingMore) {
      return (
        <ActivityIndicator
          animating
          size="small"
          style={{ zIndex: 10 }}
          color={Colors.primary}
        />
      );
    } else {
      return null;
    }
  };

  renderProgressBar() {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Progress.Bar
          style={HomeStyle.progress}
          progress={this.state.progress}
          indeterminate={false}
          color={Colors.primary}
          borderWidth={0}
          width={Metrics.screenWidth}
        />
      </View>
    );
  }

  renderActivityIndicator () {
    return (
      <ActivityIndicator
        animating
        size="large"
        style={HomeStyle.activityindicatorStyle}
        color={Colors.primary}
      />
    )
  }

  renderEmptyView = () => {
    return (
       <ImageBackground style={HomeStyle.emptyContainer} source={Images.homePlaceHolder}>
      {/* <ImageBackground
          style={HomeStyle.imageContainer}
          source={Images.background_image}
      ></ImageBackground> */}

        <TouchableOpacity
          onPress={() => {
            navigateTo(this.props.navigation, 'AddPhotoModal')
          }}
        >
          <Image
            source={Images.shareContentPlus}
            style={HomeStyle.noPostImage}
          />
        </TouchableOpacity>

        <Text style={HomeStyle.shareContentText}>SHARE CONTENT</Text>
        <Text style={HomeStyle.shareContentText2}>
          When you share photos and videos, they appear here in your
          profile.
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigateTo(this.props.navigation, 'AddPhotoModal')
          }}
        >
          <Text style={HomeStyle.shareText}>SHARE</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }

  _renderItem1234 = ({ item, index }) => {
    return (
      <View
        style={{
          marginLeft: 2,
          marginBottom: 2,
          backgroundColor: 'white',
          width: 80,
          height: 100
        }}>
       <Image style={{borderRadius: 0,width : 80, height : 80}}
            source={arrayImages[index]}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={HomeStyle.container}>
        {this.state.isProgress && this.renderProgressBar()}
        {this.state.isConnected  && !this.state.isActivityIndicator && (
          <View style={{ flex: 1, backgroundColor: "white" }}>
          <FlatList
          data={[{ key: 'Story1' }, { key: 'Story2' }, { key: 'Story3' },{ key: 'Story4' }, { key: 'Story5' }, { key: 'Story6' },{ key: 'Story7' }, { key: 'Story8' }]}
          renderItem={this._renderItem1234}
          horizontal={true}
          showsHorizontalScrollIndicator = {false}
			  	ItemSeparatorComponent={() => <View style={{margin: 0}}/>}
          />
            <FlatList
              data={this.state.posts}
              numColumns={1}
              keyExtractor={this._keyExtractor}
              renderItem={this.renderListItem}
              ListFooterComponent={this.renderFooter}
              ListEmptyComponent={this.renderEmptyView}
              onEndReachedThreshold={0.1}
              onEndReached={this.handleLoadMore}
              onRefresh={this.handleRefresh}
              refreshing={this.state.refreshing}
              extraData={this.state}
              ref={ref => {
                this.flatListRef = ref;
              }}
            />
          </View>
        )}
        {this.state.isActivityIndicator && this.renderActivityIndicator()}
        {/* {this.state.isConnected && !this.state.posts.length && !this.state.isActivityIndicator && this.renderEmptyView()} */}
        {!this.state.isConnected && <NoNetworkView />}
        <ShareActionSheet
          {...this.props}
          postByUserId={this.state.postByUserId}
          getActionSheetRef={this.getActionSheetRef}
          postIdURL={this.state.postIdURL}
          postIdForSharing={this.state.postIdForSharing}
        />
        <SharePostModal
          {...this.props}
          modalVisible={this.state.modalVisible}
          post={this.state.shareInChatPost}
          toggleModalVisibility={this.toggleModalVisibility}
        />
      </View>
    );
  }
}

Home.navigationOptions = ({ navigation }) => {
  return ({
    title: <Image style={HomeStyle.headerImage} source={Images.logoFlower} />,
    // headerTitleStyle: Styles.headerTitleStyle,alignSelf: "center",
    headerTitleStyle: {alignSelf: "center"},
    // headerStyle: [Styles.headerStyle, { height: 69.7 }],
    headerStyle: Styles.headerStyle,
    headerLeft: (
      <TouchableOpacity
        style={Styles.headerLeftContainer}
        onPress={() => {
          navigation.state.params.headerLeftAction();
        }}
        activeOpacity={1}
        onPressIn={() => navigation.state.params.headerLeftActionPressIn()}
        onPressOut={() => navigation.state.params.headerLeftActionPressOut()}
      >
        <Image
          style={[Styles.headerLeftImage, HomeStyle.addUserIcon]}
          source={
            navigation.state.params ? navigation.state.params.headerLeftActive
              ? Images.homeHeaderLeftActive
              : Images.homeHeaderLeftInActive
              : Images.homeHeaderLeftInActive
          } //User Images.homeHeaderLeftActive for the selected image
        />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        style={{padding: 15 }}
        disabled={navigation.state.params ? navigation.state.params.disableChatAction : false}
        onPress={() => {
          navigation.state.params.chatAction();
        }}
        activeOpacity={1}
        onPressIn={() => navigation.state.params.headerRightActionPressIn()}
        onPressOut={() => navigation.state.params.headerRightActionPressOut()}
      >
        <View>
          <ImageBackground
            style={[ HomeStyle.chatIcon]}
            source={
              navigation.state.params ? navigation.state.params.chatActive
                ? Images.chatIconActive
                : Images.send_New
                : Images.send_New
            }
          >
            {navigation.state.params && navigation.state.params.notificationCount !== 0 && (
              <Text style={HomeStyle.chatCount}>
                {navigation.state.params.notificationCount}
              </Text>
            )}
          </ImageBackground>
        </View>
      </TouchableOpacity>
    )
  });
}

const mapStateToProps = ({ authReducer,nav }) => {
  const { userData, loading, token } = authReducer;
  return { userData, loading, token, nav };
};
export default connect(mapStateToProps, {
  updateLoading,
  setUserData,
  setToken,
  setPermissions
})(Home);
