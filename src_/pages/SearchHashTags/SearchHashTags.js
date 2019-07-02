import React, { Component } from "react";
import { connect } from 'react-redux';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  NetInfo,
  ActivityIndicator
} from 'react-native';
import { NavigationActions } from "react-navigation";
import { Colors, Images, Metrics, Styles } from "../../theme";  
import { CachedImage } from 'react-native-cached-image';
import { UserAction } from "./../../actions";
import { apiCall } from "./../../services/AuthService"; 
import { FavouritesSavedAllStyle } from '../FavouriteSavedAll/FavouritesSavedAllStyle';
import { NoNetworkView } from "../../components";
import { navigateTo } from '../../services/CommonFunctions';

class SearchHashTags extends Component{
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      refreshing: false,
      isConnected: true,
      isLoading: true
    }
  }
  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      isConnected ? this.getHashTageFromApi(0) : this.setState({ isConnected: false});
    });
    NetInfo.isConnected.addEventListener('change', this._handleConnectionChange);
  }

  getHashTageFromApi(){
    const data = {
      "userId": this.props.userData._id,
      "hashTagName": this.props.navigation.state.params.hashTagName
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/searchHashTagPost", data, headers).then(response => {
      console.log('searchHashTag', response);
      if (response.status) {
        this.setState({ refreshing: false, posts: response.result.posts, isLoading: false,  });
        console.log('posts', this.state.posts);
      } else {
        this.setState({ refreshing: false, posts: [], isLoading: false });
      }
      // if (response.status) {
       
      // } else {
      //   this.setState({ refreshing: false, showNoPosts: 5 });
      // }
    }).catch(error => {
      this.setState({ refreshing: false, isLoading: false });
    });
  }
  _keyExtractor = (item, index) => item._id;

  _handleConnectionChange = (isConnected) => {
    if (isConnected) {
      this.setState({ isConnected: true }, () => {
        this.getHashTageFromApi();
      })
    } else {
      this.setState({ isConnected: false })
    }
  };

  handleRefresh = () => {
    this.setState({
      refreshing: true
    }, () => {
      this.getHashTageFromApi();
    });
  };

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
      color={Colors.primary} />;
  };

  renderGridItem = ({ item }) => {
    console.log('renderGrideItem', item)
    if (item) {
      if (item.medias[0].mediaType == 2) {
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
                <Image source={Images.videoIcon} style={FavouritesSavedAllStyle.videoIcon} />
              </View>
              <CachedImage style={FavouritesSavedAllStyle.imageInGrid}
                source={{ uri: item.medias[0].thumbnail }}
                defaultSource={Images.placeHolder}
                activityIndicatorProps={{
                  display: "none",
                  opacity: 0
                }} />
            </View>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={() => {
              this.openPostDetails(item);
            }}>
            {item.medias.length > 1 && (
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
                    style={FavouritesSavedAllStyle.multipleImagesIcon} />
                </View>
                <CachedImage
                  style={FavouritesSavedAllStyle.imageInGrid}
                  source={{
                    uri: item.medias[0].thumbnail
                  }}
                  defaultSource={Images.placeHolder}
                  activityIndicatorProps={{
                    display: "none",
                    opacity: 0
                  }} />
              </View>
            )}
            {item.medias.length == 1 && (<CachedImage
              style={FavouritesSavedAllStyle.imageInGrid}
              source={{
                uri: item.medias[0].thumbnail
              }}
              defaultSource={Images.placeHolder}
              activityIndicatorProps={{
                display: "none",
                opacity: 0
              }} />)}
          </TouchableOpacity>
        );
      }
    }
  };

  openPostDetails(currentPost) {
    console.log('openPost Details', currentPost)
   
    navigateTo(this.props.navigation, 'PostDetails', {
      post: currentPost,
      user: currentPost.userDetail[0],
      from: "Profile"
    })
  }

  render() {
    return (
      <View style={FavouritesSavedAllStyle.contianer}>
      
        {this.state.isConnected && this.state.isLoading && (
          <ActivityIndicator
            animating
            size="large"
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0a0a0a'
            }}
            color={Colors.primary} />
        )}
        {this.state.isConnected && !this.state.posts && (
          <View style={FavouritesSavedAllStyle.noPostsContainer}>
  
            <Text style={FavouritesSavedAllStyle.saveTextDetail}>
              No Post found
            </Text>
          </View>
        )}
        {this.state.isConnected && this.state.posts.length > 0 && (
          <FlatList
            data={this.state.posts}
            numColumns={3}
            keyExtractor={this._keyExtractor}
            renderItem={this.state.posts && this.renderGridItem}
            // ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={0.01}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
          />
        )}
        {!this.state.isConnected && <NoNetworkView />}
        
      </View>
    );
  }
}
const backAction = NavigationActions.back({ key: null });

SearchHashTags.navigationOptions = ({ navigation }) => ({
  title: '#' + navigation.state.params.hashTagName,
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
  ),
});

const mapStateToProps = ({ authReducer }) => {
  const { userData, loading, token } = authReducer;
  return { userData, loading, token };
};
export default connect(mapStateToProps, {
  UserAction
})(SearchHashTags);