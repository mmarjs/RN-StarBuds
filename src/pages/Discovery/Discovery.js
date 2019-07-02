import React, { Component } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Linking,
  NetInfo,
  RefreshControl,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { CachedImage } from 'react-native-cached-image';
import Input from '../../components/Input/Input';
import { NoNetworkView } from '../../components';
import { apiCall } from './../../services/AuthService';
import { checkNetworkConnection, navigateTo } from '../../services/CommonFunctions';
import { alert } from './../../services/AlertsService';
import { Colors, Images, Styles } from '../../theme';
import { DiscoveryStyle } from './DiscoveryStyle';
import {
  setUserData,
  setToken
} from '../../actions';

class Discovery extends Component {

  constructor(props) {
    super(props);
    this.state = {
      trending: new Array(),
      // lovedStrains: new Array(),
      lovedStrains: [
        {
          name1: 'Hybrid',
          name2: 'Gav',
          name3: 'Green Avenger'
        },
        {
          name1: 'Sativa',
          name2: '5e',
          name3: '5th Element'
        },
        {
          name1: 'Indica',
          name2: 'Sbt',
          name3: 'Shark Bite'
        },
      ],
      // news: new Array(),
      news: [
        Images.news1, Images.news2, Images.news3
      ],
      searchText: '',
      searchResults: new Array(),
      isLoading: true,
      showCloseIcon: false,
      showSearchResults: false,
      showSearchLoading: false,
      isRefreshing: false,
      isConnected: true
    }
  }

