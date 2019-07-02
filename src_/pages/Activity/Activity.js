import React, { Component } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Image,
  NetInfo,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { CachedImage } from "react-native-cached-image";
import { connect } from "react-redux";
import ScalableText from 'react-native-text';
import { ActivityStyle } from "./ActivityStyle";
import { Button, NoNetworkView } from "./../../components";
import {
  apiCall,
} from "./../../services/AuthService";
import { saveData, getData, deleteUser } from "./../../services/StorageService";
import { Colors, Images, Styles } from "./../../theme";
import { getActivites } from "./../../services/AuthService";
import { alert } from "./../../services/AlertsService";
import { calculateTimeDurationShortNoSpace, navigateTo } from "./../../services/CommonFunctions";
import {
  setUserData,
  setToken,
} from '../../actions';

const screenHeight = Dimensions.get("window").height;

class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNo: 0,
      nextPageAvailable: false,
      refreshing: false,
      loadingMore: false,
      userActivity: [],
      isLoading: true,
      isConnected: true
    };
    DeviceEventEmitter.addListener("refreshActivity", e => {
      this.getUserActivity(0);
    });
  }

  followUser = (index, userId) => {
    const newArray = [...this.state.userActivity];
    if (newArray[index].followedOrNot) {
      newArray[index].followedOrNot = false;
      this.setState({ userActivity: newArray });
      saveData("userActivity", {userActivity: newArray, time: new Date()});
      DeviceEventEmitter.emit("removeFromFollowingCount", { add: false });
      apiCall(
        "users/followUser",
        {
          userId: this.props.userData._id,
          followers: [userId],
          followOrNot: false
        },
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.props.token,
          userid: this.props.userData._id
        }
      ) .then(response => {
        })
        .catch(error => {
        });
    } else {
      newArray[index].followedOrNot = true;
      this.setState({ userActivity: newArray });
      saveData("userActivity", {userActivity: newArray, time: new Date()});
      DeviceEventEmitter.emit("addInFollowingCount", { add: true });
      apiCall(
        "users/followUser",
        {
          userId: this.props.userData._id,
          followers: [userId],
          followOrNot: true
        },
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.props.token,
          userid: this.props.userData._id
        }
      )
        .then(response => {
        })
        .catch(error => {
        });
    }
  }

  getUserActivity(pageNo) {
    getActivites(this.props.userData, this.props.token, pageNo).then(response => {
      if(pageNo == 0) {
        this.setState({
          isLoading: false,
          userActivity: response.activities,
          refreshing: false,
          nextPageAvailable: response.nextPageAvailable,
          loadingMore: false
        });
      } else {
        const currentActivities = [...this.state.userActivity];
        this.setState({
          isLoading: false,
          userActivity: currentActivities.concat(response.activities),
          refreshing: false,
          nextPageAvailable: response.nextPageAvailable,
          loadingMore: false
        });
      }
    }).catch(error => {
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
          navigateTo(this.props.navigation, 'GetStart')
        } else if(error == 'no network') {
          this.setState({ isConnected: false })
        }
      });
    });
  }

  openPostDetails(item) {
    let post = item.post;
    post.likedOrNot = item.likedOrNot;
    post.postSavedOrNot = item.postSavedOrNot;
    post.totalComments = item.totalComments;
    post.totalLikes = item.totalLikes;
    let pageParams = {
      post: post,
      user: post.user, //@todo: Change this to userdetail from item.post object after api has been updated
      from: 'Activity'
    };
    navigateTo(this.props.navigation, 'PostDetails', pageParams)
  }

  openUserProfile(item,index) {
    let params = {
      profileId: item.initiatorDetails._id,
      profileName: item.initiatorDetails.name,
      from: 'Activity'
    };
    //sending in follow index and ID to reflect it back if user follows/unfollows in OtherProfile View
    if(item.notificationType === 'follow'){
      params.findBudId = item.initiatorDetails._id,
      params.findBudIndex = index,
      params.followBud = this.followUser
    }
    navigateTo(this.props.navigation, 'OtherProfile', params)
  }

  componentWillMount() {
    DeviceEventEmitter.emit("updateActivityStatus", false);
    saveData('currentScreen', "Activity");
  }

  componentDidMount () {
    NetInfo.isConnected.fetch().then(isConnected => {
      isConnected ? this.getUserActivity(this.state.pageNo) : this.setState({ isConnected: false, isLoading: false });
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
        this.getUserActivity(this.state.pageNo);
      })
    } else {
      this.setState({ isConnected: false })
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true,
        pageNo: 0
      },
      () => {
        this.getUserActivity(0);
      }
    );
  };

  handleLoadMore = () => {
    if (!this.state.loadingMore) {
      if (this.state.nextPageAvailable) {
        this.setState(
          {
            pageNo: this.state.pageNo + 1,
            loadingMore: true
          },
          () => {
            this.getUserActivity(this.state.pageNo);
          }
        );
      }
    }
  };

  _keyExtractor = (item, index) => item._id;

  renderListItem = ({ item, index }) => {
    if(item.notificationType != 'chat') {
      return (
        <View key={item._id} style={ActivityStyle.listRow}>
          <View style={ActivityStyle.listrowLeft}>
            <TouchableOpacity onPress={() => this.openUserProfile(item,index)} activeOpacity={0.9}>
              <CachedImage
                style={ActivityStyle.singleProfileImageInList}
                source={item.initiatorDetails.profileImageUrl ? {uri: item.initiatorDetails.profileImageUrl} : Images.defaultUser}
                defaultSource={Images.defaultUser}
                fallbackSource={Images.defaultUser}
                activityIndicatorProps={{ display: "none", opacity: 0 }}
              />
            </TouchableOpacity>
          </View>
          <View style={ActivityStyle.listBottomBorderContainer}>
            <View style={ActivityStyle.middle}>
              <TouchableOpacity onPress={() => this.openUserProfile(item,index)} activeOpacity={0.9}>
                <Text style={ActivityStyle.usernameInList}>{item.initiatorDetails.username}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => item.notificationType == 'follow' ? this.openUserProfile(item,index) : this.openPostDetails(item)} activeOpacity={0.9}>
                <Text style={ActivityStyle.textInList}>{item.customText} {calculateTimeDurationShortNoSpace(item.createdAt)}</Text>
              </TouchableOpacity>
            </View>
            <View style={ActivityStyle.listRowRight}>
              {item.post && (
                <TouchableOpacity onPress={() => this.openPostDetails(item)} activeOpacity={0.9}>
                  <CachedImage
                    style={ActivityStyle.postImage}
                    source={item.post.medias[0].mediaType == 1 ? {uri: item.post.medias[0].mediaUrl} : {uri: item.post.medias[0].thumbnail}}
                    defaultSource={Images.placeHolder}
                    fallbackSource={Images.placeHolder}
                    activityIndicatorProps={{ display: "none", opacity: 0 }}
                  />
                </TouchableOpacity>
              )}
              {item.notificationType == 'follow' && (
                <Button
                  onPress={() => this.followUser(index, item.initiatorDetails._id)}
                  style={
                    item.followedOrNot
                      ? ActivityStyle.followButtonFollowing
                      : ActivityStyle.followButton
                  }
                >
                  <View>
                    <ScalableText
                      style={
                        item.followedOrNot
                          ? ActivityStyle.followButtonTextFollowing
                          : ActivityStyle.followButtonText
                      }
                    >
                      {item.followedOrNot ? "Following" : "Follow"}
                    </ScalableText>
                  </View>
                </Button>
              )}
            </View>
          </View>
        </View>
      );
    }
  };


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

  renderSeparator = () => {
    return (
      <View style={ActivityStyle.sepratorStyle}/>
    );
  };

  renderEmptyActivity = () => {
    return (
      <View style={ActivityStyle.noDataContainer}>
        <Image
          source={Images.noActivity}
          style={ActivityStyle.noActivityImage} 
        />
        <Text style={ActivityStyle.noDataTextHeader}>
          YOUR ACTIVITY
        </Text>
        <Text style={ActivityStyle.noDataText}>
          When buds follow, tag and comment on your posts. It will show up here.
        </Text>
      </View>
    );
  }

  renderActivityIndicator () {
    return (
      <ActivityIndicator
        animating
        size="large"
        style={{
          flex: 1,
          height: screenHeight,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a"
        }}
        color={Colors.primary}
      />
    )
  }

  render() {
    return (
      <View style={ActivityStyle.container}>
        {this.state.isLoading && this.renderActivityIndicator()}
        {this.state.isConnected && !this.state.isLoading && (
          <FlatList
            data={this.state.userActivity}
            numColumns={1}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderListItem}
            ListFooterComponent={this.renderFooter}
            ListEmptyComponent={this.renderEmptyActivity}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            extraData={this.state}
            removeClippedSubviews={false}
            ItemSeparatorComponent={this.renderSeparator}
            onEndReachedThreshold={0.01}
            onEndReached={this.handleLoadMore}
          />
        )}
        {!this.state.isConnected && <NoNetworkView />}
      </View>
    );
  }
}

Activity.navigationOptions = ({ navigation }) => ({
  title: "ACTIVITY",
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

const mapStateToProps = ({ authReducer, userActionReducer }) => {
  const { userData, token } = authReducer;
  return { userData, token };
};

export default connect(mapStateToProps, {
  setUserData,
  setToken
})(Activity);

