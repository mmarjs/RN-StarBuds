import React, { Component } from "react";
import {
  Alert,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  DeviceEventEmitter,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import ActionSheet from 'react-native-actionsheet';
import { connect } from "react-redux";
import { CachedImage } from "react-native-cached-image";
import { NavigationActions } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";
import Swiper from "react-native-swiper";
import Moment from "moment";
import ReadMore from "react-native-read-more-text";
import Share from 'react-native-share';
import FeedVideo from "../../components/FeedVideo/FeedVideo";
import ShareActionSheet from './../../components/ActionSheet/ShareActionSheet';
import SharePostModal from './../SharePostModal/SharePostModal';
import { PostOptions } from "./../../components";
import { Colors, Images, Styles, Metrics } from "../../theme";
import { HomeStyle } from "../Home/HomeStyle";
import { PostDetailsStyle } from "./PostDetailsStyle";
import { alert, toastMessage } from "./../../services/AlertsService";
import { apiCall } from './../../services/AuthService';
import { calculateTimeDuration, navigateTo } from "./../../services/CommonFunctions";
import { deletePost } from '../../services/PotsActions';
import ParsedText from 'react-native-parsed-text';

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const backAction = NavigationActions.back({
  key: null
});
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 3;
let options = ['Cancel', 'Edit', 'Share', 'Delete'];

class PostDetails extends Component {
  constructor(props) {
    super(props);
    this.changeCommentCount = this.changeCommentCount.bind(this);
    this.state = {
      post: this.props.navigation.state.params.post,
      user: this.props.navigation.state.params.user,
      likePress: false,
      commentPress: false,
      sharePress: false,
      savePress: false,
      postArray: [this.props.navigation.state.params.post],
      modalVisible: false,
      shareInChatPost: {},
      updatingPost: false,
    };
    console.log("this.props.navigation.state.params.post,", this.props.navigation.state.params.post)
  }

  changeCommentCount(value) {
    value.currentPost.commentCount = value.commentCount;
    const newPostArray = this.state.postArray;
    newPostArray[0].totalComments = value.commentCount;
    this.setState({ postArray: newPostArray });
  }

  componentWillMount() {
    DeviceEventEmitter.addListener('refreshPostDetail', newPost => {
      console.log('newPost = ', newPost)
      this.setState({ post: newPost[0], postArray: newPost });
    });
  }
  
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

  handlePressOfPostOptions = (i) => {
    switch (i) {
      case 1:
        // navigate to edit post page
        navigateTo(this.props.navigation, 'EditPost', { post: this.state.post })
        break;
      case 2:
        // share post
        let shareOptions = {
          title: 'Post by '+this.props.userData.username,
          message: this.state.post.caption,
          url:  this.state.post.medias[0].mediaUrl, //
          subject: 'Post by '+this.props.userData.username, //  for email
          type: this.state.post.medias[0].mediaUrl.substring(this.state.post.medias[0].mediaUrl.lastIndexOf('.')+1, this.state.post.medias[0].mediaUrl.length)
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
                  deletePost(this.state.post, this.props.userData, this.props.token).then(response => {
                    DeviceEventEmitter.emit('refreshProfileFeed', {});
                    DeviceEventEmitter.emit('refreshHomeFeed', {});
                    this.setState({ updatingPost: false }, () => {
                      this.props.navigation.dispatch(backAction);
                    })
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

  openShareOptions = (post) => {
    this.setState({
      postIdURL: `${Metrics.serverUrl}post/${post._id}`,
      postIdForSharing: post._id,
      postByUserId: post.user
    },()=>{
      this.actionSheet.show();
    });
  }
  
  likePost(index, post) {
    const newPostArray = this.state.postArray;
    newPostArray[0].likedOrNot = true;
    newPostArray[0].totalLikes = newPostArray[0].totalLikes + 1;
    this.setState({ postArray: newPostArray });
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
          // if(this.navigation.state.params.from == 'Home') {
            // DeviceEventEmitter.emit('refreshHomeFeed', {});
          // } else if(this.navigation.state.params.from == 'Profile') {
            // DeviceEventEmitter.emit('refreshProfileFeed', {});
          // } else {
            DeviceEventEmitter.emit('refreshHomeFeed', {});
            DeviceEventEmitter.emit('refreshProfileFeed', {});
          // }
        } else {
        }
      })
      .catch(error => {
      });
  }

  disLikePost(index, post) {
    const newPostArray = this.state.postArray;
    newPostArray[0].likedOrNot = false;
    newPostArray[0].totalLikes = newPostArray[0].totalLikes - 1;
    this.setState({ postArray: newPostArray });
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
          // if(this.navigation.state.params.from == 'Home') {
            // DeviceEventEmitter.emit('refreshHomeFeed', {});
          // } else if(this.navigation.state.params.from == 'Profile') {
            // DeviceEventEmitter.emit('refreshProfileFeed', {});
          // } else {
            DeviceEventEmitter.emit('refreshHomeFeed', {});
            DeviceEventEmitter.emit('refreshProfileFeed', {});
          // }
        } else {
        }
      })
      .catch(error => {
      });
  }

  commentOnPost(post, from) {
    navigateTo(this.props.navigation, 'AddComment', {
      post: this.state.postArray[0],
      currentUser: this.props.userData,
      postOwner: this.state.user,
      from: this.props.navigation.state.params.from,
      changeCommentCount: this.changeCommentCount,
      commentCount: post.totalComments._id,
      openKeyboard: from
    });
  }

  gotoProfile = (post) => {
    if (this.state.user._id === this.props.userData._id) {
      // Navigate to Profile
      navigateTo(this.props.navigation, 'Profile');
    } else {
      navigateTo(this.props.navigation, 'OtherProfile', {
        profileId: this.state.user._id,
        profileName: this.state.user.name,
        from: this.props.navigation.state.params.from
      });
    }
  }

  sharePost(post) {

    //this.props.updateLoading(true);
    this.setState({
      shareInChatPost: post
    },()=>{
      //this.searchUsersFromApi();
      this.toggleModalVisibility();
    });
  }

  savePost(post) {
    const newPostArray = this.state.postArray;
    newPostArray[0].postSavedOrNot = true;
    this.setState({ postArray: newPostArray });
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
          DeviceEventEmitter.emit('refreshHomeFeed', {});
          DeviceEventEmitter.emit('refreshSaved', {});
          DeviceEventEmitter.emit('refreshActivity', {});
        }
      })
      .catch(error => {
        // add code to show that the post is saved
      });
  }

  unsavePost(post) {
    const newPostArray = this.state.postArray;
    newPostArray[0].postSavedOrNot = false;
    this.setState({ postArray: newPostArray });
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
          DeviceEventEmitter.emit('refreshHomeFeed', {});
          DeviceEventEmitter.emit('refreshSaved', {});
          DeviceEventEmitter.emit('refreshActivity', {});
        }
      })
      .catch(error => {
        // add code to show that the post is saved
      });
  }

  updateTag(postIndex) {
    const newPostArray = this.state.postArray;
    newPostArray[0].showTag = !newPostArray[0].showTag;
    this.setState({ postArray: newPostArray });
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

  renderImage(imageData, resizeMode, post, imageIndex) {
    // console.log('post.taggedPeoples = ', post.taggedPeoples)
    if (post.taggedPeoples.length > 0) {
      return (
        <View style={HomeStyle.imageInList} key={imageData._id}>
          <CachedImage
            key={imageData._id}
            style={HomeStyle.imageInList}
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
            <TouchableWithoutFeedback onPress={() => {this.updateTag(postIndex)}}>
              {this.renderImage(imageData, "contain", post, index )}
            </TouchableWithoutFeedback>
          </View>
        );
      } else {
        return(this.renderVideo(imageData));
      }
    });
  }

  renderMedias(post, postIndex) {
    if (post.medias.length > 1) {
      return (
        <Swiper
          style={{ height: screenHeight/1.8+(18) }}
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
        return <TouchableWithoutFeedback onPress={() => {
              this.updateTag(postIndex);
            }}>
            {this.renderImage(post.medias[0], "contain", post)}
          </TouchableWithoutFeedback>;
      } else {
        return this.renderVideo(post.medias[0]);
      }
    }
  }
  handleHashTag = (hashTag) => {
    // console.log('hashTag', hashTag)
    navigateTo(this.props.navigation, 'SearchHashTags', {
      hashTagName: hashTag.replace("#", ""),
    })
  }
  toggleModalVisibility = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  }

  getActionSheetRef = ref => {
    this.actionSheet = ref;
  };

  getPostOptionsRef = ref => {
    this.postOptionActionSheet = ref;
  };

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

  renderListItem = ({ item, index }) => {
    return (item && (<View style={HomeStyle.imageInListContainer} key={item._id}>
      <View style={HomeStyle.imageTopDetails}>
        <View style={Styles.profileImageForPostContainerInFeed}>
          <CachedImage
            style={Styles.profileImageForPostInFeed}
            source={{ uri: this.state.user.profileImageUrl }}
            defaultSource={Images.defaultUser}
            fallbackSource={Images.defaultUser}
            activityIndicatorProps={{ display: "none", opacity: 0 }}
          />
        </View>
        <View style={Styles.listItemTitleInFeed}>
          <TouchableOpacity activeOpacity={1} onPress={() => this.gotoProfile(item)}>
            <View>
              <Text style={Styles.listItemTitleUsernameInFeed}>
                {this.state.user.username}
              </Text>
            </View>
          </TouchableOpacity>
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
            this.props.userData._id == this.state.user._id ? 
            this.postOptionActionSheet.show() :
            this.openShareOptions(item)
          }}
          style={Styles.threeHorizontalDotsContainerInFeed}
        >
          {!this.state.updatingPost && (
            <Image
              source={Images.threeHorizontalDots}
              style={Styles.threeHorizontalDotsInFeed}
            />
          )}
          {this.state.updatingPost && (
            <ActivityIndicator
              animating
              size="large"
              style={{ flex: 1 }}
              color={Colors.primary}
            />
          )}
        </TouchableOpacity>
      </View>
      {/* <View style={HomeStyle.imageBottomDetailsTop}> */}
      {this.renderMedias(item, index)}
      {/* </View> */}
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
                style={Styles.feedActionCommentContainer}
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
                onPress={() => this.savePost(item._id)}
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
                onPress={() => this.unsavePost(item._id)}
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
              {this.state.user.username + " "}{" "}
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
          )}
          {item.caption.length >= 100 && (
            <View style={Styles.bigCaptionWrapperInFeed}>
              <ReadMore
                numberOfLines={3}
                renderTruncatedFooter={this._renderTruncatedFooter}
                renderRevealedFooter={this._renderRevealedFooter}
              >
                <Text style={Styles.usernameBeforeCaptionInFeed}>
                  {this.state.user.username + " "}{" "}
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
        <View  style={Styles.durationTextContainerInFeed}>
          <Icon name="schedule" color={Styles.durationTextInFeed.color} />
          <Text style={Styles.durationTextInFeed}>
            {calculateTimeDuration(item.createdAt)}{" "}
            {calculateTimeDuration(item.createdAt) != "now" ? "ago" : ""}
          </Text>
        </View>
      </View>
    </View>))
  };
  
  _keyExtractor = (item, index) => item._id;

  render() {
    return (
      <View style={PostDetailsStyle.container}>
        <FlatList
          data={this.state.postArray}
          numColumns={1}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderListItem}
          extraData={this.state}
        />
        <ShareActionSheet {...this.props} postByUserId={this.state.postByUserId} getActionSheetRef={this.getActionSheetRef} postIdURL={this.state.postIdURL} postIdForSharing={this.state.postIdForSharing}  />
        <SharePostModal {...this.props} post={this.state.shareInChatPost}  toggleModalVisibility={this.toggleModalVisibility} modalVisible={this.state.modalVisible} />
        {this.props.userData._id == this.state.user._id && (
          <ActionSheet
            ref={this.getPostOptionsRef}
            options={options}
            cancelButtonIndex={CANCEL_INDEX}
            destructiveButtonIndex={DESTRUCTIVE_INDEX}
            onPress={this.handlePressOfPostOptions}
          />
          )
        }
      </View>
    );
  }
}

PostDetails.navigationOptions = ({ navigation }) => ({
  title: "POST",
  headerTitleStyle: Styles.headerTitleStyle,
  headerStyle: Styles.headerStyle,
  headerLeft: (
    <TouchableOpacity
      onPress={() => {
        navigation.dispatch(backAction);
      }}
      style={Styles.headerLeftContainer}
    >
      <Image source={Images.backButton} style={[Styles.headerLeftImage, { height: 15, width: 8 }]} />
    </TouchableOpacity>
  ),
  headerRight: <Text />,
  tabBarVisible: false
});

const mapStateToProps = ({ authReducer }) => {
  const { userData, loading, token } = authReducer;
  return { userData, loading, token };
};
export default connect(mapStateToProps, {})(PostDetails);
