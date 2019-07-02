import React, { Component } from "react";
import {
  Text,
  Image,
  ImageBackground,
  View,
  NetInfo,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
  FlatList,
  ScrollView,
  DeviceEventEmitter,
  RefreshControl,
  TouchableWithoutFeedback
} from "react-native";
import { connect } from "react-redux";
import ReadMore from "react-native-read-more-text";
import Swiper from "react-native-swiper";
import { CachedImage } from "react-native-cached-image";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Button, NoNetworkView } from "./../../components";
import FeedVideo from "../../components/FeedVideo/FeedVideo";
import { OtherProfileStyle } from "./OtherProfileStyle";
import { ProfileStyle } from '../Profile/ProfileStyle';
import { Images, Colors, Metrics, Styles } from "./../../theme";
import { setUserData, setToken, updateLoading, updateCurrentScreen } from "../../actions";
import { apiCall } from "./../../services/AuthService";
import { NavigationActions } from "react-navigation";
import { calculateTimeDuration, navigateTo } from "./../../services/CommonFunctions";
import { storeUser, deleteUser } from "./../../services/StorageService";
import _ from 'lodash';
import firebase from 'react-native-firebase';
import SharePostModal from './../SharePostModal/SharePostModal';
import ParsedText from 'react-native-parsed-text';
import { isIPhoneX } from '../../services/CommonFunctions';

const uuidv1 = require('uuid/v1');

const backAction = NavigationActions.back({
  key: null
});
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

class OtherProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableGotoChat: true,
      gridSelected: true,
      listSelected: false,
      taggedSelected: false,
      favouriteSelected: false,
      viewRef: null,
      profileImageLoaded: false,
      profileImageUrl: Images.defaultUser,
      userProfile: "",
      refreshing: false,
      refreshingPage: false,
      showNoPosts: 0, // 0 for loading, 1 for no posts, 2 for posts
      pageNo: 0,
      nextPageAvailable: false,
      posts: [],
      noOfColumns: 3,
      endThreshold: 0.1,
      commentPostIndex: 0,
      followedOrNot: false,
      modalVisible: false,
      shareInChatPost: {},
      isConnected: true,
      marginTopConstant : 10,

    };
    this.conversationRef = firebase.firestore().collection("conversations");
    DeviceEventEmitter.addListener("backToProfile", e => {
      this.setState({
        disableGotoChat: false
      });
    });
    DeviceEventEmitter.addListener("updateFollowerCount", e => {
      const currentUserDetails = this.state.userDetail;
      if (e.add) {
        currentUserDetails.followerCount = currentUserDetails.followerCount + 1;
        this.setState({ userDetail: currentUserDetails });
      } else {
        currentUserDetails.followerCount = currentUserDetails.followerCount - 1;
        this.setState({ userDetail: currentUserDetails });
      }
    });
  }

  getOtherUserData(){
    if (this.from == 'mention') {
      this.apiName = 'users/searchByUsername';
      this.apiData = {
        username: this.profileName,
        pageNo: this.state.page
      };
      this.apiHeaders = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
        userid: this.props.userData._id
      };
    } else {
      this.apiName = 'users/getUserDetails';
      this.apiData = {
        userId: this.profileID,
        pageNo: this.state.page
      };
      this.apiHeaders = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
        userid: this.props.userData._id
      };
    }
  }

  async getUserDetailsFromApi() {
    await this.getOtherUserData();
    // this.setState({ refreshing: true });
    return new Promise((resolve, reject) => {
      apiCall(this.apiName, this.apiData, this.apiHeaders)
        .then(response => {
          constUserdetails = response.result.userDetails;
          this.setState({
            userDetail: response.result.userDetails,
            profileImageUrl: { uri: response.result.userDetails.profileImageUrl },
            // posts: response.result.userDetails.posts,
            nextPageAvailable: response.result.nextPageAvailable,
            refreshing: false
          });
          let tempPosts = new Array(),
            postObj;
          if (response.result.userDetails.posts.length > 1) {
            for (
              let i = 0;
              i < response.result.userDetails.posts.length - 1;
              i++
            ) {
              postObj = response.result.userDetails.posts[i];
              postObj.showTag = false;
              tempPosts.push(postObj);
            }
          } else if (response.result.userDetails.posts.length == 1) {
            postObj = response.result.userDetails.posts[0];
            postObj.showTag = false;
            tempPosts.push(postObj);
          }
          this.setState(
            {
              posts: tempPosts,
              refreshing: false
            },
            () => {
              if (response.result.userDetails.posts.length == 0) {
                this.setState({
                  showNoPosts: 1
                });
              } else {
                this.setState({
                  showNoPosts: 2
                });
              }
              resolve(response.result);
            }
          );
        })
        .catch(error => {
          this.setState({ refreshing: false }, () => {
            alert(
              "Failed",
              error.message ? error.message : "Something went wrong!"
            );
          });
          reject(error);
        });
    });
    
  }

  getPosts(page) {
    const data = {
      userId: this.props.userData._id,
      pageNo: page
    };
    data.userId = this.profileID;
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    this.setState({ refreshing: true });
    apiCall("users/getUserDetails", data, headers)
      .then(response => {
        if (page == 0) {
          this.setState({ posts: response.result.posts });
          if (this.state.posts.length > 0) {
            this.setState({ showNoPosts: 2, refreshing: false });
          } else {
            this.setState({ showNoPosts: 1, refreshing: false });
          }
        } else {
          tempData = this.state.posts.concat(response.result.posts);
          this.setState({ posts: tempData, refreshing: false, showNoPosts: 2 });
        }
        if (response.result.nextPageAvailable) {
          this.setState({ nextPageAvailable: true, allowScroll: true });
        } else {
          this.setState({ nextPageAvailable: false, allowScroll: false });
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
    //data.userId = this.profileID;
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/likePost", data, headers)
      .then(response => {
        if (response.status) {
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
    //data.userId = this.profileID;
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/dislikePost", data, headers)
      .then(response => {
        if (response.status) {
        } else {
        }
      })
      .catch(error => {});
  }

  commentOnPost(post, from, index) {
    this.setState({ commentPostIndex: index });
    navigateTo(this.props.navigation, 'AddComment', {
      post: post,
      currentUser: this.props.userData,
      postOwner: this.state.userDetail,
      from: this.props.navigation.state.params.from,
      commentCount: post.totalComments,
      changeCommentCount: this.changeCommentCount,
      openKeyboard: from
    });
  }

  toggleModalVisibility = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  };

  sharePost(post) {
    let userDetail = _.cloneDeep(this.state.userDetail);
    delete userDetail.posts;
    post.userDetail = [userDetail];

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
    //data.user = this.profileID;

    apiCall("posts/savePost", data, headers)
      .then(response => {
        if (response.status) {
          // add code to show that the post is saved
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
    //data.user = this.profileID;
    apiCall("posts/unsavePost", data, headers)
      .then(response => {
        if (response.status) {
          // add code to show that the post is saved
        }
      })
      .catch(error => {
        // add code to show that the post is saved
      });
  }

  handlePageRefresh = () => {
    this.setState(
      {
        pageNo: 0,
        refreshingPage: true
      },
      () => {
        this.getPosts(this.state.pageNo);
      }
    );
  };

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
    this.props.updateCurrentScreen('Profile');
    this.profileID = this.props.navigation.state.params.profileId;
    this.from = this.props.navigation.state.params.from;
    this.profileName = this.props.navigation.state.params.profileName;
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      isConnected ? this.getUserDetails() : this.setState({ isConnected: false, isLoading: false });
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
        this.getUserDetails();
      })
    } else {
      this.setState({ isConnected: false })
    }
  };
  

  getUserDetails() {
    const data = {
      userId: this.props.userData._id,
      followerId: this.profileID
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("users/checkUserFollowStatus", data, headers).then(response => {
      //alert(response.result.followedOrNot);
      this.setState({
        followedOrNot: response.result.followedOrNot
      });
      this.getUserDetailsFromApi().then(() => {
        this.setState({
          disableGotoChat: false
        });
      });
    });
  }

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

  componentDidUpdate(prevProps, prevState) {}

  addChat = () => {
    let otherUserId = this.state.userDetail._id;
    let { _id } = this.props.userData;
    this.props.updateLoading(true);

    this.conversationRef
      .where(`collaborators.${_id}._id`, "==", _id)
      .where(`collaborators.${otherUserId}._id`, "==", otherUserId)
      .get()
      .then(querySnapShot => {
        let doesConversationExist = querySnapShot.docs.length ? true : false;
        if (!doesConversationExist) {
          var conversationObj = {};
          conversationObj.chatID = uuidv1();
          conversationObj.timestamp = new Date().getTime();
          conversationObj.collaborators = {
            [_id]: Object.assign({}, this.props.userData, { initiator: true }),
            [otherUserId]: Object.assign({}, this.state.userDetail, {
              readStatus: true
            })
          };
          this.conversationRef
            .add(conversationObj)
            .then(docRef => {
              //navigate to chat message screen with conversationObj.chatID and other params
              this.setState(
                {
                  chatID: conversationObj.chatID,
                  chatName: this.state.userDetail.name,
                  chatUserId: otherUserId
                },
                () => {
                  this.gotoChat();
                }
              );
              //this.props.updateLoading(false);
            })
            .catch(error => {});
        } else {
          let chatID = "";
          querySnapShot.forEach(conversationDoc => {
            let conversationData = conversationDoc.data();
            chatID = conversationData.chatID;
          });

          this.setState(
            {
              chatID: chatID,
              chatName: this.state.userDetail.name,
              chatUserId: otherUserId
            },
            () => {
              this.gotoChat();
            }
          );
          //this.props.updateLoading(false);

          // this.props.navigation.navigate("ChatMessages", {
          //   chatID: chatID,
          //   chatName: item.name,
          //   chatUserId: item._id
          // });
          //navigate to
        }
      });
    //make an entry in conversations collection if entry not already there
  };
  gotoChat = () => {
    const { chatID, chatName, chatUserId } = this.state;
    this.setState({ disableGotoChat: true });
    setTimeout(() => {
      this.setState({ disableGotoChat: false });
    }, 2000);
    navigateTo(this.props.navigation, 'ChatMessages', {
      chatID: chatID,
      chatName: chatName,
      chatUserId: chatUserId,
      from: this.props.navigation.state.params.from ? this.props.navigation.state.params.from : 'OtherProfile'
    });
  };

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

  openTaggedImages() {
    navigateTo(
      this.props.navigation,
      'PhotosOfOtherUser',
      Object.assign({}, this.props.navigation.state.params, {
        isOtherUser: true,
        profileId: this.state.userDetail._id,
        from: this.props.navigation.state.params.from
      })
    );
  }

  followUnfollow = () => {
    const { followedOrNot } = this.state;
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };

    const {
      findBudId,
      findBudIndex,
      followBud
    } = this.props.navigation.state.params;
    // just in case the user comes from screen which already has follow/unfollow API use that API just so that follow status reflects in that screen on back action
    if (
      findBudId &&
      (findBudIndex !== null || findBudIndex !== undefined) &&
      typeof followBud === "function"
    ) {
      followBud(findBudIndex, findBudId);
      this.setState({
        followedOrNot: !followedOrNot
      });
      return;
    }

    apiCall(
      "users/followUser",
      {
        userId: this.props.userData._id,
        followers: [this.profileID],
        followOrNot: !followedOrNot
      },
      headers
    )
      .then(response => {
        this.setState({
          followedOrNot: !followedOrNot
        });
        //DeviceEventEmitter.emit("updateFollowerCount", { add: false });
      })
      .catch(error => {});
  };

  onPageRefresh() {
    this.setState({ refreshing: true });
    this.getUserDetailsFromApi()
      .then(success => {
        this.setState({ refreshing: false });
      })
      .catch(error => {
        this.setState({ refreshing: false });
      });
  }

  changeCommentCount = value => {
    value.currentPost.totalComments = value.commentCount;
    const newArray = [...this.state.posts];
    newArray[this.state.commentPostIndex].totalComments = value.commentCount;
    this.setState({ posts: newArray });
  };

  openPostDetails(currentPost) {
    let userDetail = _.cloneDeep(this.state.userDetail);
    delete userDetail.posts;
    currentPost.userDetail = [userDetail];
    navigateTo(this.props.navigation, 'PostDetails', {
      post: currentPost,
      user: this.state.userDetail,
      from: this.props.navigation.state.params.from
    });
  }

  renderTitleBar() {
    return (
      <View style={ProfileStyle.titlebarContainer}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.dispatch(backAction);
          }}
          activeOpacity={0.5}
          style={Styles.headerLeftContainer}
        >
          <Image
            source={Images.backButton}
            style={[{ height: 15, width: 8, marginRight: 17 }, Styles.headerLeftImage]}
          />
        </TouchableOpacity>
        {this.state.userDetail && (
          <Text style={OtherProfileStyle.userName}>
            {this.state.userDetail.username}
          </Text>
        )}
        <TouchableOpacity
          // onPress={() => this.followUnfollow()}
          activeOpacity={0.5}
          onPress={() => {}}
          style={Styles.headerRightContainer}
        >
        <Image
              source={Images.threeHorizontalDots}
              style={Styles.threeHorizontalDotsInFeed}
              />
          {/* {this.state.followedOrNot ? (
            <Image
              source={Images.following}
              style={[{ height: 25, width: 25 }, Styles.headerRightImage]}
            />
          ) : (
            <Image
              source={Images.notFollowing}
              style={[{ height: 25, width: 25 }, Styles.headerRightImage]}
            />
          )} */}
        </TouchableOpacity>
      </View>
    );
  }

  renderProfileImageUrl() {
    if (this.state.profileImageUrl != Images.defaultUser) {
      return this.state.profileImageUrl;
    } else if (this.props.userData && this.props.userData.profileImageUrl) {
      let uri =
        this.props.userData.profileImageUrl +
        "?random_number=" +
        new Date().getTime();
      return { uri: uri };
    } else {
      return Images.defaultUser;
    }
  }

  renderProfileImage() {
    return (
      <View style={[OtherProfileStyle.profileImageContainer,{flex: 1, flexDirection: 'row'}]}>
       <TouchableOpacity
          onPress={() => {this.followUnfollow()}}
          activeOpacity={0.5}
          style={{marginTop : 18,marginRight : screenWidth * 0.50,width : 50, height : 50,justifyContent: 'flex-start',alignItems : 'center', alignSelf : 'center'}}
        >
          {this.state.followedOrNot ? (
            <Image
              source={Images.Requested}
              style={{width : 50, height : 50}}
            />
          ) : (
            <Image
              source={Images.add_req}
              style={{width : 50, height : 50}}
            />
          )}
        </TouchableOpacity>


        <View  style={OtherProfileStyle.profileImageBg}>
            <CachedImage
            style={OtherProfileStyle.profileImage}
            source={this.state.profileImageUrl}
            defaultSource={Images.defaultUser}
            fallbackSource={Images.defaultUser}
            activityIndicatorProps={{ display: "none", opacity: 0 }}
            />
          </View>

        {/* <CachedImage
          style={OtherProfileStyle.profileImage}
          source={this.state.profileImageUrl}
          defaultSource={Images.defaultUser}
          fallbackSource={Images.defaultUser}
          activityIndicatorProps={{ display: "none", opacity: 0 }}
        /> */}

        <TouchableOpacity
          onPress={() => {            this.addChat()          }}
          activeOpacity={0.5}
          style={{marginTop : 18,width : 50, height : 50,justifyContent: 'flex-end',alignItems : 'center', alignSelf : 'center'}}
        >
          <Image
            source={Images.message_N}
            style={{width : 50, height : 50}}
          />
        </TouchableOpacity>
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
          style={{ backgroundColor: "#6ece1a", height: 30, borderRadius:5}}
        >
          <Text style={ProfileStyle.findBudsText}>FIND BUDS</Text>
        </Button>
      </View>
    );
  }

  renderName() {
    return (
      <View style={OtherProfileStyle.nameContainer}>
        <Text style={OtherProfileStyle.name}>
          {this.state.userDetail && this.state.userDetail.name}
        </Text>
      </View>
    );
  }

  renderChatMessage() {
    return (
      <View style={OtherProfileStyle.findBudsContainer}>
        <Text style={OtherProfileStyle.chatMessageText}>MESSAGE</Text>
      </View>
    );
  }

  renderProfileStatistic() {
    return (
      <View style={OtherProfileStyle.profileStatisticContainer}>
        {/* <View style={OtherProfileStyle.profileStatistic}> */}
        <View style={OtherProfileStyle.profileStatisticItemContainer}>
          <Text style={OtherProfileStyle.profileStatisticNumber}>
            {this.state.userDetail && this.state.userDetail.postCount}
          </Text>
          <Text style={OtherProfileStyle.profileStatisticText}>posts</Text>
        </View>
        <View style={OtherProfileStyle.profileStatisticItemContainer}>
          <Text style={OtherProfileStyle.profileStatisticNumber}>
            {this.state.userDetail && this.state.userDetail.followingCount}
          </Text>
          <Text style={OtherProfileStyle.profileStatisticText}>buddies</Text>
        </View>
        <View style={OtherProfileStyle.profileStatisticItemContainer}>
          <Text style={OtherProfileStyle.profileStatisticNumber}>
            {this.state.userDetail && this.state.userDetail.followerCount}
          </Text>
          <Text style={OtherProfileStyle.profileStatisticText}>followers</Text>
        </View>
        {/* </View> */}
      </View>
    );
  }

  renderProfileMenu() {
    return (
      <View style={OtherProfileStyle.profileMenuContainer}>
        {/* <View style={OtherProfileStyle.profileMenu}> */}
        <TouchableHighlight
          onPress={() => this.openImagesInGrid()}
          underlayColor={"transparent"}
        >
          <View
            style={{
              width: screenWidth / 4,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image
              source={
                this.state.gridSelected ? Images.gridIconGreen : Images.gridIcon
              }
              style={OtherProfileStyle.profileMenuIcon}
            />
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.openImagesInList()}
          underlayColor={"transparent"}
        >
          <View
            style={{
              width: screenWidth / 4,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image
              source={
                this.state.listSelected
                  ? Images.listIconActive
                  : Images.listIcon
              }
              style={OtherProfileStyle.profileMenuIcon}
            />
          </View>
        </TouchableHighlight>
        {/*
          <TouchableHighlight
            onPress={() => this.openSavedImages()}
            onHideUnderlay={() => {
              this.setState({ taggedSelected: false });
            }}
            onShowUnderlay={() => {
              this.setState({ taggedSelected: true });
            }}
            underlayColor={"transparent"}
          >
            <View
              style={{
                width: screenWidth / 4,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                source={
                  this.state.taggedSelected
                    ? Images.saveIconGreen
                    : Images.saveIcon
                }
                style={OtherProfileStyle.profileMenuIconTagged}
              />
            </View>
          </TouchableHighlight>
          */}
        <TouchableHighlight
          onPress={() => this.openTaggedImages()}
          onPressIn={() => this.setState({ favouriteSelected: true })}
          onPressOut={() => this.setState({ favouriteSelected: false })}
          underlayColor={"transparent"}
        >
          <View
            style={{
              width: screenWidth / 4,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image
              source={
                this.state.favouriteSelected
                  ? Images.tagPeopleIconActive
                  : Images.otherProfileTagPeopleIcon
              }
              style={OtherProfileStyle.profileMenuIconSaved}
            />
          </View>
        </TouchableHighlight>
        {/* </View> */}
      </View>
    );
  }

  _keyExtractor = (item, index) => item._id;

  renderFooter = () => {
    if (!this.state.refreshing) return null;
    return (
      <ActivityIndicator
        animating
        size="large"
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white"
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
            <View
              style={{
                zIndex: 10,
                flex: 1,
                top: ProfileStyle.imageInGrid.height - 22,
                alignSelf: "flex-end"
              }}
            >
              <Image source={Images.videoIcon} style={ProfileStyle.videoIcon} />
            </View>
            <CachedImage
              style={ProfileStyle.imageInGrid}
              source={{ uri: item.medias[0].thumbnail }}
              defaultSource={Images.placeHolder}
              fallbackSource={Images.placeHolder}
              activityIndicatorProps={{ display: "none", opacity: 0 }}
            />
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
              <View
                style={{
                  zIndex: 10,
                  flex: 1,
                  top: ProfileStyle.imageInGrid.height - 25,
                  alignSelf: "flex-end"
                }}
              >
                <Image
                  source={Images.multipleImages}
                  style={ProfileStyle.multipleImagesIcon}
                />
              </View>
              <CachedImage
                style={ProfileStyle.imageInGrid}
                source={{ uri: item.medias[0].thumbnail }}
                defaultSource={Images.placeHolder}
                activityIndicatorProps={{ display: "none", opacity: 0 }}
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
          {post.showTag &&
            this.renderTag(
              imageData,
              post.taggedPeoples,
              imageIndex ? imageIndex : 0
            )}
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
        videoContainerStyle={ProfileStyle.videoContainer}
        videoWidth={screenWidth - 1}
        videoHeight={screenHeight / 2 + screenHeight / 12}
        ContainerStyles={ProfileStyle}
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
          style={{ height: screenWidth + 12, backgroundColor: "white" }}
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
              source={{ uri: this.state.userDetail.thumbnail }}
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
          {/* <TouchableOpacity
            onPress={() => {
              this.openPostDetails(item);
            }}
            style={ProfileStyle.threeHorizontalDotsContainer}
          >
            <Image
              source={Images.threeHorizontalDots}
              style={ProfileStyle.threeHorizontalDots}
            />
          </TouchableOpacity> */}
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
                  source={Images.forward_N}
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
          {/* <Text style={Styles.usernameBeforeCaptionInFeed}>
            {this.props.userData.username + " "}
          </Text>
          {item.caption != "" && (
            <Text style={Styles.captionTextInFeed}>{item.caption}</Text>
          )} */}
          {item.caption.length < 100 && <Text style={Styles.usernameBeforeCaptionInFeed} numberOfLines={5} ellipsizeMode={'tail'}>
            {this.props.userData.username + " "}{" "}
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
                childrenProps={{ allowFontScaling: false }}
              >
                {item.caption}
              </ParsedText>
            )}
          </Text>}
          {item.caption.length >= 100 && <View style={Styles.bigCaptionWrapperInFeed}>
            <ReadMore
              numberOfLines={3}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
              onReady={this._handleTextReady}
            >
              <Text style={Styles.usernameBeforeCaptionInFeed} numberOfLines={5} ellipsizeMode={'tail'}>
                {this.props.userData.username + " "}{" "}
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
        source={this.state.profileImageUrl}
        style={OtherProfileStyle.userImage}
        blurRadius={Platform.OS === "ios" ? 25 : 10}
      >
        <ImageBackground
          source={Images.blurred}
          style={OtherProfileStyle.blurredOverlay}
        >
          <View style={OtherProfileStyle.blurredOverlay}>
            {this.renderTitleBar()}
            {this.renderProfileImage()}
            {this.renderName()}
            {this.renderChatMessage()}
            {this.renderProfileStatistic()}
            {this.renderProfileMenu()}
          </View>
        </ImageBackground>
      </ImageBackground>
    );
  };

  render() {
    return (
      <ImageBackground
        // source={Images.profileBg}
        style={{ flex: 1, marginTop: Platform.OS === "ios" ? -15 : 0 }}
      >
        <ScrollView
        contentContainerStyle={{ marginTop: this.state.marginTopConstant }}
         onScroll={({nativeEvent}) => {
          this.setState({ marginTopConstant: isIPhoneX() ? -35 : -10 });

        }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onPageRefresh.bind(this)}
            />
          }
        >
          {this.state.isConnected && this.renderHeader()}
          {this.state.isConnected && this.state.userDetail &&
            this.state.gridSelected && (
              <FlatList
                data={this.state.posts}
                numColumns={3}
                keyExtractor={this._keyExtractor}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={1}
                scrollEnabled={false}
                renderItem={this.renderGridItem}
                initialNumToRender={15}
              />
            )}
          {this.state.isConnected && this.state.userDetail &&
            this.state.listSelected && (
              <FlatList
                data={this.state.posts}
                numColumns={1}
                keyExtractor={this._keyExtractor}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={1}
                renderItem={this.renderListItem}
                extraData={this.state}
              />
            )}
          {this.state.showNoPosts == 0 && (
            <ActivityIndicator
              animating
              size="large"
              color={Colors.primary}
              style={{ paddingTop: 100 }}
            />
          )}
          {this.state.showNoPosts == 1 && (
            <View style={OtherProfileStyle.noPostsContainer}>
              {/* <Image
                source={Images.shareContentPlus}
                style={OtherProfileStyle.noPostImage}
              />
              <Text style={OtherProfileStyle.shareContentText}>Share Content</Text> */}
              <Text style={OtherProfileStyle.shareContentText2}>
                When user shares photos and videos, they appear here in the
                profile.
              </Text>
              {/* <Text style={OtherProfileStyle.shareText}>SHARE</Text> */}
            </View>
          )}
          <SharePostModal
            {...this.props}
            modalVisible={this.state.modalVisible}
            post={this.state.shareInChatPost}
            toggleModalVisibility={this.toggleModalVisibility}
          />
          {!this.state.isConnected && <NoNetworkView containerStyle={ProfileStyle.noNetworkContainer}/>}
        </ScrollView>
      </ImageBackground>
    );
  }
}

OtherProfile.navigationOptions = ({ navigation }) => ({
  title: navigation.state.params.profileName,
	headerTitleStyle: {
		fontSize: 16,
		letterSpacing: 0.8,
		color: Colors.white,
		fontFamily: 'ProximaNova-Regular'
	},
	headerStyle: {
    backgroundColor: 'black'
  },
	headerLeft: (
    <TouchableOpacity
      onPress={() => {
        navigation.dispatch(backAction);
      }}
      style={{ padding: 20 }}
    >
      <Image source={Images.backButton} style={{ height: 22.3, width: 12.3 }} />
    </TouchableOpacity>
  ),
  header: null,
  tabBarVisible: false,
});

const mapStateToProps = ({ authReducer }) => {
  const { userData, loading, token } = authReducer;
  return { userData, loading, token };
};
export default connect(mapStateToProps, {
  updateLoading,
  setUserData,
  setToken,
  updateCurrentScreen
})(OtherProfile);
