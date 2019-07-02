import React, { Component } from "react";
import {
  Alert,
  Text,
  Image,
  ImageBackground,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  NetInfo,
  Platform,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Linking,
  ScrollView,
  DeviceEventEmitter,
  RefreshControl,
  Modal
} from "react-native";
import ActionSheet from 'react-native-actionsheet';
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import Swiper from "react-native-swiper";
import { CachedImage } from "react-native-cached-image";
import ImageRotate from 'react-native-image-rotate';
import ReadMore from "react-native-read-more-text";
import Share from 'react-native-share';
import ImageCrop from 'react-native-image-crop';
import { Button, NoNetworkView, PostOptions } from "./../../components";
import FeedVideo from "../../components/FeedVideo/FeedVideo";
import { ProfileStyle } from "./ProfileStyle";
import { Images, Colors, Metrics, Styles } from "./../../theme";
import { setUserData, setToken, updateLoading } from "../../actions";
import { apiCall, facebookLogin } from "./../../services/AuthService";
import {
  calculateTimeDuration,
  generateThumbnailName,
  navigateTo
} from "./../../services/CommonFunctions";
import { deletePost, editPost } from '../../services/PotsActions';
import { storeUser, deleteUser, saveData } from "./../../services/StorageService";
import { alert } from "./../../services/AlertsService";
import _ from "lodash";
import SharePostModal from './../SharePostModal/SharePostModal';
import ParsedText from 'react-native-parsed-text';

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
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 3;
let options = ['Cancel', 'Edit', 'Share', 'Delete'];
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

class Profile extends Component {
  constructor(props) {
    super(props);
    this.changeCommentCount = this.changeCommentCount.bind(this);
    this.updateFollowerCount = this.updateFollowerCount.bind(this);
    this.state = {
      disableFindbuds: false,
      gridSelected: true,
      listSelected: false,
      savedSelected: false,
      taggedSelected: false,
      viewRef: null,
      profileImageLoaded: false,
      userProfile: "",
      refreshing: false,
      showNoPosts: 0, // 0 for loading, 1 for no posts, 2 for posts
      isLoading: true,
      pageNo: 0,
      nextPageAvailable: false,
      posts: [],
      posts: null,
      noOfColumns: 3,
      endThreshold: 0.1,
      currentPost: null,
      isUploadingProfileImage: false,
      modalVisible: false,
      shareInChatPost: {},
      headerLeftSelected: false,
      headerRightSelected: false,
      isConnected: true,
      updatingPost: false,
      isImageEditorOpened: false,
      imageToBeCropped: ''
    };
    DeviceEventEmitter.addListener("backToProfile", e => {
      this.setState({
        disableFindbuds: false
      });
    });
    // following code updates following count from Activity page
    DeviceEventEmitter.addListener("addInFollowingCount", e => {
      const oldUserdetail = this.state.userDetail;
      oldUserdetail.followingCount = oldUserdetail.followingCount >= 0 ? oldUserdetail.followingCount + 1 : 0;
      this.setState({ userDetail: oldUserdetail });
    });
    DeviceEventEmitter.addListener("removeFromFollowingCount", e => {
      const oldUserdetail = this.state.userDetail;
      oldUserdetail.followingCount = oldUserdetail.followingCount >= 0 ? oldUserdetail.followingCount - 1 : 0;
      this.setState({ userDetail: oldUserdetail });
    });

    DeviceEventEmitter.addListener("refreshProfileFeed", e => {
      this.getUserDetailsFromApi();
    });
    DeviceEventEmitter.addListener('scrollProfilePageToTop', () => {
      this.flatListRef.scrollToOffset({x: 0, y: 0, animated: true})
    })
  }

  changeCommentCount(value) {
    value.currentPost.commentCount = value.commentCount;
    const newPosts = this.state.posts;
    newPosts[this.state.currentPost].totalComments = value.commentCount;
    this.setState({ posts: newPosts });
  }

  updateFollowerCount(value) {
    const currentUserDetails = this.state.userDetail;
    currentUserDetails.followingCount = currentUserDetails.followingCount + value.totalFollowerCount;
    this.setState({ userDetail: currentUserDetails });
  }

  getPostOptionsRef = ref => {
    this.postOptionActionSheet = ref;
  };

