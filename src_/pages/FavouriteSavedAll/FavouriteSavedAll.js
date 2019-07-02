import React, {Component} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  Image,
  NetInfo,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import { CachedImage } from "react-native-cached-image";
import { NoNetworkView } from "../../components";
import { Images, Colors, Styles } from "./../../theme";
import { FavouritesSavedAllStyle } from './FavouritesSavedAllStyle';
import { apiCall } from "./../../services/AuthService";
import NewGroupModal from '../NewGroupModal/NewGroupModal';
import AddFromSaved from '../AddFromSaved/AddFromSaved';
import { alert } from "./../../services/AlertsService";
import { addGroup, updateSingleGroup } from "./../../actions";
import { navigateTo } from '../../services/CommonFunctions';

class FavouritesSavedAll extends Component {
  constructor(props) {
    super(props);
    this.newGroupAction = this.newGroupAction.bind(this);
    this.state = {
      profileImageUrl: Images.defaultUser,
      showNoPosts: 0, // 0 for loading, 1 for no posts, 2 for posts
      pageNo: 0,
      nextPageAvailable: false,
      posts: [],
      allowScroll: true,
      refreshing: false,
      isNewGroupModalVisible: false,
      isAddFromSavedModalVisible: false,
      newGroupName: '',
      isCreatingGroup: false, //flag to show the group creating indicator when makin api call
      lastAddedGroupId: null,
      isConnected: true
    };
    DeviceEventEmitter.addListener("refreshSaved", e => {
      this.getSavedPostsFromApi(0);
    });
  }

