import React, { Component } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  NetInfo,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { CachedImage } from "react-native-cached-image";
import { connect } from "react-redux";
import ScalableText from 'react-native-text';
import { NavigationActions } from "react-navigation";
import { FindBudsStyle } from "../FindBudsStyle";
import { Button, NoNetworkView } from "./../../../components";
import {
  apiCall,
  facebookLogin,
  getFacebookFriends
} from "./../../../services/AuthService";
import { saveData, getData } from "./../../../services/StorageService";
import { Colors, Images, Styles } from "./../../../theme";
import { alert } from "./../../../services/AlertsService";
import { navigateTo } from './../../../services/CommonFunctions';

const backAction = NavigationActions.back({ key: null });
const screenHeight = Dimensions.get("window").height;

class Buds extends Component {
  constructor(props) {
    super(props);
    this.findBudsBackAction = this.findBudsBackAction.bind(this);
    addToFollowerCount = 0;
    removeFromFollowerCount = 0;
    totalFollowerCount = 0;
    this.state = {
      pageNo: 0,
      nextPageAvailable: false,
      refreshing: false,
      loadingMore: false,
      showFacebookConnect: false,
      friends: [],
      showNoFriends: false,
      socialIdsFromFacebook: [],
      processing: null,
      isLoading: true,
      isConnected: true,
    };
  }

  findFacebookFriends(friends) {
    let headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    let params = {
      userId: this.props.userData._id,
      socialIds: friends
    };
    apiCall("users/getUsersFromSocialId", params, headers)
      .then(response => {
        if (response.status) {
          if (response.message == "No users found") {
            this.setState({
              showNoFriends: true,
              showFacebookConnect: false,
              refreshing: false,
              isLoading: false
            });
          } else {
            let friendsArr = new Array(), friendObject;
            for(let i = 0; i < response.result.length; i++) {
              friendObject = response.result[i];
              friendObject.isProcessing = false;
              friendsArr.push(friendObject);
            }
            this.setState({
              friends: friendsArr,
              showPageMessage: false,
              showFacebookConnect: false,
              refreshing: false,
              isLoading: false
            });
            saveData("budsFromFacebook", this.state.friends);
          }
        } else {
          this.setState({ refreshing: false, isLoading: false });
          setTimeout(() => {
            alert("Failed", response.message);
          });
        }
      })
      .catch(error => {
        this.setState({ refreshing: false, isLoading: false });
        setTimeout(() => {
          if (error.message) {
            alert("Failed", error.message);
          } else {
            //alert("Failed", "Failed to get buddies!");
          }
        });
      });
  }