  handlePressOfPostOptions = (i) => {
    switch (i) {
      case 1:
        // navigate to edit post page
        navigateTo(this.props.navigation, 'EditPost', { post: this.state.currentPost })
        break;
      case 2:
        // share post
        let shareOptions = {
          title: 'Post by '+this.props.userData.username,
          message: this.state.currentPost.caption,
          url:  this.state.currentPost.medias[0].mediaUrl, //
          subject: 'Post by '+this.props.userData.username, //  for email
          type: this.state.currentPost.medias[0].mediaUrl.substring(this.state.currentPost.medias[0].mediaUrl.lastIndexOf('.')+1, this.state.currentPost.medias[0].mediaUrl.length)
        };
        Share.open(shareOptions);
        break;
      case 3:
        Alert.alert(
          'Confirm Deletion',
          'Are you sure you want to delete this post?',
          [ 
            {text: 'Cancel', style: 'cancel'},
            { text: "OK", onPress: () => 
              {
                this.setState({ updatingPost: true }, () => {
                  deletePost(this.state.currentPost, this.props.userData, this.props.token).then(response => {
                    DeviceEventEmitter.emit('refreshProfileFeed', {});
                    setTimeout(() => {
                      this.setState({ updatingPost: false })
                    }, 500);
                  }).catch(error => {
                    this.setState({ updatingPost: false }, () => {
                      if(error == 'no network') {
                        alert('No Internet Connection', 'Please check your internet connection.');
                      } else {
                        alert('Error', 'Failed to delete your post!');
                      }
                    })
                  });
                })
              }
            }
          ],
          { cancelable: false }
        );
        break;
      default:
        break;
    }
  }