  getSavedPostsFromApi(page) {
    const data = {
      user: this.props.userData._id,
      pageNo: page
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/getSavedPost", data, headers).then(response => {
      if (response.status) {
        if (page == 0) {
          this.setState({posts: response.result.posts});
          if (this.state.posts.length > 0) {
            this.setState({showNoPosts: 2, refreshing: false});
          } else {
            this.setState({showNoPosts: 1, refreshing: false});
          }
        } else {
          tempData = response.result.posts.concat(this.state.posts);
          this.setState({posts: tempData, refreshing: false, showNoPosts: 2});
        }
        if (response.result.nextPageAvailable) {
          this.setState({nextPageAvailable: true, allowScroll: true});
        } else {
          this.setState({nextPageAvailable: false, allowScroll: false});
        }
      } else {
        this.setState({refreshing: false, showNoPosts: 5});
      }
    }).catch(error => {
      this.setState({ refreshing: false, showNoPosts: 5});
    });
  }

  handleRefresh = () => {
    this.setState({
      pageNo: 0,
      refreshing: true
    }, () => {
      this.getSavedPostsFromApi(0);
    });
  };

  handleLoadMore = () => {
    if (this.state.nextPageAvailable) {
      this.setState({
        pageNo: this.state.pageNo + 1
      }, () => {
        this.getSavedPostsFromApi(this.state.pageNo);
      });
    }
  };

  openPostDetails(currentPost) {
    let post = currentPost.post;
    post.likedOrNot = currentPost.likedOrNot;
    post.postSavedOrNot = currentPost.postSavedOrNot;
    post.totalLikes = currentPost.totalLikes;
    post.totalComments = currentPost.totalComments;
    navigateTo(this.props.navigation, 'PostDetails', {
      post: post,
      user: currentPost.userDetail,
      from: "Profile"
    })
  }

  newGroupAction() {
    this.state.isConnected ? this.setState({ isNewGroupModalVisible: true }) : alert('No internet connection', 'Please check your network connectivity.');
  }

  groupCancelAction() {
    this.setState({ isNewGroupModalVisible: false });
  }

  groupNextAction = (newGroupName) => {
    if(newGroupName.length > 0) {
      this.setState({
        newGroupName: newGroupName,
        isAddFromSavedModalVisible: true,
        isNewGroupModalVisible: false
      });
      this.setState({ isCreatingGroup: true }, () => {
      const data = {
        "user": this.props.userData._id,
        "post": [],
        "name": this.state.newGroupName	
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
        userid: this.props.userData._id
      };
      apiCall("posts/saveCollection", data, headers)
        .then(response => {
          if(response.status) {
            this.setState({ lastAddedGroupId: response.result[0]._id }, () => {
              this.props.addGroup(response.result[0]);
            });
          } else {
            alert('Failed', response.message);
          }
        }).catch(error => {
            alert("Failed", error.message ? error.message : 'Something went wrong!');
        })
      });
    } else {
      alert('Alert', 'Please give group a name.');
    }
  }

  savedCancelAction() {
    this.setState({ isAddFromSavedModalVisible: false });
  }

  savedNextAction = (selectedImages) => {
    if(selectedImages.length == 0) {
      this.setState({ newGroupName: '', isAddFromSavedModalVisible: false });
    } else {
      this.setState({ isCreatingGroup: true }, () => {
      const data = {
        "collectionId": this.state.lastAddedGroupId,
        "post": selectedImages,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
        userid: this.props.userData._id
      };
      apiCall("posts/updateCollectionPost", data, headers)
        .then(response => {
          if(response.status) {
            this.props.updateSingleGroup(response.result[0]);
            this.setState({ newGroupName: '', isAddFromSavedModalVisible: false });
          } else {
            alert('Failed', response.message);
          }
        }).catch(error => {
            alert("Failed", error.message ? error.message : 'Something went wrong!');
        })
      });
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      newGroupAction: this.newGroupAction,
    });
    NetInfo.isConnected.fetch().then(isConnected => {
      isConnected ? this.getSavedPostsFromApi(0) : this.setState({ isConnected: false, showNoPosts: 5 });
    });
    NetInfo.isConnected.addEventListener('change', this._handleConnectionChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('change', this._handleConnectionChange);
  }

  _handleConnectionChange = (isConnected) => {
    if(isConnected) {
      this.setState({ isConnected: true }, () => {
        this.setState({ showNoPosts: 0 });
        this.getSavedPostsFromApi(0);
      })
    } else {
      this.setState({ isConnected: false })
    }
  };

  renderMessage() {
    return (
      <View style={FavouritesSavedAllStyle.savedTextContainer}>
        <Text style={FavouritesSavedAllStyle.savedText}>
          Saved Items Are Private
        </Text>
      </View>
    );
  }

  _keyExtractor = (item, index) => item._id;

  renderFooter = () => {
    if (!this.state.refreshing) 
      return null;
    return <ActivityIndicator
      animating
      size="large"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a'
      }}
      color={Colors.primary}/>;
  };

  renderGridItem = ({item}) => {
    if (item.post) {
      if (item.post.medias[0].mediaType == 2) {
        return (
          <TouchableOpacity
            onPress={() => {
            this.openPostDetails(item);
          }}>
            <View style={FavouritesSavedAllStyle.imageInGrid} key={item._id}>
              <View
                style={{
                zIndex: 10,
                flex: 1,
                top: FavouritesSavedAllStyle.imageInGrid.height - 22,
                alignSelf: "flex-end"
              }}>
                <Image source={Images.videoIcon} style={FavouritesSavedAllStyle.videoIcon}/>
              </View>
              <CachedImage style={FavouritesSavedAllStyle.imageInGrid} 
              source={{uri: item.post.medias[0].thumbnail}}
              defaultSource={Images.placeHolder} 
              activityIndicatorProps={{
                display: "none",
                opacity: 0
              }}/>
            </View>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={() => {
            this.openPostDetails(item);
          }}>
            {item.post.medias.length > 1 && (
              <View style={FavouritesSavedAllStyle.imageInGrid} key={item._id}>
                <View
                  style={{
                  zIndex: 10,
                  flex: 1,
                  top: FavouritesSavedAllStyle.imageInGrid.height - 25,
                  alignSelf: "flex-end"
                }}>
                  <Image
                    source={Images.multipleImages}
                    style={FavouritesSavedAllStyle.multipleImagesIcon}/>
                </View>
                <CachedImage
                  style={FavouritesSavedAllStyle.imageInGrid}
                  source={{
                  uri: item.post.medias[0].thumbnail
                }}
                  defaultSource={Images.placeHolder}
                  activityIndicatorProps={{
                  display: "none",
                  opacity: 0
                }}/>
              </View>
            )}
            {item.post.medias.length == 1 && (<CachedImage
              style={FavouritesSavedAllStyle.imageInGrid}
              source={{
              uri: item.post.medias[0].thumbnail
            }}
              defaultSource={Images.placeHolder}
              activityIndicatorProps={{
              display: "none",
              opacity: 0
            }}/>)}
          </TouchableOpacity>
        );
      }
    }
  };

  render() {
    return (
      <View style={FavouritesSavedAllStyle.contianer}>
        {this.state.isConnected && this.renderMessage()}
        {this.state.showNoPosts == 0 && (
          <ActivityIndicator
            animating
            size="large"
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0a0a0a'
            }}
            color={Colors.primary}/>
        )}
        {this.state.isConnected && this.state.showNoPosts == 1 && (
          // <View style={FavouritesSavedAllStyle.noPostsContainer}>
          //   <Image source={Images.saveContent} style={FavouritesSavedAllStyle.noPostImage}/>
          //   <Text style={FavouritesSavedAllStyle.saveContentText}>SAVE CONTENT</Text>
          //   <Text style={FavouritesSavedAllStyle.saveTextDetail}>
          //     Save photos, posts and content you want access to again. No one will be
          //     notified.
          //   </Text>
          // </View>
          <View style={FavouritesSavedAllStyle.noPostsContainer}>
            <View>
              <Image
                style={FavouritesSavedAllStyle.noPostImage}
                source={Images.saveContent}
              />
            </View>
            <Text style={FavouritesSavedAllStyle.saveContentText}>SAVE CONTENT</Text>
            <Text style={FavouritesSavedAllStyle.saveTextDetail}>
               Save photos, posts and content you want access to again. No one will be
               notified.
            </Text>
          </View>
        )}
        {this.state.isConnected && this.state.showNoPosts == 2 && this.state.posts.length > 0 && (
          <FlatList
            data={this.state.posts}
            numColumns={3}
            keyExtractor={this._keyExtractor}
            renderItem={this.state.posts && this.renderGridItem}
            ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={0.01}
            onEndReached={this.handleLoadMore}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
          />
        )}
        {!this.state.isConnected && <NoNetworkView />}
        <NewGroupModal 
          modalVisible={this.state.isNewGroupModalVisible}
          groupCancelAction={() => this.groupCancelAction()}
          groupNextAction={this.groupNextAction}
        />
        <AddFromSaved 
          modalVisible={this.state.isAddFromSavedModalVisible}
          savedCancelAction={() => this.savedCancelAction()}
          savedNextAction={this.savedNextAction}
        />
      </View>
    );
  }
}

FavouritesSavedAll.navigationOptions  = ({ navigation }) => ({
  tabBarLabel: ({ focused }) => (
    <Text style={focused ? FavouritesSavedAllStyle.tabLabelActive : FavouritesSavedAllStyle.tabLabel }>All</Text>
  ),
  headerRight: (
    <TouchableOpacity
      onPress={() => navigation.state.params.newGroupAction()}
      style={Styles.headerRightContainer}
      activeOpacity={0.5}
    >
      <Image
        source={Images.plusIcon}
        style={[
          Styles.headerRightImage,
          {
            height: 15,
            width: 15
          }
        ]}
      />
    </TouchableOpacity>
  )
});

const mapStateToProps = ({ authReducer, groupReducer }) => {
  const { userData, token } = authReducer;
  const { groups } = groupReducer;
  return { userData, token, groups };
};
export default connect(mapStateToProps, { addGroup, updateSingleGroup })(
  FavouritesSavedAll
);
