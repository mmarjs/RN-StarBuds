import React, { Component } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  NetInfo,
  Text,
  TouchableOpacity,
  View,
  ImageBackground
} from "react-native";
import { connect } from "react-redux";
import { CachedImage } from "react-native-cached-image";
import { NavigationActions } from "react-navigation";
import { NoNetworkView } from '../../components';
import { Images, Colors, Styles } from "./../../theme";
import { apiCall } from "./../../services/AuthService";
import { PhotosOfUserStyle } from "./PhotosOfUserStyle";
import { navigateTo } from '../../services/CommonFunctions';

const backAction = NavigationActions.back({
  key: null
});

class PhotosOfUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileImageUrl: Images.defaultUser,
      showNoPosts: 0, // 0 for loading, 1 for no posts, 2 for posts
      posts: [],
      refreshing: false,
      pageNo: 0,
      nextPageAvailable: false,
      allowScroll: true,
      isConnected: true,
      isLoading: true
    };
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      isConnected ? this.getTaggedPhotos(0) : this.setState({ isConnected: false, isLoading: false });
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
        this.getTaggedPhotos(this.state.pageNo);
      })
    } else {
      this.setState({ isConnected: false })
    }
  };

  getTaggedPhotos(page) {
    let profileId = this.props.navigation.state.params.profileId;
    const data = {
      userId: [profileId],
      pageNo: page
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("users/usersTaggedPosts", data, headers)
      .then(response => {
        if (response.status) {
          if (page == 0) {
            if (response.result.posts.length > 0) {
              this.setState({ posts: response.result.posts, refreshing: false, isLoading: false });
            } else {
              this.setState({ refreshing: false, isLoading: false });
            }
          } else {
            tempData = this.state.posts.concat(response.result.posts);
            this.setState({
              posts: tempData,
              refreshing: false,
              showNoPosts: 2,
              isLoading: false
            });
          }
          if (response.result.nextPageAvailable) {
            this.setState({
              nextPageAvailable: true,
              allowScroll: true
            });
          } else {
            this.setState({
              nextPageAvailable: false,
              allowScroll: false
            });
          }
        } else {
          this.setState({ showNoPosts: 1, refreshing: false, isLoading: false });
        }
      })
      .catch(error => {
        this.setState({ showNoPosts: 1, refreshing: false, isLoading: false });
      });
  }

  handleRefresh = () => {
    this.setState(
      {
        pageNo: 0,
        refreshing: true
      },
      () => {
        this.getTaggedPhotos(0);
      }
    );
  };

  handleLoadMore = () => {
    if (this.state.nextPageAvailable) {
      this.setState(
        {
          pageNo: this.state.pageNo + 1
        },
        () => {
          this.getTaggedPhotos(this.state.pageNo);
        }
      );
    }
  };

  openPostDetails(currentPost) {
    navigateTo(this.props.navigation, 'PostDetails', {
      post: currentPost,
      user: currentPost.userDetail[0],
      isHome: this.props.navigation.state.params.isOtherUser ? true: false,
      from: this.props.navigation.state.params.from
    });
  }

  _keyExtractor = (item, index) => item._id;

  renderFooter = () => {
    if (!this.state.refreshing) return null;
    return <ActivityIndicator 
      animating size="large"
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a'}}
      color={Colors.primary} />;
  };

  renderGridItem = ({ item }) => {
    if (item) {
      if (item.medias[0].mediaType == 2) {
        return (
          <TouchableOpacity
            onPress={() => {
              this.openPostDetails(item);
            }}
          >
            <View style={PhotosOfUserStyle.imageInGrid} key={item._id}>
              <View
                style={{
                  zIndex: 10,
                  flex: 1,
                  top: PhotosOfUserStyle.imageInGrid.height - 22,
                  alignSelf: "flex-end"
                }}
              >
                <Image
                  source={Images.videoIcon}
                  style={PhotosOfUserStyle.videoIcon}
                />
              </View>
              <CachedImage
                style={PhotosOfUserStyle.imageInGrid}
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
              <View style={PhotosOfUserStyle.imageInGrid} key={item._id}>
                <View
                  style={{
                    zIndex: 10,
                    flex: 1,
                    top: PhotosOfUserStyle.imageInGrid.height - 25,
                    alignSelf: "flex-end"
                  }}
                >
                  <Image
                    source={Images.multipleImages}
                    style={PhotosOfUserStyle.multipleImagesIcon}
                  />
                </View>
                <CachedImage
                  style={PhotosOfUserStyle.imageInGrid}
                  source={{ uri: item.medias[0].mediaUrl }}
                  defaultSource={Images.placeHolder}
                  fallbackSource={Images.defaultUser}
                  activityIndicatorProps={{ display: "none", opacity: 0 }}
                />
              </View>
            )}
            {item.medias.length == 1 && (
              <CachedImage
                style={PhotosOfUserStyle.imageInGrid}
                source={{ uri: item.medias[0].mediaUrl }}
                defaultSource={Images.placeHolder}
                fallbackSource={Images.defaultUser}
                activityIndicatorProps={{ display: "none", opacity: 0 }}
              />
            )}
          </TouchableOpacity>
        );
      }
    }
  };

  renderEmptyPhotosOfYou = () => {
    return (
      <View style={PhotosOfUserStyle.emptyContainer}>
      <ImageBackground
          style={PhotosOfUserStyle.imageContainer}
          source={Images.farmer}
        >
        <View style={PhotosOfUserStyle.group2}>
        <View>
          <Image
            style={PhotosOfUserStyle.noPhotosImage}
            source={Images.noPhotosOfYou}
          />
        </View>

        <Text style={PhotosOfUserStyle.noPhotosText1}>
          NO PHOTOS
        </Text>
        <Text style={PhotosOfUserStyle.noPhotosText2}>
          When you have photos tagged of you they will appear here.
        </Text>
        </View>
        </ImageBackground>
      </View>
    );
  }

  render() {
    return (
      <View style={PhotosOfUserStyle.contianer}>
        {this.state.isLoading && (
          <ActivityIndicator
            animating
            size="large"
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0f0f0f'
            }}
            color={Colors.primary}/>
        )}
        {this.state.isConnected && !this.state.isLoading && (
          <FlatList
            data={this.state.posts}
            numColumns={3}
            keyExtractor={this._keyExtractor}
            renderItem={this.state.posts && this.renderGridItem}
            ListEmptyComponent={this.renderEmptyPhotosOfYou}
            ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={0.01}
            onEndReached={this.handleLoadMore}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
          />
        )}
        {!this.state.isConnected && <NoNetworkView />}
      </View>
    );
  }
}

PhotosOfUser.navigationOptions = ({ navigation }) => ({
  title: `PHOTOS OF ${navigation.state.params.isOtherUser ? (navigation.state.params.profileName).toUpperCase() : 'YOU'}`,
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
      <Image source={Images.backButton} style={[Styles.headerLeftImage, { height: 15, width: 8 }]} />
    </TouchableOpacity>
  ),
  // headerRight: (
  //   <TouchableOpacity
  //     onPress={() => {
  //       // navigation.dispatch(backAction);
  //     }}
  //     style={Styles.headerRightContainer}
  //     activeOpacity={0.5}
  //   >
  //     <Image source={Images.threeHorizontalDots} style={[Styles.headerLeftImage, { height: 3, width: 16.7 }]} />
  //   </TouchableOpacity>
  // )
});

const mapStateToProps = ({ authReducer }) => {
  const { userData, token } = authReducer;
  return { userData, token };
};
export default connect(mapStateToProps, {})(PhotosOfUser);
