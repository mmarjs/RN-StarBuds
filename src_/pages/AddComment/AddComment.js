import React, { Component } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  findNodeHandle,
  Image,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ListItem,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View
} from "react-native";
import { CachedImage } from "react-native-cached-image";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import Moment from "moment";
import ReadMore from "react-native-read-more-text";
import { calculateTimeDurationShort, navigateTo, isIPhoneX } from "./../../services/CommonFunctions";
import { Colors, Images, Styles } from "../../theme";
import { AddCommentStyle } from "./AddCommentStyle";
import { updateLoading } from "../../actions";
import { apiCall } from "./../../services/AuthService";
import { alert } from "./../../services/AlertsService";
import {
  KeyboardAwareScrollView,
  KeyboardAwareListView
} from "react-native-keyboard-aware-scrollview";
// import { platform } from "os";
const uuidv4 = require("uuid/v4");
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const backAction = NavigationActions.back({
  key: null
});

class AddComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newComment: "",
      currentPost: this.props.navigation.state.params.post,
      currentUser: this.props.navigation.state.params.currentUser,
      comments: [],
      pageNo: 0,
      nextPageAvailable: false,
      showIsPosting: false,
      showCommentDeleteOptions: false,
      selectedPost: null,
      focusKeyboard:
        this.props.navigation.state.params.openKeyboard == "comment" ? true : false,
      commentCount: this.props.navigation.state.params.post.totalComments,
      isLoading: true,
      isKeyboardOpen: this.props.navigation.state.params.openKeyboard == "comment" ? true : false
    };
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    this.setState({ isKeyboardOpen: true });
    // alert('Keyboard Shown');
  }

  _keyboardDidHide() {
    this.setState({ isKeyboardOpen: false });
  }

  static navigationOptions = ({ navigation }) => ({
    title: "COMMENTS",
    headerTitleStyle: Styles.headerTitleStyle,
    headerStyle: Styles.headerStyle,
    tabBarVisible: false,
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
          style={[Styles.headerLeftImage, { height: 15, width: 8 }]}
        />
      </TouchableOpacity>
    ),
    headerRight: <Text />
  });

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

  getComments(page, scrollTo) {
    const data = {
      post: this.props.navigation.state.params.post._id,
      pageNo: page
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/getPostComments", data, headers)
      .then(response => {
        if (response.status) {
          if (page == 0) {
            this.setState({ isLoading: false }, () => {
                this.setState({
                  comments: response.result.comments
                }, () => {
                  setTimeout(() => this.flatListRef.scrollToEnd(), 200);
                });
            });
          } else {
            this.setState({ isLoading: false }, () => {
              let tempArray = response.result.comments;
              tempArray = tempArray.concat(this.state.comments);
              this.setState({
                comments: tempArray,
                refreshing: false
              });
              if (scrollTo == "last") {
                setTimeout(() => this.flatListRef.scrollToEnd(), 200);
              } else if (scrollTo == "top") {
                setTimeout(() => this.flatListRef.scrollToIndex({
                  index: 0,
                  animated: true
                }), 200);
              }
            });            
          }
          if (response.result.nextPageAvailable) {
            this.setState({ nextPageAvailable: true });
          } else {
            this.setState({ nextPageAvailable: false });
          }
        } else {
          this.setState({ isLoading: false }, () => {
            alert("Failed", response.message);
          });
        }
      })
      .catch(error => {
        this.setState({ isLoading: false }, () => {
          if (error.message == "You are not authorized. Token required to access the API.") {
            alert("Session expired", "Please login again. Your session has expired.");
            deleteUser("user");
            this.props.setUserData("");
            this.props.setToken("");
            navigateTo(this.props.navigation, 'GetStart')
          }
        });
      });
  }

  componentWillMount() {
    // make request to get comments from api
    this.getComments(0, "last");
  }

  componentWillUnmount() {
    Keyboard.dismiss();
  }

  goToOtherProfile = user => {
    if (user._id === this.props.userData._id) {
      // Navigate to Profile
      navigateTo(this.props.navigation, 'Profile');
    } else {
      navigateTo(this.props.navigation, 'OtherProfile', {
        profileId: user._id,
        profileName: user.name,
        from: this.props.navigation.state.params.from
      })
    }
  }

  gotoProfile = comment => {
    if (comment.commentedBy._id === this.props.userData._id) {
      // Navigate to Profile
      navigateTo(this.props.navigation, 'Profile')
    } else {
      navigateTo(this.props.navigation, 'OtherProfile', {
        profileId: comment.commentedBy._id,
        profileName: comment.commentedBy.name,
        from: this.props.navigation.state.params.from
      });
    }
  };

  loadMoreComments() {
    this.setState({ isLoading: true}, () => {
      this.setState({ pageNo: this.state.pageNo + 1}, () => {
        this.getComments(this.state.pageNo, "top");
      });
    });
  }

  onChangeText(text) {
    if (text[0] == " ") {
    } else {
      this.setState({ newComment: text });
    }
  }

  submit = () => {
    if (this.state.newComment) {
      // post new comment
      const newArray = [...this.state.comments];
      let isPostingObject = {
        _id: uuidv4(),
        post: this.state.currentPost._id,
        description: this.state.newComment,
        commentedBy: this.props.userData,
        createdAt: new Date().toISOString()
      };
      newArray.push(isPostingObject);
      this.setState({
        comments: newArray,
        showIsPosting: true,
        commentCount: this.state.commentCount + 1
      });
      setTimeout(() => this.flatListRef.scrollToEnd(), 200);
      // DeviceEventEmitter.emit('commentAdded', (this.state.currentPost));
      this.setState({ newComment: "" });

      // apicall to add a post
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
        userid: this.props.userData._id
      };
      const data = {
        post: this.state.currentPost._id,
        description: this.state.newComment,
        commentedBy: this.props.userData._id
      };
      apiCall("posts/addComment", data, headers)
        .then(response => {
          if (response.status) {
            this.state.commentCount = response.result;
            DeviceEventEmitter.emit('refreshHomeFeed', {});
            DeviceEventEmitter.emit('refreshProfileFeed', {});
          }
        })
        .catch(error => {
          if (
            error.message ==
            "You are not authorized. Token required to access the API."
          ) {
            alert(
              "Session expired",
              "Please login again. Your session has expired."
            );
            deleteUser("user");
            this.props.setUserData("");
            this.props.setToken("");
            navigateTo(this.props.navigation, 'GetStart');
          } else {
            newArray.pop();
            // this.setState({ showIsPosting: false });
            // this.setState({ comments: newArray });
            // setTimeout(() => this.flatListRef.scrollToEnd(), 200);
            // alert("Failed to post your comment!");
          }
        });
    }
  };

  _keyExtractor = (item, index) => item._id;

  deletePost() {
    const newArray = [...this.state.comments];
    var index = array.indexOf(this.state.selectedPost);
    newArray.splice(index, 1);
    this.setState({ comments: newArray });
    // apicall to add a post
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    const data = {
      commentId: this.state.selectedPost._id
    };
    apiCall("posts/deleteComment", data, headers)
      .then(response => {
      })
      .catch(error => {
        if (
          error.message ==
          "You are not authorized. Token required to access the API."
        ) {
          alert("Please login again. Your session has expired.");
          deleteUser("user");
          this.props.setUserData("");
          this.props.setToken("");
          navigateTo(this.props.navigation, 'GetStart')
        }
      });
  }

  openPostAction(index, post) {
    if (post == this.state.selectedPost) {
      this.setState({ selectedPost: null });
    } else {
      this.setState({ selectedPost: post }, () => {
        if (post.commentedBy._id == this.props.userData._id) {
          this.setState({ showCommentDeleteOptions: true });
        } else {
        }
      });
    }
  }

  handleKeyboardDismiss() {
    Keyboard.dismiss();
    // this.setState({ keyboardVerticalOffset: 0 })
    setTimeout(() => this.flatListRef.scrollToEnd(), 200);
  }

  renderCommentHeader = () => {
    return (
      <TouchableWithoutFeedback onPress={() => {console.log('dissmiss keyboard');Keyboard.dismiss()} }>
        <View style={AddCommentStyle.topContainer}>
          <View style={AddCommentStyle.headerListRow}>
            <CachedImage
              style={AddCommentStyle.userImage}
              source={{
                uri: this.props.navigation.state.params.postOwner
                  .profileImageUrl
              }}
              defaultSource={Images.defaultUser}
              fallbackSource={Images.defaultUser}
              activityIndicatorProps={{ display: "none", opacity: 0 }}
            />
            <View style={AddCommentStyle.postDescriptionNoBorder}>
              <View style={AddCommentStyle.captionWrapper}>
                {this.state.currentPost.caption.length < 100 && 
                  <Text 
                    style={AddCommentStyle.username}
                    numberOfLines={3}
                    ellipsizeMode={"tail"}
                    onPress={() => this.goToOtherProfile(this.props.navigation.state.params.postOwner)}
                  >
                    {this.props.navigation.state.params.postOwner.username}{" "}
                    {this.state.currentPost.caption != "" && (
                      <Text style={AddCommentStyle.commentText}>
                        {this.state.currentPost.caption}
                      </Text>
                    )}
                  </Text>
                }
              </View>
              {this.state.currentPost.caption.length >= 100 && 
                <View style={AddCommentStyle.captionWrapper}>
                  <ReadMore
                    numberOfLines={3}
                    renderTruncatedFooter={this._renderTruncatedFooter}
                    renderRevealedFooter={this._renderRevealedFooter}
                  >
                    <Text 
                      style={AddCommentStyle.username}
                      onPress={() => this.goToOtherProfile(this.props.navigation.state.params.postOwner)}
                    >
                      {this.props.navigation.state.params.postOwner.username + " "}{" "}
                      {this.state.currentPost.caption != "" && (
                        <Text style={AddCommentStyle.commentText}>{this.state.currentPost.caption}</Text>
                      )}
                    </Text>
                  </ReadMore>
                </View>
              }
            </View>
          </View>
          {!this.state.isLoading &&
            this.state.nextPageAvailable && (
              <TouchableOpacity
                style={AddCommentStyle.loadMoreContainer}
                onPress={() => this.loadMoreComments()}
                activeOpacity={0.9}
              >
                <Text style={AddCommentStyle.loadMoreText}>
                  Load more comments
                </Text>
              </TouchableOpacity>
            )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderActivityIndicator () {
    if(this.state.isLoading) {
      return (
        <ActivityIndicator
          animating
          size="large"
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a"
          }}
          color={Colors.primary}
        />
      )
    }
    
  }

  renderListItem = ({ index, item }) => {
    const listIndex = index;
    return (
      <View
        style={
          this.state.selectedPost == item
            ? AddCommentStyle.listRowSelected
            : AddCommentStyle.listRow
        }
        key={item._id}
      >
        <CachedImage
          style={AddCommentStyle.userImage}
          source={{ uri: item.commentedBy.thumbnail }}
          defaultSource={Images.defaultUser}
          fallbackSource={Images.defaultUser}
          activityIndicatorProps={{ display: "none", opacity: 0 }}
        />
        <View style={AddCommentStyle.postDescription}>
          <View style={{ flexDirection: "row", alignItems: 'center'}}>
            <Text style={AddCommentStyle.commentText}>
              <Text style={AddCommentStyle.captionWrapper} onPress={() => this.gotoProfile(item)}>
              {item.commentedBy.username}{" "}
              </Text>
              {item.description}
            </Text>
          </View>
          {item._id != "123456" && (
            <Text style={AddCommentStyle.commentTimeText}>
              {calculateTimeDurationShort(item.createdAt)}
            </Text>
          )}
          {/* {item._id ==  '123456' && <Text style={AddCommentStyle.commentTimeText}>
              Posting your comment...
            </Text>} */}
        </View>
      </View>
    );
  };

  _scrollToInput (reactNode) {
    // Add a 'scroll' ref to your ScrollView
    // console.log(reactNode)
    // this.scroll.scrollToFocusedInput(reactNode)
  }

  renderInputComponent() {
    return (
      <View style={AddCommentStyle.inputContainer}>
        {/* Comment input field */}
        <TextInput
          placeholder="Add a comment..."
          keyboardType="email-address"
          autoFocus={this.state.focusKeyboard}
          style={AddCommentStyle.inputStyle}
          placeholderTextColor={
            "black" // focus and show the keyboard
          }
          value={this.state.newComment}
          selectionColor={Colors.primary}
          onChangeText={text => this.onChangeText(text)} //multiline={true}
          keyboardAppearance="dark"
          autoCorrect={false}
          ref={r => {
            this._textInputRef = r;
          }}
          returnKeyType="go"
          enablesReturnKeyAutomatically={true}
          underlineColorAndroid="transparent"
          onSubmitEditing={() => {this.state.newComment.length > 0 ? this.submit(): null}}
          onFocus={(event) => {
            // `bind` the function if you're using ES6 classes
            this._scrollToInput(findNodeHandle(event.target))
          }}
        />
        {/* Post button */}
        <TouchableOpacity
          style={AddCommentStyle.button}
          onPress={() => this.submit()}
          activeOpacity={this.state.newComment.length > 0 ? 0.5 : 1}
        >
          <Text
            style={
              this.state.newComment
                ? AddCommentStyle.postActive
                : AddCommentStyle.postInactive
            }
          >
            Post
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    if(Platform.OS === 'ios') {
      return (
        <KeyboardAvoidingView
          style={AddCommentStyle.mainContainer}
          behavior={"padding"}
          keyboardVerticalOffset={isIPhoneX() ? 90 : 50}
        >
          <View style={AddCommentStyle.touchableContainer}>
            {this.renderCommentHeader()}
            {this.renderActivityIndicator()}
            <FlatList
              data={this.state.comments}
              renderItem={this.renderListItem}
              // keyboardShouldPersistTaps={"always"}
              refreshing={this.state.refreshing}
              keyExtractor={this._keyExtractor}
              ref={ref => {
                this.flatListRef = ref;
              }}
              extraData={this.state}
            />
            {this.renderInputComponent()}
          </View>
        </KeyboardAvoidingView>
      );
    } else {
      return (
        <View style={AddCommentStyle.touchableContainer}>
          {this.renderCommentHeader()}
          {this.renderActivityIndicator()}
          <FlatList
            data={this.state.comments}
            // ListHeaderComponent={this.renderCommentHeader}
            renderItem={this.renderListItem}
            refreshing={this.state.refreshing}
            keyExtractor={this._keyExtractor}
            ref={ref => {
              this.flatListRef = ref;
            }}
            extraData={this.state}
            // contentContainerStyle={{marginBottom: 52.3}}
          />
            {this.renderInputComponent()}
        </View>
      );
    }
  }
}

const mapStateToProps = ({ authReducer }) => {
  const { userData, loading, token } = authReducer;
  return { userData, loading, token };
};
export default connect(mapStateToProps, { updateLoading })(AddComment);
