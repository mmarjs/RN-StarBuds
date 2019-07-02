import React, { Component } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Image,
  NetInfo,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  View
} from "react-native";
import { CachedImage } from "react-native-cached-image";
import { connect } from "react-redux";
import ScalableText from 'react-native-text';
import { NavigationActions } from "react-navigation";
import { Button, NoNetworkView } from "./../../../components";
import { Colors, Images, Styles } from "./../../../theme";
import { apiCall } from "./../../../services/AuthService";
import { FindBudsStyle } from "../FindBudsStyle";
import { alert } from "../../../services/AlertsService";
import { navigateTo } from './../../../services/CommonFunctions';
import Input from "../../../components/Input/Input";

const backAction = NavigationActions.back({ key: null });
const screenHeight = Dimensions.get("window").height;

class Following extends Component {
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
      showedEndAlert: false,
      featuredUsers: [],
      allfeaturedUsers: [],
      processing: null,
      isLoading: true,
      isConnected: true,
    };
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      isConnected ? this.getFeaturedUsers(0, false, true) : this.setState({ isConnected: false, isLoading: false });
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
        this.getFeaturedUsers(0, false, true);
      })
    } else {
      this.setState({ isConnected: false })
    }
  };

  getFeaturedUsers(pageNo, loadingMore, refreshing) {
    let headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    let params = {
      noOfRecords: 20,
      pageNo: pageNo,
      userId: this.props.userData._id
    };
    apiCall("users/getFollowerslist", params, headers)
      .then(response => {
        if (response.status) {
          let featured = new Array(), featuredObject;
          for(let i = 0; i < response.result.users.length; i++) {
            featuredObject = response.result.users[i];
            featuredObject.isProcessing = false;
            featured.push(featuredObject);
          }
          if (pageNo == 0) {
            this.setState({ isLoading: false, featuredUsers: featured });
            this.setState({ isLoading: false, allfeaturedUsers: featured });
          } else {
            tempData = this.state.featuredUsers.concat(featured);
            this.setState({ isLoading: false, featuredUsers: tempData });
            this.setState({ isLoading: false, allfeaturedUsers: tempData });
          }
          if (response.result.nextPageAvailable) {
            this.setState({ nextPageAvailable: true });
          } else {
            this.setState({ nextPageAvailable: false });
          }
          if (loadingMore) {
            this.setState({ loadingMore: false });
          }
          if (refreshing) {
            this.setState({ refreshing: false });
          }
        } else {
          this.setState({ isLoading: false });
          if (loadingMore) {
            this.setState({ loadingMore: false });
          }
          if (refreshing) {
            this.setState({ refreshing: false });
          }
          setTimeout(() => {
            alert(response.message);
          });
        }
      })
      .catch(error => {
        this.setState({ isLoading: false });
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

  followUser = (index, user) => {
    if (!this.state.featuredUsers[index].isProcessing) {
      const newArray = [...this.state.featuredUsers];
      newArray[index].isProcessing = true;
      this.setState({ featuredUsers: newArray });
      // this.setState({ isLoading: true });
      if (newArray[index].alreadyFollow) {
        removeFromFollowerCount = removeFromFollowerCount + 1;
        DeviceEventEmitter.emit("removeFromFollowingCount", { add: false });
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
            newArray[index].alreadyFollow = false;
            newArray[index].isProcessing = false;
            this.setState({featuredUsers: newArray});
          })
          .catch(error => {
            newArray[index].alreadyFollow = true;
            newArray[index].isProcessing = false;
            this.setState({featuredUsers: newArray});
            alert('Failed', 'Failed to unfollow '+newArray[index].name);
          });
      } else {
        addToFollowerCount = addToFollowerCount + 1;
        DeviceEventEmitter.emit("addInFollowingCount", { add: true });
        this.setState({ featuredUsers: newArray });
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
            newArray[index].alreadyFollow = true;
            newArray[index].isProcessing = false;
            this.setState({featuredUsers: newArray});
          })
          .catch(error => {
            newArray[index].alreadyFollow = false;
            newArray[index].isProcessing = false;
            this.setState({featuredUsers: newArray});
            alert('Failed', 'Failed to follow '+newArray[index].name);
          });
      }
    }
  }

  handleLoadMore = () => {
    if (!this.loadingMore) {
      if (this.state.nextPageAvailable) {
        this.setState(
          {
            pageNo: this.state.pageNo + 1,
            loadingMore: true
          },
          () => {
            this.getFeaturedUsers(this.state.pageNo, true, false);
          }
        );
      }
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        pageNo: 0,
        refreshing: true
      },
      () => {
        this.getFeaturedUsers(0, false, true);
      }
    );
  };

  gotoProfile = (userDetails,index) => {
    // console.log('go to profile')
    navigateTo(this.props.navigation, 'OtherProfileForFindBuds', {
      profileId: userDetails._id,
      profileName: userDetails.name,
      findBudId: userDetails._id,
      findBudIndex: index,
      followBud: this.followUser,
    });
  };

  componentWillMount() {
    this.props.navigation.setParams({
      findBudsBackAction: this.findBudsBackAction
    });
  }

  onChangeText = (text) => {
    if (text == '') {
      this.setState({
        featuredUsers: this.state.allfeaturedUsers
      });
    }
    else {
      var filteredChatsByName = this.state.allfeaturedUsers.filter((item)=> item.name.toLowerCase().indexOf(text.toLowerCase()) !== -1 ); 
      this.setState({
        featuredUsers: filteredChatsByName
      });
    }
    this.setState({
      searchText: text
    });
  }

  findBudsBackAction() {
    this.props.navigation.state.params.updateFollowerCount({
      totalFollowerCount: addToFollowerCount - removeFromFollowerCount
    });
    this.props.navigation.dispatch(backAction);
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
          <TouchableWithoutFeedback onPress={() => this.gotoProfile(item,index)}>
            <View style={FindBudsStyle.usernameContainer}>
              <Text style={FindBudsStyle.username}>{item.name}</Text>
              <Text style={FindBudsStyle.username2}>{item.username}</Text>
            </View>
          </TouchableWithoutFeedback>
          {/* <View style={FindBudsStyle.followButtonContainer}>
            <Button
              onPress={() => this.followUser(index, item._id)}
              style={
                FindBudsStyle.followButtonFollowing
              }
            >
              <View style={Styles.followButtonWrapper}>
                <ScalableText
                  style={
                    FindBudsStyle.followButtonTextFollowing
                  }
                >
                Following
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
          </View> */}
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

  render() {
    return (
      <View style={FindBudsStyle.contianer}>
        {this.state.isConnected && this.state.featuredUsers && (
          <View>
           <Input
           icon="searchPeople"
           placeholder="Search"
           placeholderTextColor={Colors.dark}
           style={[{backgroundColor : 'rgb(243, 244, 246)',marginRight : 13, marginLeft : 20,borderRadius : 10, height : 43, marginTop : 5 }, Styles.thinBottomBorder7]}
           textStyle={{ fontFamily: 'SFUIText-Regular', color: 'rgb(118, 129, 150)', fontSize: 16,lineHeight:20, letterSpacing: 0 }}
           onChangeText={ text => {
             this.onChangeText(text);
           }}
           customIconStyle={{ marginLeft : 15,height: 18, width: 18, alignSelf: 'flex-start', tintColor : 'gray' }}
         />
          {this.state.isLoading && (
          <ActivityIndicator
            animating
            size="large"
            style={{
              height: screenHeight - 120,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white"
            }}
            color={Colors.primary}
          />
        )}
          <FlatList
            style={{height : screenHeight - 230}}
            data={this.state.featuredUsers}
            numColumns={1}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderListItem}
            ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={0.01}
            onEndReached={this.handleLoadMore}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            extraData={this.state}
            removeClippedSubviews={false}
          />
          </View>
        )}
       
        {!this.state.isConnected && <NoNetworkView />}
      </View>
    );
  }
}
Following.navigationOptions = ({ navigation }) => ({
  title: 'FOLLOWING',
	// headerTitleStyle: {
	// 	fontSize: 16,
	// 	letterSpacing: 0.8,
	// 	color: Colors.white,
	// 	fontFamily: 'ProximaNova-Regular'
  // },
  headerTitleStyle: Styles.headerTitleStyle,
	// headerStyle: {
  //   backgroundColor: 'black'
  // },
  headerStyle: Styles.headerStyle,
  headerLeft: (
    <TouchableOpacity
    onPress={() => {
      navigation.dispatch(backAction);
      // navigation.goBack(backAction)
      // navigation.dispatch({ type: "Tabs"});
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

const mapStateToProps = ({ authReducer }) => {
  const { userData, token } = authReducer;
  return { userData, token };
};

export default connect(mapStateToProps, {})(Following);