  connectToFacebook() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected) {
        this.setState({ isLoading: true }, () => {
          facebookLogin()
          .then(facebookResponse => {
            this.setState({socialIdsFromFacebook: facebookResponse.friends}, () => {
              this.findFacebookFriends(facebookResponse.friends);
            });
          })
          .catch(error => {
            this.setState({ isLoading: false });
            setTimeout(() => {
              alert("Failed", "Failed to Connect with Facebook!");
            });
          });
        });
      } else {
        this.setState({ isConnected: false, isLoading: false }, () => {
          alert('No Internet Connection', 'Please check your internet connection.')
        });
      }
    });
  }

  followUser = (index, user) => {
    if (!this.state.friends[index].isProcessing) {
      const newArray = [...this.state.friends];
      newArray[index].isProcessing = true; 
      this.setState({ friends: newArray });
      if (newArray[index].isFollowed) {
        removeFromFollowerCount = removeFromFollowerCount + 1;
        DeviceEventEmitter.emit("removeFromFollowingCount", { add: false });
        this.setState({ friends: newArray });
        apiCall(
          "users/followUser",
          {
            userId: this.props.userData._id,
            followers: [user],
            followOrNot: false
          },
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.props.token,
            userid: this.props.userData._id
          }
        )
          .then(response => {
            newArray[index].isFollowed = false;
            newArray[index].isProcessing = false;
            this.setState({ friends: newArray });
          })
          .catch(error => {
            newArray[index].isFollowed = true;
            newArray[index].isProcessing = false;
            this.setState({ friends: newArray });
            alert('Failed', 'Failed to unfollow ' + newArray[index].name);
          });
      } else {
        newArray[index].isFollowed = true;
        addToFollowerCount = addToFollowerCount + 1;
        DeviceEventEmitter.emit("addInFollowingCount", { add: true });
        this.setState({ friends: newArray });
        apiCall(
          "users/followUser",
          {
            userId: this.props.userData._id,
            followers: [user],
            followOrNot: true
          },
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.props.token,
            userid: this.props.userData._id
          }
        )
          .then(response => {
            newArray[index].isFollowed = true;
            newArray[index].isProcessing = false;
            this.setState({ friends: newArray });
          })
          .catch(error => {
            newArray[index].isFollowed = false;
            newArray[index].isProcessing = false;
            this.setState({ friends: newArray });
            alert('Failed', 'Failed to follow ' + newArray[index].name);
          });
      }
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.findFacebookFriends(this.state.socialIdsFromFacebook);
      }
    );
  };

  gotoProfile = (userDetails, index) => {
    navigateTo(this.props.navigation, 'OtherProfile', {
      profileId: userDetails._id,
      profileName: userDetails.name,
      findBudId: userDetails._id,
      findBudIndex: index,
      followBud: this.followUser,
      from: 'OtherProfile'
    });
  };

  componentWillMount() {
    this.props.navigation.setParams({
      findBudsBackAction: this.findBudsBackAction
    });
  }

  getFriendsFromFacebook () {
    // let data = this.props.userData;
    getFacebookFriends()
      .then(response => {
        this.setState({ socialIdsFromFacebook: response }, () => {
          this.findFacebookFriends(response);
        });
      })
      .catch(error => {
        this.setState({ showFacebookConnect: true, refreshing: false });
        this.setState({ isLoading: false });
      });
    // code for offline first approach
    // getData('budsFromFacebook').then(buds => {
    // 	// code to show buds
    // 	this.setState({ isLoading: false });
    //   this.setState({
    //     friends: buds,
    //     showPageMessage: false,
    //     showFacebookConnect: false
    //   });
    // }).catch(error => {
    // 	// code to get buds
    // 	getFacebookFriends()
    //     .then(response => {
    //       this.findFacebookFriends(response);
    //     })
    //     .catch(error => {
    //       this.setState({ isLoading: false });
    //     });
    // })
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      isConnected ? this.getFriendsFromFacebook() : this.setState({ isConnected: false, isLoading: false });
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
        //this.getFriendsFromFacebook();
      })
    } else {
      this.setState({ isConnected: false })
    }
  };
  
  findBudsBackAction() {
    this.props.navigation.state.params.updateFollowerCount({
      totalFollowerCount: addToFollowerCount - removeFromFollowerCount
    });
    this.props.navigation.dispatch(backAction);
  }

  renderMessage() {
    return (
      <View style={FindBudsStyle.savedTextContainer}>
       <Image style={{width : '100%', height : screenHeight * 0.80,marginTop:0}}
            source={Images.find_facebook_friend}
        />
        <View style={{marginTop : 100, alignContent : 'center', alignItems : 'center', position: 'absolute'}}>
        <Image source={Images.addFriend} style={FindBudsStyle.searchIcon} />
        <Text style={FindBudsStyle.noDataText2}>FIND FACEBOOK FRIENDS</Text>
        <Text style={FindBudsStyle.searchText}>
          You choose which friends to follow. We’ll never post to Facebook
          without your permission.
        </Text>
        <View style={FindBudsStyle.connectToFacebookContainer}>
          <Button
            onPress={() => {
              this.connectToFacebook();
            }}
            style={{ backgroundColor: Colors.secondary, height: 49.7, borderRadius:5 }}
            underlayColor={Colors.secondaryDarker}
          >
            <Text style={FindBudsStyle.connectButtonStyle}>
              CONNECT TO FACEBOOK
            </Text>
          </Button>
        </View>
      </View>
      </View>
    );
  }

  _keyExtractor = (item, index) => item._id;

  renderListItem = ({ item, index }) => {
    return (
      <View key={item._id} style={FindBudsStyle.listRow}>
        <View style={FindBudsStyle.imageContainer}>
          <CachedImage
            style={FindBudsStyle.profileImage}
            source={
              item.profileImageUrl
                ? { uri: item.profileImageUrl }
                : Images.defaultUser
            }
            defaultSource={Images.defaultUser}
            fallbackSource={Images.defaultUser}
            activityIndicatorProps={{ display: "none", opacity: 0 }}
          />
        </View>
        <View style={FindBudsStyle.detailContainer}>
          <TouchableWithoutFeedback
            onPress={() => this.gotoProfile(item, index)}
          >
            <View style={FindBudsStyle.usernameContainer}>
              <Text style={FindBudsStyle.username}>{item.name}</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={FindBudsStyle.followButtonContainer}>
            <Button
              onPress={() => this.followUser(index, item._id)}
              style={
                item.isFollowed
                  ? FindBudsStyle.followButtonFollowing
                  : FindBudsStyle.followButton
              }
            >
              <View style={Styles.followButtonWrapper}>
                <ScalableText
                  style={
                    item.isFollowed
                      ? FindBudsStyle.followButtonTextFollowing
                      : FindBudsStyle.followButtonText
                  }
                >
                  {item.isFollowed ? "Following" : "Follow"}
                </ScalableText>
                {item.isProcessing && (
                  <ActivityIndicator 
                    animating
                    size="small"
                    color={Colors.white}
                    style={{
                      position: 'absolute',
                      right: 0,
                    }}
                  />
                )}
              </View>
            </Button>
          </View>
        </View>
      </View>
    );
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

  renderEmptyBuds () {
    return (
      <View style={FindBudsStyle.noDataContainer}>
        <Text style={FindBudsStyle.noDataText}>
          None of your facebook friends are using Starbuds
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={FindBudsStyle.contianer}>
        {this.state.isConnected && this.state.showFacebookConnect && this.renderMessage()}
        {this.state.isConnected && this.state.friends.length == 0 && this.state.showNoFriends && this.renderEmptyBuds()}
        {this.state.isConnected && this.state.friends.length > 0 && (
          <FlatList
            data={this.state.friends}
            numColumns={1}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderListItem}
            ListFooterComponent={this.renderFooter}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            extraData={this.state}
            removeClippedSubviews={false}
          />
        )}
        {this.state.isLoading && (
          <ActivityIndicator
            animating
            size="large"
            style={{
              height: screenHeight - 120,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0a0a0a"
            }}
            color={Colors.primary}
          />
        )}
        {!this.state.isConnected && <NoNetworkView />}
      </View>
    );
  }
}
Buds.navigationOptions = ({ navigation }) => ({
  tabBarLabel: ({ focused }) => (
    <Text
      style={focused ? FindBudsStyle.tabLabelActive : FindBudsStyle.tabLabel}
    >
      Buds
    </Text>
  ),
  headerLeft: (
    <TouchableOpacity
      onPress={() => {
        navigation.state.params.findBudsBackAction() ? navigation.state.params.findBudsBackAction() : null;
      }}
      activeOpacity={0.5}
      style={Styles.headerLeftContainer}
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
  )
});

const mapStateToProps = ({ authReducer, userActionReducer }) => {
  const { userData, token } = authReducer;
  return { userData, token };
};

export default connect(mapStateToProps, {})(Buds);