  componentWillMount() {
    this.props.navigation.setParams({
      headerLeftActive: false,
      headerLeftAction: this.headerLeftAction,
      headerLeftActionPressIn: this.headerLeftActionPressIn,
      headerLeftActionPressOut: this.headerLeftActionPressOut,
    });
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      isConnected ? this.getTrending() : this.setState({ isConnected: false, isLoading: false });
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
        this.getTrending();
      })
    } else {
      this.setState({ isConnected: false })
    }
  };
  
  headerLeftAction = () => {
    Linking.openURL('https://www.leafly.com/');
  };

  headerLeftActionPressIn = () => {
    this.props.navigation.setParams({
      headerLeftActive: true,
      disableChatAction: true,
    });
  };

  headerLeftActionPressOut = () => {
    this.props.navigation.setParams({
      headerLeftActive: false,
      disableChatAction: false,
    });
  }; 

  getTrending () {
    const data = {
      userId: this.props.userData._id,
    };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.props.token,
      userId: this.props.userData._id
    };
    apiCall('posts/searchTopTenPosts', data, headers).then(response => {
      if (response.result.length > 0) {
        this.setState({ trending: response.result, isLoading: false, isRefreshing: false });
      } else {
        this.setState({ isLoading: false, isRefreshing: false });
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
          navigateTo(this.props.navigation, 'GetStart');
        } else if(error == 'no network') {
          this.setState({ isConnected: false })
        }
      });
    })
  }

  onPageRefresh () {
    this.setState({ isRefreshing: true }, () => {
      this.getTrending();
    })
  }

  search (searchText) {
    if(checkNetworkConnection()) {
      this.setState({ showSearchLoading: true }, () => {
        const data = {
          query: searchText,
        };
        const headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.token,
          userid: this.props.userData._id
        };
        apiCall('users/searchAllUsers', data, headers).then(response => {
          this.setState({ searchResults: response.result.length ? response.result : [], showSearchResults: true }, () => {
            this.setState({ showSearchLoading: false })
          });
        }).catch(error => {
          this.setState({
            showSearchLoading: false,
            showSearchResults: false
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
            }
          });
        })
      })
    } else {
      alert('No internet connection', 'Please check your network connectivity.');
    }
  }

  closeSearch() {
    this.setState({
      showSearchResults: false,
      searchResults: [],
      searchText: '',
    }, () => {
      this.setState({
        showCloseIcon: false,
      }, () => {
        Keyboard.dismiss();
      })
    }); 
  }
  
  openOtherProfile(user) {
    if(this.props.userData._id == user._id) {
      navigateTo(this.props.navigation, 'Profile');
    } else {
      navigateTo(this.props.navigation, 'OtherProfile', {
        profileId: user._id,
        profileName: user.name,
        from: 'Discovery'
      });
    }
  }

  openPostDetails(currentPost) {
    navigateTo(this.props.navigation, 'PostDetails', {
      post: currentPost,
      user: currentPost.userDetail[0],
      from: 'Discovery'
    });
  }

  renderSearchbar () {
    let searchRegex = /^\s*$/;
    return (
      <View style={[DiscoveryStyle.textFieldStyle, DiscoveryStyle.seacrhBar]}>
        <Image
          source={Images.searchIcon}
          style={[DiscoveryStyle.seacrhIcon, DiscoveryStyle.iconStyleDefault]}
        />
        <TextInput
          autoCorrect={false}
          placeholder='Search'
          placeholderTextColor={Colors.placeholderTextColor}
          style={DiscoveryStyle.inputStyle}
          value={this.state.searchText}
          onChangeText={text => {
            if(!searchRegex.test(text)) {
              this.setState({ searchText: text}, () => {
                if (this.state.searchText.length > 2) {
                  this.search(text);
                }
              })
            } else {
              this.setState({ searchText: '' })
            }
          }}
          onSubmitEditing={event => {
            if(!searchRegex.test(this.state.searchText)) {
              if (this.state.searchText.length > 2) {
                this.search(this.state.searchText);
              }
            } else {
              this.setState({ searchText: '' })
            }
          }}
          onFocus={event  => this.setState({ showCloseIcon: true})}
          selectionColor={Colors.primary}
          keyboardType={'default'}
          underlineColorAndroid='transparent'
          keyboardAppearance='dark'
          returnKeyType={'search'}
          autoCapitalize={'none'}
        />
        {this.state.showCloseIcon && !this.state.showSearchLoading && 
        <TouchableOpacity 
          style={{alignSelf: 'center', padding: 15}}
          onPress={()=> this.closeSearch()}
        >
          <Image
            source={Images.closeIconWhite}
            style={[DiscoveryStyle.closeIcon, DiscoveryStyle.iconStyleDefault]}
          />
        </TouchableOpacity>}
        {this.state.showCloseIcon && this.state.showSearchLoading && 
          <ActivityIndicator
            animating
            size='small'
            style={{padding: 15}}
            color={Colors.primary}
          />
        }
      </View>
    )
  }

  renderActivityIndicator () {
    return (
      <ActivityIndicator
        animating
        size='large'
        style={DiscoveryStyle.activityIndicatorStyle}
        color={Colors.primary}
      />
    );
  }  

  renderSearchResultItem = ({ item, index}) => {
    return (
      <View style={[DiscoveryStyle.searchListRow, index == 0 && { paddingTop: 15 }]}>
        <View style={DiscoveryStyle.searchListProfilePictureContainer}>
          <TouchableOpacity onPress={() => {this.openOtherProfile(item)}}>
            <CachedImage
              style={[DiscoveryStyle.searchListProfilePicture]}
              source={{ uri: item.thumbnail }}
              defaultSource={Images.placeHolder}
              fallbackSource={Images.placeHolder}
              activityIndicatorProps={{ display: 'none', opacity: 0 }}
            />
          </TouchableOpacity>
        </View>
        <View style={DiscoveryStyle.namesContainer}>
          <TouchableOpacity onPress={() => {this.openOtherProfile(item)}}>
            <Text style={DiscoveryStyle.username}>{item.username}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this.openOtherProfile(item)}}>
            <Text style={DiscoveryStyle.name}>{item.name}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  
  renderSearchResults () {
    return (
      <FlatList
        data={this.state.searchResults}
        numColumns={1}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderSearchResultItem}
        scrollEnabled={true}
        extraData={this.state}
      />
    )
  }

  renderEmptySearchResults () {
    return (
      <View style={DiscoveryStyle.emptyContainer}>
        <Text style={DiscoveryStyle.emptyText}>No results found!</Text>
      </View>
    )
  }
  
  keyExtractor = (item, index) => index;
  
  renderTrendingGridItem = ({item, index}) => {
    if (item.medias[0].mediaType == 2) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.openPostDetails(item);
          }}
          activeOpacity={0.9}
        >
          <View style={[DiscoveryStyle.gridItem, index % 3 === 1 && { marginRight: 0.5, marginLeft: 0.5 }]} key={item._id}>
            <CachedImage
              style={[DiscoveryStyle.gridItem]}
              source={{ uri: item.medias[0].thumbnail }}
              defaultSource={Images.placeHolder}
              fallbackSource={Images.placeHolder}
              activityIndicatorProps={{ display: 'none', opacity: 0 }}
            />
            <Image source={Images.videoIcon} style={DiscoveryStyle.videoIcon} />
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
            <View style={[DiscoveryStyle.gridItem, index % 3 === 1 && { marginRight: 0.5, marginLeft: 0.5 }]} key={item._id}>
              <CachedImage
                style={[DiscoveryStyle.gridItem]}
                source={{ uri: item.medias[0].thumbnail }}
                defaultSource={Images.placeHolder}
                activityIndicatorProps={{ display: 'none', opacity: 0 }}
              />
              <Image
                source={Images.multipleImages}
                style={DiscoveryStyle.multipleImagesIcon}
              />
            </View>
          )}
          {item.medias.length == 1 && (
            <View style={[DiscoveryStyle.gridItem, index % 3 === 1 && { marginRight: 0.5, marginLeft: 0.5 }]} key={item._id}>
              <CachedImage
                style={[DiscoveryStyle.gridItem]}
                source={{ uri: item.medias[0].thumbnail }}
                defaultSource={Images.placeHolder}
                activityIndicatorProps={{ display: 'none', opacity: 0 }}
              />
            </View>
          )}
        </TouchableOpacity>
      );
    }
  }

  renderTrending () {
    return (
      <View style={DiscoveryStyle.sectionContainer}>
        <Text style={DiscoveryStyle.sectionTitleText}>Trending</Text>
        <FlatList
          data={this.state.trending.slice(0, 6)}
          numColumns={3}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderTrendingGridItem}
          removeClippedSubviews={false}
          scrollEnabled={false}
        />
      </View>
    );
  }
  
  renderStrainsGridItem = ({item, index}) => {
    let specificStyle;
    if(index == 0) {
      specificStyle = {
        backgroundColor: 'rgb(56, 182, 62)',
      }
    } else if(index == 1) {
      specificStyle = {
        backgroundColor: 'rgb(249, 79, 80)',
      }
    } else if(index == 2) {
      specificStyle = {
        backgroundColor: 'rgb(234, 76, 147)',
      }
    }
    return (
      <View style={[DiscoveryStyle.gridItem, specificStyle, index % 3 === 1 && { marginRight: 0.5, marginLeft: 0.5 }]}>
        <Text style={[DiscoveryStyle.text1, specificStyle]}>{item.name1}</Text>
        <Text style={[DiscoveryStyle.text2, specificStyle]}>{item.name2}</Text>
        <Text style={[DiscoveryStyle.text3, specificStyle]}>{item.name3}</Text>
      </View>
    )
  }
  
  renderLovedStrains () {
    return (
      <View style={DiscoveryStyle.sectionContainer}>
        <Text style={DiscoveryStyle.sectionTitleText}>Strains We Love</Text>
        <FlatList
          contentContainerStyle={{backgroundColor: Colors.black}}
          data={this.state.lovedStrains}
          numColumns={3}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderStrainsGridItem}
          scrollEnabled={false}
        />
      </View>
    );
  }

  renderNewsItem = ({item, index}) => {
    return (
      // <CachedImage 
      //   style={DiscoveryStyle.gridItem}
      //   source={{uri: item.url}}
      //   defaultSource={Images.item}
      //   fallbackSource={Images.item}
      //   activityIndicatorProps={{ display: 'none', opacity: 0 }}
      // />
      <Image 
        style={[DiscoveryStyle.gridItem, index % 3 === 1 && { marginRight: 0.5, marginLeft: 0.5 }]}
        source={item}
      />
    )
  }

  renderNews () {
    return (
      <View style={DiscoveryStyle.sectionContainer}>
        <Text style={DiscoveryStyle.sectionTitleText}>News</Text>
        <FlatList
          contentContainerStyle={{backgroundColor: Colors.black}}
          data={this.state.news}
          numColumns={3}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderNewsItem}
          removeClippedSubviews={false}
          scrollEnabled={false}
        />
      </View>
    );
  }
  
  rebderPagination() {
    
  }

  render() {
    return (
      this.state.isConnected ? <View style={DiscoveryStyle.container}>
        {!this.state.isLoading && this.renderSearchbar()}
        {!this.state.showSearchResults && (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={
                  this.state.isRefreshing // style={ProfileStyle.container}
                }
                colors={[Colors.primary]}
                progressBackgroundColor={Colors.black}
                tintColor={Colors.primary}
                onRefresh={this.onPageRefresh.bind(this)}
              />
            }
          >
            {this.state.isLoading && this.renderActivityIndicator()}
            {!this.state.isLoading && this.renderTrending()}
            {!this.state.isLoading && this.renderLovedStrains()}
            {!this.state.isLoading && this.renderNews()}
          </ScrollView>
          )
        }
        {this.state.showSearchResults && this.state.searchResults.length > 0 && this.renderSearchResults()}
        {this.state.showSearchResults && this.state.searchResults.length == 0 && this.renderEmptySearchResults()}
      </View> : <NoNetworkView />
    );
  }
}

Discovery.navigationOptions = ({ navigation }) => ({
  title: 'DISCOVERY',
  headerTitleStyle: Styles.headerTitleStyle,
  headerStyle: Styles.headerStyle,
  headerLeft: (
    <TouchableOpacity
      style={Styles.headerLeftContainer}
      onPress={() => {
        navigation.state.params.headerLeftAction();
      }}
      activeOpacity={1}
      onPressIn={() => navigation.state.params.headerLeftActionPressIn()}
      onPressOut={() => navigation.state.params.headerLeftActionPressOut()}
    >
      <Image
        style={[Styles.headerLeftImage, DiscoveryStyle.headerRightImage]}
        source={
          navigation.state.params ? navigation.state.params.headerLeftActive
            ? Images.homeHeaderLeftActive
            : Images.homeHeaderLeftInActive
            : Images.homeHeaderLeftInActive
        } //User Images.homeHeaderLeftActive for the selected image
      />
    </TouchableOpacity>
  ),
  headerRight: <Text />
});

const mapStateToProps = ({ authReducer }) => {
  const { userData, token } = authReducer;
  return { userData, token };
};
export default connect(mapStateToProps, {
  setUserData,
  setToken,
})(Discovery);