  getUserDetailsFromApi() {
    return new Promise((resolve, reject) => {
      const data = {
        userId: this.props.userData._id,
        pageNo: this.state.page
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
        userid: this.props.userData._id
      };
      apiCall("users/getUserDetails", data, headers)
        .then(response => {
          constUserdetails = response.result.userDetails;
          this.setState({
            userDetail: response.result.userDetails,
            nextPageAvailable: response.result.nextPageAvailable,
          });
          let tempPosts = new Array(), postObj, i = 0;
          if (response.result.userDetails.posts.length === 0) {
            this.setState({
              isLoading: false,
              refreshing: false
            });
          }
          if (response.result.userDetails.posts.length === 1) {
            postObj = response.result.userDetails.posts[0];
            postObj.showTag = false;
            tempPosts.push(postObj);
            this.setState({
              posts: tempPosts,
            }, () => {
              this.setState({
                isLoading: false,
                refreshing: false
              });
            });
          } else if(response.result.userDetails.posts.length > 1) {
            while (i <= response.result.userDetails.posts.length-1) {
              postObj = response.result.userDetails.posts[i];
              postObj.showTag = false;
              tempPosts.push(postObj);
              if(i == response.result.userDetails.posts.length-1) {
                this.setState({
                  posts: tempPosts,
                }, () => {
                  this.setState({
                    isLoading: false,
                    refreshing: false
                  });
                });
                break;
              } else {
                i++;
              }
            }
          }
          resolve(response.result);
        })
        .catch(error => {
          this.setState({
            isLoading: false,
            isRefreshing: false
          }, () => {
            if (
              error.message ==
              'You are not authorized. Token required to access the API.'
            ) {
              alert(
                'Session Expired',
                'Please login again. Your session has expired.'
              );
              deleteUser('user');
              this.props.setUserData('');
              this.props.setToken('');
              navigateTo(this.props.navigation, 'GetStart');
            } else if(error == 'no network') {
              this.setState({ isConnected: false })
            }
          });
          reject(error);
        })
    })
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
    this.setState({ refreshing: true });
    apiCall("users/getUserDetails", data, headers)
      .then(response => {
        let tempPosts = new Array(),
          postObj,
          i = 0;
        if (response.result.userDetails.posts.length == 0) {
          this.setState({ showNoPosts: 1 });
        } else if (response.result.userDetails.posts.length === 1) {
          postObj = response.result.userDetails.posts[0];
          postObj.showTag = false;
          tempPosts.push(postObj);
          this.setState(
            {
              showNoPosts: 2,
              posts: tempPosts,
              refreshing: false
            });
        } else if (response.result.userDetails.posts.length > 1) {
          while (i <= response.result.userDetails.posts.length - 1) {
            postObj = response.result.userDetails.posts[i];
            postObj.showTag = false;
            tempPosts.push(postObj);
            if (i == response.result.userDetails.posts.length - 1) {
              this.setState(
                {
                  showNoPosts: 2
                },
                () => {
                  this.setState({
                    posts: tempPosts,
                    refreshing: false
                  });
                }
              );
              break;
            } else {
              i++;
            }
          }
        }
      })
      .catch(error => {
        this.setState({
          refreshing: false
        });
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
          DeviceEventEmitter.emit('refreshHomeFeed', {});
        } else {
        }
      })
      .catch(error => {
      });
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
          DeviceEventEmitter.emit('refreshHomeFeed', {});
        } else {
        }
      })
      .catch(error => {
      });
  }

  commentOnPost(post, from, index) {
    this.setState({ currentPost: index });
    navigateTo(this.props.navigation, 'AddComment', {
      post: post,
      currentUser: this.props.userData,
      postOwner: this.props.userData,
      from: 'Profile',
      changeCommentCount: this.changeCommentCount,
      commentCount: post.totalComments,
      openKeyboard: from
    });
  }

  toggleModalVisibility = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  }

  sharePost(post) {
    let userDetail = _.cloneDeep(this.state.userDetail);
    delete userDetail.posts;
    post.userDetail = [userDetail];

    this.setState({
      shareInChatPost: post
    },()=>{
      this.toggleModalVisibility();
    });
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
  }

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
          DeviceEventEmitter.emit('refreshHomeFeed', {});
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
          DeviceEventEmitter.emit('refreshHomeFeed', {});
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
        this.getPosts(this.state.pageNo);
      }
    );
  };

  handleLoadMore = () => {
    if (this.state.nextPageAvailable && !this.state.refreshing) {
      this.setState(
        {
          pageNo: this.state.pageNo + 1
        },
        () => {
          this.getPosts(this.state.pageNo);
        }
      );
    }
  };

  componentWillMount() {
    saveData('currentScreen', "Profile");
  }

  // shouldComponentUpdate(nextProps) {
  //   if(this.props.navigation.state.params.tumbnail === nextProps.userData.thumbnail) {
  //     return false;
  //   }
  //   else {
  //     return true;
  //   }
  // }

  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      isConnected ? this.getUserDetailsFromApi() : this.setState({ isConnected: false, isLoading: false });
    });
    NetInfo.isConnected.addEventListener('change', this._handleConnectionChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('change', this._handleConnectionChange);
  }

  _handleConnectionChange = (isConnected) => {
    if(isConnected) {
      this.setState({ isConnected: true }, () => {
        this.setState({ isLoading: true });
        this.getUserDetailsFromApi();
      })
    } else {
      this.setState({ isConnected: false })
    }
  };
  
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{color: Colors.primary, marginTop: 5}} onPress={handlePress}>
        Read more
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{color: Colors.primary, marginTop: 5}} onPress={handlePress}>
        Show less
      </Text>
    );
  }

  findBuds() {
    this.setState({ disableFindbuds: true });
    setTimeout(() => {
      this.setState({ disableFindbuds: false });
    }, 2000);
    navigateTo(this.props.navigation, 'FindBuds', {
      profileImageUrl: this.state.userDetail ? this.state.userDetail.profileImageUrl : this.props.userData.profileImageUrl,
      updateFollowerCount: this.updateFollowerCount,
    });
  }

  openImagesInGrid() {
    if (this.state.listSelected) {
      this.setState({
        listSelected: false
      });
    }
    this.setState({
      gridSelected: true,
      noOfColumns: 3,
      endThreshold: 0.1
    });
  }

  openImagesInList() {
    if (this.state.gridSelected) {
      this.setState({
        gridSelected: false
      });
    }
    this.setState({
      noOfColumns: 1,
      endThreshold: 0.5,
      listSelected: true
    });
  }

  openSavedImages() {
    navigateTo(this.props.navigation, 'FavouriteSaved', this.props.navigation.state.params)
  }

  openTaggedImages() {
    navigateTo(this.props.navigation, 'PhotosOfUser', {
      profileId: this.props.userData._id,
      from: 'Profile'
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
            });
            setTimeout(() => {
              alert("Failed", "Something went wrong!");
            });
          }
        })
        .catch(error => {
          this.setState({ isUploadingProfileImage: false });
          setTimeout(() => {
          // alert("Failed", "Something went wrong!");
          });
        });
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
    if(this.state.isConnected) {
      ImagePicker.showImagePicker(pickerOptions, response => {
        if (response.didCancel) {
          this.setState({ isUploadingProfileImage: false });
        } else if (response.error) {
          this.setState({ isUploadingProfileImage: false });
        } else {
          if(response.originalRotation != 0) {
            this.rotateImage(response.uri).then(rotatedImage =>  {
              this.setState({
                isImageEditorOpened: true,
                imageToBeCropped: rotatedImage
              });
            }).catch(error => {
              this.setState({
                isImageEditorOpened: true,
                imageToBeCropped: response.uri
              });
            })
          } else {
            this.setState({
              isImageEditorOpened: true,
              imageToBeCropped: response.uri
            });
          }
        }
      });
    } else {
      alert('No Internet Connection', 'Please check your internet connection.');
    }
  }

  //this function will open website
  openWebPage() {
    Linking.openURL("https://www.leafly.com/");
  }

  //this function will openSettings user from application
  openSettings() {
    if(this.state.userDetail) {
      navigateTo(this.props.navigation, 'Settings', {
        notificationFlag: this.state.userDetail.notificationFlag
      });
    } else {
      navigateTo(this.props.navigation, 'Settings', {
        notificationFlag: true
      });
    }
  }

  onPageRefresh() {
    if(!this.state.isLoading) {
      this.setState({ refreshing: true }, () => {
        this.getUserDetailsFromApi()
        .then(success => {
          this.setState({ refreshing: false });
        })
        .catch(error => {
          this.setState({ refreshing: false });
        });
      });
    }
  }

  openPostDetails(currentPost) {
    let userDetail = _.cloneDeep(this.state.userDetail);
    delete userDetail.posts;
    currentPost.userDetail = [userDetail];
    navigateTo(this.props.navigation, 'PostDetails', {
      post: currentPost,
      user: this.props.userData,
      from: 'Profile'
    });
  }

  renderTitleBar() {
    return (
      <View style={ProfileStyle.titlebarContainer}>
        {/* <View style={ProfileStyle.titlebar}> */}
          <TouchableOpacity
            onPress={() => {this.openWebPage()}}
            activeOpacity={0.5}
            style={Styles.headerLeftContainer}
            onPressIn={() => {this.setState({ headerLeftSelected: true });}}
            onPressOut={() => {this.setState({ headerLeftSelected: false });}}
          >
            <Image
              source={this.state.headerLeftSelected ? Images.homeHeaderLeftActive : Images.homeHeaderLeftInActive}
              style={[ProfileStyle.titlebarIconLeft, Styles.headerRightImage]}
            />
          </TouchableOpacity>
         
          {this.state.userDetail && (
           <View style={ProfileStyle.titlebarCenterView}>
             <Text style={ProfileStyle.userName}>
               {this.state.userDetail.username}
              </Text>
            </View>
          )}
   
          <TouchableOpacity
            onPress={() => {this.openSettings()}}
            activeOpacity={0.5}
            style={Styles.headerRightContainer}
          >
            <Image
              source={Images.settingsIcon}
              style={[ProfileStyle.titlebarIconRight, Styles.headerLeftImage]}
            />
          </TouchableOpacity>
        {/* </View> */}
      </View>
    );
  }

  renderProfileImage() {
    return (
      <View style={ProfileStyle.profileImageContainer}>
        <CachedImage
          style={ProfileStyle.profileImage}
          source={{ uri: this.props.userData.thumbnail }}
          defaultSource={Images.defaultUser}
          fallbackSource={Images.defaultUser}
          activityIndicatorProps={{ display: "none", opacity: 0 }}
        />
        {!this.state.isUploadingProfileImage && (
          <TouchableWithoutFeedback onPress={() => this.addProfilePicture()}>
            <Image
              source={Images.addCircle}
              style={ProfileStyle.addCircleIcon}
            />
          </TouchableWithoutFeedback>
        )}
        {this.state.isUploadingProfileImage && (<ActivityIndicator
          animating
          size="small"
          style={ProfileStyle.profileImageIndicator}
          color={Colors.primary}
        />)}
      </View>
    );
  }

  renderName() {
    return (
      <View style={ProfileStyle.nameContainer}>
        <Text style={ProfileStyle.name}>
          {this.state.userDetail && this.state.userDetail.name}
        </Text>
      </View>
    );
  }

  renderFindBuds() {
    return (
      <View style={ProfileStyle.findBudsContainer}>
        <Button
          disabled={this.state.disableFindbuds}
          onPress={() => {
            this.findBuds();
          }}
          style={{ backgroundColor: 'rgb(126,211,33)',borderRadius:5,  height: 30 }}
        >
          <Text style={ProfileStyle.findBudsText}>FIND BUDS</Text>
        </Button>
      </View>
    );
  }

  renderProfileStatistic() {
    return (
      <View style={ProfileStyle.profileStatisticContainer}>
        {/* <View style={ProfileStyle.profileStatistic}> */}
          <View style={ProfileStyle.profileStatisticItemContainer}>
            <Text style={ProfileStyle.profileStatisticNumber}>
              {this.state.userDetail && this.state.userDetail.postCount}
            </Text>
            <Text style={ProfileStyle.profileStatisticText}>posts</Text>
          </View>
          <View style={ProfileStyle.profileStatisticItemContainer}>
            <Text style={ProfileStyle.profileStatisticNumber}>
              {this.state.userDetail && this.state.userDetail.followingCount}
            </Text>
            <Text style={ProfileStyle.profileStatisticText}>buddies</Text>
          </View>
          <View style={ProfileStyle.profileStatisticItemContainer}>
            <Text style={ProfileStyle.profileStatisticNumber}>
              {this.state.userDetail && this.state.userDetail.followerCount}
            </Text>
            <Text style={ProfileStyle.profileStatisticText}>followers</Text>
          </View>
        {/* </View> */}
      </View>
    );
  }

  renderProfileMenu() {
    return (
      <View style={ProfileStyle.profileMenuContainer}>
          <TouchableHighlight
            onPress={() => this.openImagesInGrid()}
            underlayColor={"transparent"}
            style={ProfileStyle.menuItemcontainer}
          >
            <Image
              source={
                this.state.gridSelected
                  ? Images.gridIconGreen
                  : Images.gridIcon
              }
              style={ProfileStyle.profileMenuIcon}
            />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => this.openImagesInList()}
            underlayColor={"transparent"}
            style={ProfileStyle.menuItemcontainer}
          >
            <Image
              source={
                this.state.listSelected
                  ? Images.listIconActive
                  : Images.listIcon
              }
              style={ProfileStyle.profileMenuIcon}
            />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => this.openSavedImages()}
            onHideUnderlay={() => {
              this.setState({ savedSelected: false });
            }}
            onShowUnderlay={() => {
              this.setState({ savedSelected: true });
            }}
            underlayColor={"transparent"}
            style={ProfileStyle.menuItemcontainer}
          >
            <Image
              source={
                this.state.savedSelected
                  ? Images.saveIconGreen
                  : Images.saveIcon
              }
              style={ProfileStyle.profileMenuIconSaved}
            />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => this.openTaggedImages()}
            onHideUnderlay={() => {
              this.setState({ taggedSelected: false });
            }}
            onShowUnderlay={() => {
              this.setState({ taggedSelected: true });
            }}
            underlayColor={"transparent"}
            style={ProfileStyle.menuItemcontainer}
          >
            <Image
              source={
                this.state.taggedSelected
                  ? Images.tagPeopleIconActive
                  : Images.tagPeopleIcon
              }
              style={ProfileStyle.profileMenuIconTagged}
            />
          </TouchableHighlight>
      </View>
    );
  }

  _keyExtractor = (item, index) => item._id;

  renderFooter = () => {
    if (!this.state.refreshing) return null;
    return (
      <ActivityIndicator
        animating
        size="small"
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.black
        }}
        color={Colors.primary}
      />
    );
  };

  renderGridItem = ({ item }) => {
    if (item.medias[0].mediaType == 2) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.openPostDetails(item);
          }}
          activeOpacity={0.9}
        >
          <View style={ProfileStyle.imageInGrid} key={item._id}>
            <CachedImage
              style={ProfileStyle.imageInGrid}
              source={{ uri: item.medias[0].thumbnail }}
              defaultSource={Images.placeHolder}
              fallbackSource={Images.placeHolder}
              activityIndicatorProps={{ display: "none", opacity: 0 }}
            />
            <Image source={Images.videoIcon} style={ProfileStyle.videoIcon} />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            this.openPostDetails(item);
          }}
        >
          {item.medias.length > 1 && (
            <View style={ProfileStyle.imageInGrid} key={item._id}>
              <CachedImage
                style={ProfileStyle.imageInGrid}
                source={{ uri: item.medias[0].thumbnail }}
                defaultSource={Images.placeHolder}
                activityIndicatorProps={{ display: "none", opacity: 0 }}
              />
              <Image
                source={Images.multipleImages}
                style={ProfileStyle.multipleImagesIcon}
              />
            </View>
          )}
          {item.medias.length == 1 && (
            <CachedImage
              style={ProfileStyle.imageInGrid}
              source={{ uri: item.medias[0].thumbnail }}
              defaultSource={Images.placeHolder}
              activityIndicatorProps={{ display: "none", opacity: 0 }}
            />
          )}
        </TouchableOpacity>
      );
    }
  };
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
        return(
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
        )
      }
    });
  }

  updateTag(postIndex) {
    const newPosts = [...this.state.posts];
    newPosts[postIndex].showTag = !newPosts[postIndex].showTag;
    this.setState({ posts: newPosts });
  }
  
  renderImage(imageData, resizeMode, post, imageIndex) {
    if (post.taggedPeoples.length > 0) {
      return (
        <View style={ProfileStyle.imageInList} key={imageData._id}>
          <CachedImage
            key={imageData._id}
            style={ProfileStyle.imageInList}
            source={{ uri: imageData.mediaUrl }}
            defaultSource={Images.placeHolder}
            fallbackSource={Images.placeHolder}
            activityIndicatorProps={{ display: "none", opacity: 0 }}
            resizeMode={"cover"}
          />
          {post.showTag && this.renderTag(imageData, post.taggedPeoples, imageIndex ? imageIndex : 0)}
        </View>
      );
    } else {
        return (
          <CachedImage
            key={imageData._id}
            style={ProfileStyle.imageInList}
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
        videoContainerStyle={ProfileStyle.videoContainer}
        videoWidth={screenWidth - 1}
        videoHeight={screenHeight / 2 + screenHeight / 12}
        ContainerStyles={ProfileStyle}
        imageData={imageData}
      />
    );
  }


  handleMentionsUser = (user) => {
    if (user.replace('@', '').trim() === this.props.userData.username) {
      // Navigate to Profile
      console.log('handleMentionsUser if', user)
      navigateTo(this.props.navigation, 'Profile');
    } else {
      console.log('handleMentionsUser else', user)
      
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

  renderImageInsideSwiper(post, postIndex) {
    return post.medias.map((imageData, index) => {
      if (imageData.mediaType == 1) {
        return (
          <View
            style={{ height: screenWidth, width: screenWidth }}
            key={imageData._id}
          >
            <TouchableWithoutFeedback onPress={() => {this.updateTag(postIndex)}}>
              {this.renderImage(imageData, "contain", post, index)}
            </TouchableWithoutFeedback>
          </View>
        );
      } else {
        return this.renderVideo(imageData);
      }
    });
  }

  renderMedias(post, postIndex) {
    if (post.medias.length > 1) {
      return (
        <Swiper
          style={{ height: screenWidth + 12, backgroundColor: "#0a0a0a" }}
          dot={<View style={Styles.swiperDot} />}
          activeDot={<View style={Styles.activeSwiperDot} />}
          paginationStyle={Styles.swiperPagination}
          loop={false}
        >
          {this.renderImageInsideSwiper(post, postIndex)}
        </Swiper>
      );
    } else {
      if (post.medias[0].mediaType == 1) {
        return (
          <TouchableWithoutFeedback onPress={() => {this.updateTag(postIndex)}}>
            <View style={{ backgroundColor: "rgb(27, 27, 27)" }}>
              {this.renderImage(post.medias[0], "contain", post)}
            </View>
          </TouchableWithoutFeedback>
        );
      } else {
        return (
          <View style={{ backgroundColor: "rgb(27, 27, 27)" }}>
            {this.renderVideo(post.medias[0])}
          </View>
        );
      }
    }
  }

  renderListItem = ({ item, index }) => {
    return (
      <View style={ProfileStyle.imageInListContainer} key={item._id}>
        <View style={ProfileStyle.imageInListDetail}>
          <View style={Styles.profileImageForPostContainerInFeed}>
            <CachedImage
              style={Styles.profileImageForPostInFeed}
              source={{ uri: this.props.userData.thumbnail }}
              defaultSource={Images.defaultUser}
              fallbackSource={Images.defaultUser}
              activityIndicatorProps={{ display: "none", opacity: 0 }}
            />
          </View>
          <View style={Styles.listItemTitleInFeed}>
            <Text style={Styles.listItemTitleUsernameInFeed}>
              {this.state.userDetail.username}
            </Text>
            {item.location.title ? item.location.title != "" : item.location.description != "" && (
              <Text
                numberOfLines={2}
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
            onPress={() => {
              this.setState({ currentPost: item }, () => this.postOptionActionSheet.show());
            }}
            style={Styles.threeHorizontalDotsContainerInFeed}
          >
            {!this.state.updatingPost && (
              <Image
                source={Images.threeHorizontalDots}
                style={Styles.threeHorizontalDotsInFeed}
              />
            )}
            {this.state.updatingPost && this.state.currentPost._id == item._id && (
              <ActivityIndicator
                animating
                size="large"
                style={{ flex: 1 }}
                color={Colors.primary}
              />
            )}
          </TouchableOpacity>
        </View>
        {this.renderMedias(item, index)}
        <View style={ProfileStyle.imageBottomDetailsBottom}>
          <View style={Styles.feedActionsRowContainer}>
            <View style={Styles.feedActionLeftContainer}>
              {!item.likedOrNot && (
                <TouchableHighlight
                  onPress={() => this.likePost(index, item)}
                  underlayColor={"transparent"}
                  style={Styles.feedActionLikeContainer}
                >
                  <Image
                    style={Styles.likeIcon}
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
                  style={Styles.feedActionCommentContainer}
                >
                  <Image
                    style={Styles.commentIcon}
                    source={Images.feedCommentInactive}
                  />
                </TouchableHighlight>
              )}
              <TouchableHighlight
                onPress={() => this.sharePost(item)}
                underlayColor={"transparent"}
                style={Styles.feedActionShareContainer}
              >
                <Image
                  style={Styles.shareIcon}
                  source={Images.feedShareInactive}
                />
              </TouchableHighlight>
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
                    source={Images.feedSaveInactive}
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
                    style={Styles.saveIcon}
                    source={Images.saveIconGreen}
                  />
                </TouchableHighlight>
              )}
            </View>
          </View>
          {item.caption != undefined && item.caption.length < 100 && <Text style={Styles.usernameBeforeCaptionInFeed} numberOfLines={5} ellipsizeMode={'tail'}>
            {this.props.userData.username + " "}{" "}
            {item.caption != "" && (
              <ParsedText
                style={Styles.captionTextInFeed}
                parse={
                  [
                    { pattern: /@([a-zA-Z0-9.,_]+)(?:^|[ ])/, style: { color: Colors.primary }, onPress: this.handleMentionsUser },
                    { pattern: /#([a-zA-Z0-9.,_]+)/, style: { color: Colors.primary }, onPress: this.handleHashTag },
                  ]
                }
                childrenProps={{ allowFontScaling: false }}
              >
                {item.caption}
              </ParsedText>
            )}
          </Text>}
          {item.caption != undefined && item.caption.length >= 100 && <View style={Styles.bigCaptionWrapperInFeed}>
            <ReadMore
              numberOfLines={3}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
              onReady={this._handleTextReady}
            >
              <Text style={Styles.usernameBeforeCaptionInFeed} numberOfLines={5} ellipsizeMode={'tail'}>
                {this.props.userData.username + " "}{" "}
                {item.caption != "" && (
                  <ParsedText
                    style={Styles.captionTextInFeed}
                    parse={
                      [
                        { pattern: /@([a-zA-Z0-9.,_]+)(?:^|[ ])/, style: { color: Colors.primary }, onPress: this.handleMentionsUser },
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
          </View>}
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
          {item.commentFlag &&
            item.totalComments == 0 && (
              <Text style={Styles.commentTextInFeed}>No comments</Text>
            )}
          <View  style={Styles.durationTextContainerInFeed}>
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

  renderHeader = () => {
    return (
      <ImageBackground
        source={{ uri: this.props.userData.profileImageUrl }}
        style={ProfileStyle.userImage}
        blurRadius={Platform.OS === "ios" ? 25 : 10}
      >
        <ImageBackground
          source={Images.blurred}
          style={ProfileStyle.blurredOverlay}
        >
          <View style={ProfileStyle.blurredOverlay}>
            {this.renderTitleBar()}
            {this.renderProfileImage()}
            {this.renderName()}
            {this.renderFindBuds()}
            {this.renderProfileStatistic()}
            {this.renderProfileMenu()}
          </View>
        </ImageBackground>
      </ImageBackground>
    );
  };

  renderFlatListItem = (itemObj) => {
    if(this.state.isConnected) {
      if(this.state.gridSelected){
        return this.renderGridItem(itemObj);
      } else {
        return this.renderListItem(itemObj);
      }
    }
  }

  renderEmptyPosts = () => {
    if(this.state.isLoading) {
      return (
        <ActivityIndicator
          animating
          size="large"
          style={ProfileStyle.noNetworkContainer}
          color={Colors.primary}
        />
      )
    } else {
      return (
        <View style={ProfileStyle.noPostsContainer}> 
          <TouchableOpacity
            onPress={() =>
              navigateTo(this.props.navigation, 'AddPhotoModal')
            }
          >
            <Image
              source={Images.shareContentPlus}
              style={ProfileStyle.noPostImage}
            />
          </TouchableOpacity>
  
          <Text style={ProfileStyle.shareContentText}>SHARE CONTENT</Text>
          <Text style={ProfileStyle.shareContentText2}>
            When you share photos and videos, they appear here in your
            profile.
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigateTo(this.props.navigation, 'AddPhotoModal')
            }
          >
            <Text style={ProfileStyle.shareText}>SHARE</Text>
          </TouchableOpacity> 
        </View>
      );
    }
  }
  
  render() {
    return (
      <ImageBackground
        source={Images.profileBg}
        style={{ flex: 1, marginTop: 0 }}
      >
        
        <FlatList
          data={this.state.posts}
          numColumns={ this.state.gridSelected ? 3 : 1}
          key = { this.state.gridSelected  ? 1 : 0 }
          keyExtractor={this._keyExtractor}
          ListFooterComponent={this.renderFooter}
          onEndReachedThreshold={1}
          renderItem={this.renderFlatListItem}
          initialNumToRender={16}
          ListHeaderComponent={this.renderHeader}
          ListEmptyComponent={this.renderEmptyPosts}
          refreshing = {this.state.refreshing}
          onRefresh={this.onPageRefresh.bind(this)}
          extraData={this.state}
          ref={ref => {
            this.flatListRef = ref;
          }}
        />
        {!this.state.isConnected && <NoNetworkView containerStyle={ProfileStyle.noNetworkContainer}/>}
        <SharePostModal
          {...this.props}
          modalVisible = {this.state.modalVisible}
          post = {this.state.shareInChatPost}
          toggleModalVisibility = {this.toggleModalVisibility}
        />
        <ActionSheet
          ref={this.getPostOptionsRef}
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this.handlePressOfPostOptions}
        />
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
    );
  }
}

Profile.navigationOptions = ({ navigation, props }) => ({
  header: null,
  tabBarIcon: ({ focused }) => {
    if (navigation.state.params.tumbnail != "") {
      if (focused) {
        return (
          <Image
            style={[ProfileStyle.iconImage, ProfileStyle.iconBorderWidth]}
            source={{ uri: navigation.state.params.tumbnail }}
            defaultSource={Images.defaultUser}
          />
        );
      }
      return (
        <Image
          style={ProfileStyle.iconImage}
          source={{ uri: navigation.state.params.tumbnail }}
          defaultSource={Images.defaultUser}
        />
      );
    } else {
      if (focused) {
        return (
          <Image
            style={[ProfileStyle.iconImage, styles.iconBorderWidth]}
            source={Images.defaultUser}
          />
        );
      }
      return (
        <Image style={ProfileStyle.iconImage} source={Images.defaultUser} />
      );
    }
  }
});

const mapStateToProps = ({ authReducer }) => {
  const { userData, loading, token } = authReducer;
  return { userData, loading, token };
};
export default connect(mapStateToProps, {
  updateLoading,
  setUserData,
  setToken
})(Profile);
