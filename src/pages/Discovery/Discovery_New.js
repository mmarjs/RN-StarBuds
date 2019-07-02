import React, { Component } from 'react';
import {  NetInfo,StyleSheet,
  FlatList,  TouchableHighlight,
  TouchableOpacity,  ActivityIndicator
  , TouchableWithoutFeedback,Text, View, Image, ScrollView, DeviceEventEmitter, StatusBar, ImageBackground ,Animated} from 'react-native';
import { NavigationActions } from "react-navigation";
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import { Button } from './../../components';
import { DiscoveryStyle_New } from './DiscoveryStyle_New';
import { Images, Colors } from './../../theme';
import { Dimensions } from 'react-native';
import { getData } from './../../services/StorageService';
import { navigateTo } from '../../services/CommonFunctions';
import { apiCall, logoutFromFacebook } from "./../../services/AuthService";
import { Styles } from '../../theme';
import { CachedImage } from "react-native-cached-image";
import ParsedText from 'react-native-parsed-text';
import Icon from "react-native-vector-icons/MaterialIcons";
import { calculateTimeDuration } from "./../../services/CommonFunctions";
import FeedVideo from "../../components/FeedVideo/FeedVideo";
import { isIPhoneX } from '../../services/CommonFunctions';
import { Pages } from 'react-native-pages';
import Carousel from 'react-native-snap-carousel';
import { NoNetworkView } from '../../components';
import ShareActionSheet from "./../../components/ActionSheet/ShareActionSheet";
import SharePostModal from "./../SharePostModal/SharePostModal";

import {
  ParallaxSwiper,
  ParallaxSwiperPage
} from "react-native-parallax-swiper";

import {
  KeyboardAwareScrollView,
  KeyboardAwareListView
} from "react-native-keyboard-aware-scrollview";
import {
  setUserData,
  setToken
} from '../../actions';
// import console = require('console');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const { width, height } = Dimensions.get("window");

var activePageIndex = 0;

const backAction = NavigationActions.back({
  key: null
});
class Discovery_New extends Component {

  constructor(props) {
    super(props);
    this.state = {
      entries: [
        { title: 'hello' },
        { title: 'world' },
        { title: 'world' },
        { title: 'world' },
        { title: 'world' }
      ],
      createAccountPressStatus: false,
      logInPressStatus: false,
      disableCreateAccount: false,
      disableLogin: false,
      isActivityIndicator: true,
      postsSativa1: [],
      postsSativa2: [],
      postsBuBytes1: [],
      postsBuBytes2: [],
      postsBlezing1: [],
      postsBlezing2: [],
      postsDispensry1: [],
      postsDispensry2: [],
      postsMarker1: [],
      postsMarker2: [],
      isSaPhoto : true,
      isBuPhoto : true,
      isBlePhoto : true,
      isDisPhoto : true,
      isMarPhoto : true,
      modalVisible: false,

      txtCountSa : '-',
      txtCountBu : '-',
      txtCountBle : '-',
      txtCountDis : '-',
      txtCountMar : '-',

      indexOfScroll : 0,

    };

    DeviceEventEmitter.addListener('backToGetStart', (e) => {
      this.setState({
        disableCreateAccount: false,
        disableLogin: false
      });
    });
  }

  gotoProfile = post => {
    if (post.userDetail[0]._id === this.props.userData._id) {
      // Navigate to Profile
      navigateTo(this.props.navigation, 'Profile');
    } else {
      navigateTo(this.props.navigation, 'OtherProfile', {
        profileId: post.userDetail[0]._id,
        profileName: post.userDetail[0].name,
        from: "Home"
      });
    }
  };

  savePost(index, post) {
    var newArray = [];
    if (activePageIndex == 0) {
        if (this.state.isSaPhoto == true) {
          newArray = this.state.postsSativa1
          newArray[index].postSavedOrNot = true;
          this.setState({ postsSativa1: newArray });
        }
        else {
          newArray = this.state.postsSativa2
          newArray[index].postSavedOrNot = true;
          this.setState({ postsSativa2: newArray });
        }
    }
    else if (activePageIndex == 1) {
      if (this.state.isBuPhoto == true) {
        newArray = this.state.postsBuBytes1
        newArray[index].postSavedOrNot = true;
        this.setState({ postsBuBytes1: newArray });
      }
      else {
        newArray = this.state.postsBuBytes2
        newArray[index].postSavedOrNot = true;
        this.setState({ postsBuBytes2: newArray });
      }
    }
    else if (activePageIndex == 2) {
      if (this.state.isBlePhoto == true) {
        newArray = this.state.postsBlezing1
        newArray[index].postSavedOrNot = true;
        this.setState({ postsBlezing1: newArray });
      }
      else {
        newArray = this.state.postsBlezing2
        newArray[index].postSavedOrNot = true;
        this.setState({ postsBlezing2: newArray });
      }
    }
    else if (activePageIndex == 3) {
      if (this.state.isDisPhoto == true) {
        newArray = this.state.postsDispensry1
        newArray[index].postSavedOrNot = true;
        this.setState({ postsDispensry1: newArray });
      }
      else {
        newArray = this.state.postsDispensry2
        newArray[index].postSavedOrNot = true;
        this.setState({ postsDispensry2: newArray });
      }
    }
    else if (activePageIndex == 4) {
      if (this.state.isMarPhoto == true) {
        newArray = this.state.postsMarker1
        newArray[index].postSavedOrNot = true;
        this.setState({ postsMarker1: newArray });
      }
      else {
        newArray = this.state.postsMarker2
        newArray[index].postSavedOrNot = true;
        this.setState({ postsMarker2: newArray });
      }
    }
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
          DeviceEventEmitter.emit('refreshSaved', {});
        }
      })
      .catch(error => {
        // add code to show that the post is saved
      });
  }

  unsavePost(index, post) {
    
    var newArray = [];
    if (activePageIndex == 0) {
        if (this.state.isSaPhoto == true) {
          newArray = this.state.postsSativa1
          newArray[index].postSavedOrNot = false;
          this.setState({ postsSativa1: newArray });
        }
        else {
          newArray = this.state.postsSativa2
          newArray[index].postSavedOrNot = false;
          this.setState({ postsSativa2: newArray });
        }
    }
    else if (activePageIndex == 1) {
      if (this.state.isBuPhoto == true) {
        newArray = this.state.postsBuBytes1
        newArray[index].postSavedOrNot = false;
        this.setState({ postsBuBytes1: newArray });
      }
      else {
        newArray = this.state.postsBuBytes2
        newArray[index].postSavedOrNot = false;
        this.setState({ postsBuBytes2: newArray });
      }
    }
    else if (activePageIndex == 2) {
      if (this.state.isBlePhoto == true) {
        newArray = this.state.postsBlezing1
        newArray[index].postSavedOrNot = false;
        this.setState({ postsBlezing1: newArray });
      }
      else {
        newArray = this.state.postsBlezing2
        newArray[index].postSavedOrNot = false;
        this.setState({ postsBlezing2: newArray });
      }
    }
    else if (activePageIndex == 3) {
      if (this.state.isDisPhoto == true) {
        newArray = this.state.postsDispensry1
        newArray[index].postSavedOrNot = false;
        this.setState({ postsDispensry1: newArray });
      }
      else {
        newArray = this.state.postsDispensry2
        newArray[index].postSavedOrNot = false;
        this.setState({ postsDispensry2: newArray });
      }
    }
    else if (activePageIndex == 4) {
      if (this.state.isMarPhoto == true) {
        newArray = this.state.postsMarker1
        newArray[index].postSavedOrNot = false;
        this.setState({ postsMarker1: newArray });
      }
      else {
        newArray = this.state.postsMarker2
        newArray[index].postSavedOrNot = false;
        this.setState({ postsMarker2: newArray });
      }
    }

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
          DeviceEventEmitter.emit('refreshSaved', {});
        }
      })
      .catch(error => {
        // add code to show that the post is saved
      });
  }

  openShareOptions = post => {
    this.setState(
      {
        postIdURL: `${Metrics.serverUrl}post/${post._id}`,
        postIdForSharing: post._id,
        postByUserId: post.user
      },
      () => {
        this.actionSheet.show();
      }
    );
  };
  getUserPermis
  handleRefresh = () => {
    this.setState(
      {
        pageNo: 0,
        refreshing: true
      },
      () => {
        this.getPosts(0);
      }
    );
  };

  goToSignUp(navigation) {
    // navigateTo(this.props.navigation, 'FindFacebookFriends');
    navigateTo(this.props.navigation, 'SignUp');
  }

  goToLogin(navigation) {
    navigateTo(this.props.navigation, 'Login');
  }

  renderLogo() {
    return (
      <View style={DiscoveryStyle_New.group1}>
        <Image
          style={DiscoveryStyle_New.headerImage}
          source={Images.white_image}
        />
      </View>
    );
  }

  getSativaPosts(page) {
    const data = {
      userId: this.props.userData._id,
      // pageNo: page
      "hashTagName": 'sativa'
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/searchHashTagPost", data, headers)
      .then(response => {
        let tempPosts = new Array(),
          tempPosts2 = new Array(),
          postObj,          postObj2;
          
        if (page == 0) {
          if (response.result.posts.length == 0) {
            this.setState({
              posts:[],
              // isActivityIndicator: false,
              // refreshing: false
            });
          } else if (response.result.posts.length == 1) {
            let mediaArr1 = new Array(),
              mediaArr2 = new Array();
              postObj = Object.create(response.result.posts[0]);
              postObj2 = Object.create(response.result.posts[0]);
              postObj.showTag = false;
              postObj2.showTag = false;
            for (var i = 0; i < postObj.medias.length; i++) {
              if (postObj.medias[i].mediaType == 2){
                  mediaArr2.push(postObj.medias[i]);
              }
              if (postObj.medias[i].mediaType == 1){
                mediaArr1.push(postObj.medias[i]);
              }
            }
            if (mediaArr1.length > 0) {
              postObj.medias = mediaArr1;
              tempPosts.push(postObj);
            }
            if (mediaArr2.length > 0) {
              postObj.medias = mediaArr2;
              tempPosts2.push(postObj);
            }
          
          this.setState({
            txtCountSa : '' + (tempPosts.length + tempPosts2.length),
            // isActivityIndicator: false,
            postsSativa1: tempPosts,
            postsSativa2: tempPosts2,
          });

          } else if (response.result.posts.length > 1) {
            for (let i = 0; i < response.result.posts.length; i++) {
              let mediaArr1 = new Array(),
              mediaArr2 = new Array();
              postObj = Object.create(response.result.posts[i]);
              postObj2 = Object.create(response.result.posts[i]);
              postObj.showTag = false;
              postObj2.showTag = false;
              for (var j = 0; j < postObj.medias.length; j++) {
                if (postObj.medias[j].mediaType == 2){
                    mediaArr2.push(postObj.medias[j]);
                }
                else if (postObj.medias[j].mediaType == 1){
                  mediaArr1.push(postObj.medias[j]);
                }
              }
              if (mediaArr1.length > 0) {
                postObj.medias = mediaArr1;
                tempPosts.push(postObj);
              }
              if (mediaArr2.length > 0) {
                postObj2.medias = mediaArr2;
                tempPosts2.push(postObj2);
              }
            }
            this.setState({
              txtCountSa : '' + (tempPosts.length + tempPosts2.length),
              // isActivityIndicator: false,
              postsSativa1: tempPosts,
              postsSativa2: tempPosts2,
            });
          }
        } else {

          for (let i = 0; i < response.result.posts.length; i++) {
            postObj = response.result.posts[i];
            postObj.showTag = false;
            tempPosts.push(postObj);
          }
          tempData = this.state.posts.concat(tempPosts);
          this.setState({
            // isActivityIndicator: false,
            posts: tempData,
            // refreshing: false,
            // loadingMore: false
          });
        }
        if (response.result.nextPageAvailable) {
          this.setState({ nextPageAvailable: true });
        } else {
          this.setState({ nextPageAvailable: false });
        }
      })
      .catch(error => {
        this.setState({
          // isActivityIndicator: false,
          isError: true
        });
        if (
          error.message ==
          "You are not authorized. Token required to access the API."
        ) {
          alert(
            "Session Expired",
            "Please login again. Your session has expired."
          );
          deleteUser("user");
          this.props.setUserData("");
          this.props.setToken("");
          navigateTo(navigation, 'GetStart')
        } else if(error == 'no network') {
          this.setState({ isConnected: false });
        }
      });
  }

  getBUDBITESPosts(page) {
    const data = {
      userId: this.props.userData._id,
      // pageNo: page
      "hashTagName": 'budbites'
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/searchHashTagPost", data, headers)
      .then(response => {
        let tempPosts = new Array(),
          tempPosts2 = new Array(),
          postObj,          postObj2;
        if (page == 0) {
          if (response.result.posts.length == 0) {
            this.setState({
              posts:[],
              // isActivityIndicator: false,
              // refreshing: false
            });
          } else if (response.result.posts.length == 1) {
            let mediaArr1 = new Array(),
              mediaArr2 = new Array();
              postObj = Object.create(response.result.posts[0]);
              postObj2 = Object.create(response.result.posts[0]);
              postObj.showTag = false;
              postObj2.showTag = false;
            for (var i = 0; i < postObj.medias.length; i++) {
              if (postObj.medias[i].mediaType == 2){
                  mediaArr2.push(postObj.medias[i]);
              }
              else if (postObj.medias[i].mediaType == 1){
                mediaArr1.push(postObj.medias[i]);
              }
            }
            if (mediaArr1.length > 0) {
              postObj.medias = mediaArr1;
              tempPosts.push(postObj);
            }
            if (mediaArr2.length > 0) {
              postObj2.medias = mediaArr2;
              tempPosts2.push(postObj2);
            }
          
          this.setState({
            txtCountBu : '' + (tempPosts.length + tempPosts2.length),
            // isActivityIndicator: false,
            postsBuBytes1: tempPosts,
            postsBuBytes2: tempPosts2,
          });

          } else if (response.result.posts.length > 1) {
            for (let i = 0; i < response.result.posts.length; i++) {
              let mediaArr1 = new Array(),
              mediaArr2 = new Array();
              postObj = Object.create(response.result.posts[i]);
              postObj2 = Object.create(response.result.posts[i]);
              postObj.showTag = false;
              postObj2.showTag = false;
              for (var j = 0; j < postObj.medias.length; j++) {
                if (postObj.medias[j].mediaType == 2){
                    mediaArr2.push(postObj.medias[j]);
                }
                else if (postObj.medias[j].mediaType == 1){
                  mediaArr1.push(postObj.medias[j]);
                }
              }
              if (mediaArr1.length > 0) {
                postObj.medias = mediaArr1;
                tempPosts.push(postObj);
              }
              if (mediaArr2.length > 0) {
                postObj2.medias = mediaArr2;
                tempPosts2.push(postObj2);
              }
            }
            this.setState({
              txtCountBu : '' + (tempPosts.length + tempPosts2.length),
              // isActivityIndicator: false,
              postsBuBytes1: tempPosts,
              postsBuBytes2: tempPosts2,
            });
          }
        } else {
          for (let i = 0; i < response.result.posts.length; i++) {
            postObj = response.result.posts[i];
            postObj.showTag = false;
            tempPosts.push(postObj);
          }
          tempData = this.state.posts.concat(tempPosts);
          this.setState({
            // isActivityIndicator: false,
            posts: tempData,
            // refreshing: false,
            // loadingMore: false
          });
        }
        if (response.result.nextPageAvailable) {
          this.setState({ nextPageAvailable: true });
        } else {
          this.setState({ nextPageAvailable: false });
        }
      })
      .catch(error => {
        this.setState({
          // isActivityIndicator: false,
          isError: true
        });
        if (
          error.message ==
          "You are not authorized. Token required to access the API."
        ) {
          alert(
            "Session Expired",
            "Please login again. Your session has expired."
          );
          deleteUser("user");
          this.props.setUserData("");
          this.props.setToken("");
          navigateTo(navigation, 'GetStart')
        } else if(error == 'no network') {
          this.setState({ isConnected: false });
        }
      });
  }

  getBLAZINGNEWSPosts(page) {
    const data = {
      userId: this.props.userData._id,
      // pageNo: pageBlazingnews
      "hashTagName": 'blazingnews'
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/searchHashTagPost", data, headers)
      .then(response => {
        let tempPosts = new Array(),
          tempPosts2 = new Array(),
          postObj,          postObj2;
        if (page == 0) {
          if (response.result.posts.length == 0) {
            this.setState({
              posts:[],
              // isActivityIndicator: false,
              // refreshing: false
            });
          } else if (response.result.posts.length == 1) {
            let mediaArr1 = new Array(),
              mediaArr2 = new Array();
              postObj = Object.create(response.result.posts[0]);
              postObj2 = Object.create(response.result.posts[0]);
              postObj.showTag = false;
              postObj2.showTag = false;
            for (var i = 0; i < postObj.medias.length; i++) {
              if (postObj.medias[i].mediaType == 2){
                  mediaArr2.push(postObj.medias[i]);
              }
              else if (postObj.medias[i].mediaType == 1){
                mediaArr1.push(postObj.medias[i]);
              }
            }
            if (mediaArr1.length > 0) {
              postObj.medias = mediaArr1;
              tempPosts.push(postObj);
            }
            if (mediaArr2.length > 0) {
              postObj2.medias = mediaArr2;
              tempPosts2.push(postObj2);
            }
          
          this.setState({
            txtCountBle : '' + (tempPosts.length + tempPosts2.length),
            // isActivityIndicator: false,
            postsBlezing1: tempPosts,
            postsBlezing2: tempPosts2,
          });

          } else if (response.result.posts.length > 1) {
            for (let i = 0; i < response.result.posts.length; i++) {
              let mediaArr1 = new Array(),
              mediaArr2 = new Array();
              postObj = Object.create(response.result.posts[i]);
              postObj2 = Object.create(response.result.posts[i]);
              postObj.showTag = false;
              postObj2.showTag = false;
              for (var j = 0; j < postObj.medias.length; j++) {
                if (postObj.medias[j].mediaType == 2){
                    mediaArr2.push(postObj.medias[j]);
                }
                else if (postObj.medias[j].mediaType == 1){
                  mediaArr1.push(postObj.medias[j]);
                }
              }
              if (mediaArr1.length > 0) {
                postObj.medias = mediaArr1;
                tempPosts.push(postObj);
              }
              if (mediaArr2.length > 0) {
                postObj2.medias = mediaArr2;
                tempPosts2.push(postObj2);
              }
            }
            this.setState({
              txtCountBle : '' + (tempPosts.length + tempPosts2.length),
              // isActivityIndicator: false,
              postsBlezing1: tempPosts,
              postsBlezing2: tempPosts2,
            });
          }
        } else {

          for (let i = 0; i < response.result.posts.length; i++) {
            postObj = response.result.posts[i];
            postObj.showTag = false;
            tempPosts.push(postObj);
          }
          tempData = this.state.posts.concat(tempPosts);
          this.setState({
            // isActivityIndicator: false,
            posts: tempData,
            // refreshing: false,
            // loadingMore: false
          });
        }
        if (response.result.nextPageAvailable) {
          this.setState({ nextPageAvailable: true });
        } else {
          this.setState({ nextPageAvailable: false });
        }
      })
      .catch(error => {
        this.setState({
          // isActivityIndicator: false,
          isError: true
        });
        if (
          error.message ==
          "You are not authorized. Token required to access the API."
        ) {
          alert(
            "Session Expired",
            "Please login again. Your session has expired."
          );
          deleteUser("user");
          this.props.setUserData("");
          this.props.setToken("");
          navigateTo(navigation, 'GetStart')
        } else if(error == 'no network') {
          this.setState({ isConnected: false });
        }
      });
  }

  getDISPENSARYPosts(page) {
    const data = {
      userId: this.props.userData._id,
      // pageNo: page ISPENSARY
      "hashTagName": 'dispensary'
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/searchHashTagPost", data, headers)
      .then(response => {
        let tempPosts = new Array(),
          tempPosts2 = new Array(),
          postObj,          postObj2;
          
        if (page == 0) {
          if (response.result.posts.length == 0) {
            this.setState({
              posts:[],
              // isActivityIndicator: false,
              // refreshing: false
            });
          } else if (response.result.posts.length == 1) {
            let mediaArr1 = new Array(),
            mediaArr2 = new Array();
            postObj = Object.create(response.result.posts[0]);
            postObj2 = Object.create(response.result.posts[0]);
            postObj.showTag = false;
            postObj2.showTag = false;
            
            for (var i = 0; i < postObj.medias.length; i++) {
              if (postObj.medias[i].mediaType == 2){
                  mediaArr2.push(postObj.medias[i]);
              }
              if (postObj.medias[i].mediaType == 1){
                mediaArr1.push(postObj.medias[i]);
              }
            }
            if (mediaArr1.length > 0) {
              postObj.medias = mediaArr1;
              tempPosts.push(postObj);
            }
            if (mediaArr2.length > 0) {
              postObj2.medias = mediaArr2;
              tempPosts2.push(postObj2);
            }
          
          this.setState({
            txtCountDis : '' + (tempPosts.length + tempPosts2.length),
            // isActivityIndicator: false,
            postsDispensry1: tempPosts,
            postsDispensry2: tempPosts2,
          });

          } else if (response.result.posts.length > 1) {
            for (let i = 0; i < response.result.posts.length; i++) {
              let mediaArr1 = new Array(),
              mediaArr2 = new Array();
              postObj = Object.create(response.result.posts[i]);
              postObj2 = Object.create(response.result.posts[i]);
              postObj.showTag = false;
              postObj2.showTag = false;
              for (var j = 0; j < postObj.medias.length; j++) {
                if (postObj.medias[j].mediaType == 2){
                    mediaArr2.push(postObj.medias[j]);
                }
                else if (postObj.medias[j].mediaType == 1){
                  mediaArr1.push(postObj.medias[j]);
                }
              }
              if (mediaArr1.length > 0) {
                postObj.medias = mediaArr1;
                tempPosts.push(postObj);
              }
              if (mediaArr2.length > 0) {
                postObj2.medias = mediaArr2;
                tempPosts2.push(postObj2);
              }
            }
            this.setState({
              txtCountDis : '' + (tempPosts.length + tempPosts2.length),
              // isActivityIndicator: false,
              postsDispensry1: tempPosts,
              postsDispensry2: tempPosts2,
            });
          }
        } else {

          for (let i = 0; i < response.result.posts.length; i++) {
            postObj = response.result.posts[i];
            postObj.showTag = false;
            tempPosts.push(postObj);
          }
          tempData = this.state.posts.concat(tempPosts);
          this.setState({
            // isActivityIndicator: false,
            posts: tempData,
            // refreshing: false,
            // loadingMore: false
          });
        }
        if (response.result.nextPageAvailable) {
          this.setState({ nextPageAvailable: true });
        } else {
          this.setState({ nextPageAvailable: false });
        }
      })
      .catch(error => {
        this.setState({
          // isActivityIndicator: false,
          isError: true
        });
        if (
          error.message ==
          "You are not authorized. Token required to access the API."
        ) {
          alert(
            "Session Expired",
            "Please login again. Your session has expired."
          );
          deleteUser("user");
          this.props.setUserData("");
          this.props.setToken("");
          navigateTo(navigation, 'GetStart')
        } else if(error == 'no network') {
          this.setState({ isConnected: false });
        }
      });
  }

  getMarketPosts(page) {

    const data = {
      userId: this.props.userData._id,
      // pageNo: page
      "hashTagName": 'market'
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/searchHashTagPost", data, headers)
      .then(response => {

        let tempPosts = new Array(),
          tempPosts2 = new Array(),
          postObj,          postObj2;
          
        if (page == 0) {
          if (response.result.posts.length == 0) {
            this.setState({
              posts:[],
              isActivityIndicator: false,
              // refreshing: false
            });
          } else if (response.result.posts.length == 1) {
            let mediaArr1 = new Array(),
              mediaArr2 = new Array();
              postObj = Object.create(response.result.posts[0]);
              postObj2 = Object.create(response.result.posts[0]);
              postObj.showTag = false;
              postObj2.showTag = false;
            
            for (var i = 0; i < postObj.medias.length; i++) {
              if (postObj.medias[i].mediaType == 2){
                  mediaArr2.push(postObj.medias[i]);
              }
              if (postObj.medias[i].mediaType == 1){
                mediaArr1.push(postObj.medias[i]);
              }
            }
            if (mediaArr1.length > 0) {
              postObj.medias = mediaArr1;
              tempPosts.push(postObj);
            }
            if (mediaArr2.length > 0) {
              postObj2.medias = mediaArr2;
              tempPosts2.push(postObj2);
            }
          
          this.setState({
            txtCountMar : '' + (tempPosts.length + tempPosts2.length),

            isActivityIndicator: false,
            postsMarker1: tempPosts,
            postsMarker2: tempPosts2,
          });

          } else if (response.result.posts.length > 1) {
            for (let i = 0; i < response.result.posts.length; i++) {
              let mediaArr1 = new Array(),
              mediaArr2 = new Array();
              postObj = Object.create(response.result.posts[i]);
              postObj2 = Object.create(response.result.posts[i]);
              postObj.showTag = false;
              postObj2.showTag = false;
              for (var j = 0; j < postObj.medias.length; j++) {
                if (postObj.medias[j].mediaType == 2){
                    mediaArr2.push(postObj.medias[j]);
                }
                else if (postObj.medias[j].mediaType == 1){
                  mediaArr1.push(postObj.medias[j]);
                }
              }
              if (mediaArr1.length > 0) {
                postObj.medias = mediaArr1;
                tempPosts.push(postObj);
              }
              if (mediaArr2.length > 0) {
                postObj2.medias = mediaArr2;
                tempPosts2.push(postObj2);
              }
            }
            this.setState({
              txtCountMar : '' + (tempPosts.length + tempPosts2.length),

              isActivityIndicator: false,
              postsMarker1: tempPosts,
              postsMarker2: tempPosts2,
            });
          }
        } else {

          for (let i = 0; i < response.result.posts.length; i++) {
            postObj = response.result.posts[i];
            postObj.showTag = false;
            tempPosts.push(postObj);
          }
          tempData = this.state.posts.concat(tempPosts);
          this.setState({
            isActivityIndicator: false,
            posts: tempData,
            // refreshing: false,
            // loadingMore: false
          });
        }
        if (response.result.nextPageAvailable) {
          this.setState({ nextPageAvailable: true });
        } else {
          this.setState({ nextPageAvailable: false });
        }
      })
      .catch(error => {
        this.setState({
          isActivityIndicator: false,
          isError: true
        });
        if (
          error.message ==
          "You are not authorized. Token required to access the API."
        ) {
          alert(
            "Session Expired",
            "Please login again. Your session has expired."
          );
          deleteUser("user");
          this.props.setUserData("");
          this.props.setToken("");
          navigateTo(navigation, 'GetStart')
        } else if(error == 'no network') {
          this.setState({ isConnected: false });
        }
      });
  }


  _keyExtractor = (item, index) => item._id;


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
              {this.renderImage(
                imageData,
                "contain",
                post.taggedPeoples,
                post,
                index
              )}
            </TouchableWithoutFeedback>
          </View>
        );
      } else {
        return this.renderVideo(imageData);
      }
    });
  }

  renderMedias(post, postIndex) {
    // images, taggedPeoples, postIndex, post
    if (post.medias.length > 1) {
      return (
        <Swiper
          style={{ height: screenHeight / 1.8 + 18 }}
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
        return (
          <TouchableWithoutFeedback
            onPress={() => {
              // this.updateTag(postIndex);
            }}
          >
            {this.renderImage(
              post.medias[0],
              "contain",
              post.taggedPeoples,
              post
            )}
          </TouchableWithoutFeedback>
        );
      } else {
        return this.renderVideo(post.medias[0]);
      }
    }
  }

  renderImage(imageData, resizeMode, taggedPeoples, post, imageIndex) {
    if (taggedPeoples.length > 0) {
      return (
        <CachedImage
          key={imageData._id}
          style={DiscoveryStyle_New.imageInList}
          source={{ uri: imageData.mediaUrl }}
          defaultSource={Images.placeHolder}
          fallbackSource={Images.placeHolder}
          activityIndicatorProps={{ display: "none", opacity: 0 }}
          resizeMode={"cover"}
        >
          {post.showTag &&
            this.renderTag(
              imageData,
              taggedPeoples,
              imageIndex ? imageIndex : 0
            )}
        </CachedImage>
      );
    } else {
      return (
        <CachedImage
          key={imageData._id}
          style={DiscoveryStyle_New.imageInList}
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
        videoContainerStyle={DiscoveryStyle_New.videoContainer}
        ContainerStyles={DiscoveryStyle_New}
        imageData={imageData}
      />
    );
  }

  renderListItem = ({ item, index }) => {
    return (
     <View style={DiscoveryStyle_New.imageInListContainer}>
       <View style={DiscoveryStyle_New.imageTopDetails}>
         <View style={Styles.profileImageForPostContainerInFeed}>
           <CachedImage
             style={Styles.profileImageForPostInFeed}
             source={{ uri: item.userDetail[0].profileImageUrl }}
             defaultSource={Images.defaultUser}
             fallbackSource={Images.defaultUser}
             activityIndicatorProps={{ display: "none", opacity: 0 }}
           />
         </View>
         <View style={Styles.listItemTitleInFeed}>
           <TouchableWithoutFeedback onPress={() => this.gotoProfile(item)}>
             <View>
               <Text style={Styles.listItemTitleUsernameInFeed}>
                 {item.userDetail[0].username}
               </Text>
             </View>
           </TouchableWithoutFeedback>
           {item.location.title ? item.location.title != "" : item.location.description != "" && (
             <Text
               numberOfLines={1}
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
           onPress={() => this.openShareOptions(item)}
           style={Styles.threeHorizontalDotsContainerInFeed}
         >
           <Image
             source={Images.threeHorizontalDots}
             style={Styles.threeHorizontalDotsInFeed}
           />
         </TouchableOpacity>
       </View>
       {this.renderMedias(item, index)}
       <View style={DiscoveryStyle_New.imageBottomDetailsBottom}>
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
                 style={[Styles.feedActionCommentContainer,{right:2}]}
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
                 onPress={() => this.savePost(index, item._id)}
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
                 onPress={() => this.unsavePost(index, item._id)}
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
             {item.userDetail[0].username + " "}{" "}
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
                 childrenProps={{allowFontScaling: false}}
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
                 {item.userDetail[0].username + " "}{" "}
                 {item.caption != "" && (
                   // <Text style={Styles.captionTextInFeed}>{item.caption}</Text>
                    <ParsedText
                      style={Styles.captionTextInFeed}
                      parse={
                        [
                          { pattern: /@([a-zA-Z0-9.,_]+)(?:^|[ ])/, style: { color: Colors.primary }, onPress: this.handleMentionsUser},
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
         <View style={Styles.durationTextContainerInFeed}>
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

 likePost(index, post) {
  var newArray = [];
  if (activePageIndex == 0) {
      if (this.state.isSaPhoto == true) {
        newArray = this.state.postsSativa1
        newArray[index].likedOrNot = true;
        newArray[index].totalLikes = newArray[index].totalLikes + 1;
        this.setState({ postsSativa1: newArray });
      }
      else {
        newArray = this.state.postsSativa2
        newArray[index].likedOrNot = true;
        newArray[index].totalLikes = newArray[index].totalLikes + 1;
        this.setState({ postsSativa2: newArray });
      }
  }
  else if (activePageIndex == 1) {
    if (this.state.isBuPhoto == true) {
      newArray = this.state.postsBuBytes1
      newArray[index].likedOrNot = true;
      newArray[index].totalLikes = newArray[index].totalLikes + 1;
      this.setState({ postsBuBytes1: newArray });
    }
    else {
      newArray = this.state.postsBuBytes2
      newArray[index].likedOrNot = true;
      newArray[index].totalLikes = newArray[index].totalLikes + 1;
      this.setState({ postsBuBytes2: newArray });
    }
  }
  else if (activePageIndex == 2) {
    if (this.state.isBlePhoto == true) {
      newArray = this.state.postsBlezing1
      newArray[index].likedOrNot = true;
      newArray[index].totalLikes = newArray[index].totalLikes + 1;
      this.setState({ postsBlezing1: newArray });
    }
    else {
      newArray = this.state.postsBlezing2
      newArray[index].likedOrNot = true;
      newArray[index].totalLikes = newArray[index].totalLikes + 1;
      this.setState({ postsBlezing2: newArray });
    }
  }
  else if (activePageIndex == 3) {
    if (this.state.isDisPhoto == true) {
      newArray = this.state.postsDispensry1
      newArray[index].likedOrNot = true;
      newArray[index].totalLikes = newArray[index].totalLikes + 1;
      this.setState({ postsDispensry1: newArray });
    }
    else {
      newArray = this.state.postsDispensry2
      newArray[index].likedOrNot = true;
      newArray[index].totalLikes = newArray[index].totalLikes + 1;
      this.setState({ postsDispensry2: newArray });
    }
  }
  else if (activePageIndex == 4) {
    if (this.state.isMarPhoto == true) {
      newArray = this.state.postsMarker1
      newArray[index].likedOrNot = true;
      newArray[index].totalLikes = newArray[index].totalLikes + 1;
      this.setState({ postsMarker1: newArray });
    }
    else {
      newArray = this.state.postsMarker2
      newArray[index].likedOrNot = true;
      newArray[index].totalLikes = newArray[index].totalLikes + 1;
      this.setState({ postsMarker2: newArray });
    }
  }
  
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
        // console.log('emitted refreshProfileFeed')
        // DeviceEventEmitter.emit('refreshProfileFeed', {});
      } else {
      }
    })
    .catch(error => {});
}
commentOnPost(post, from, index) {
  this.setState({ commentPostIndex: index });
    this.props.navigation.navigate("AddComment", {
      post: post,
      currentUser: this.props.userData,
      postOwner: post.userDetail[0],
      from: "Home",
      openKeyboard: from,
      commentCount: post.totalComments,
      changeCommentCount: this.changeCommentCount
    });
  }
  toggleModalVisibility = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  };

  sharePost = post => {
    this.setState(
      {
        shareInChatPost: post
      },
      () => {
        this.toggleModalVisibility();
      }
    );
}
disLikePost(index, post) {
  
  var newArray = [];
  if (activePageIndex == 0) {
      if (this.state.isSaPhoto == true) {
        newArray = this.state.postsSativa1
        newArray[index].likedOrNot = false;
        newArray[index].totalLikes = newArray[index].totalLikes - 1;
        this.setState({ postsSativa1: newArray });
      }
      else {
        newArray = this.state.postsSativa2
        newArray[index].likedOrNot = false;
        newArray[index].totalLikes = newArray[index].totalLikes - 1;
        this.setState({ postsSativa2: newArray });
      }
  }
  else if (activePageIndex == 1) {
    if (this.state.isBuPhoto == true) {
      newArray = this.state.postsBuBytes1
      newArray[index].likedOrNot = false;
      newArray[index].totalLikes = newArray[index].totalLikes - 1;
      this.setState({ postsBuBytes1: newArray });
    }
    else {
      newArray = this.state.postsBuBytes2
      newArray[index].likedOrNot = false;
      newArray[index].totalLikes = newArray[index].totalLikes - 1;
      this.setState({ postsBuBytes2: newArray });
    }
  }
  else if (activePageIndex == 2) {
    if (this.state.isBlePhoto == true) {
      newArray = this.state.postsBlezing1
      newArray[index].likedOrNot = false;
      newArray[index].totalLikes = newArray[index].totalLikes - 1;
      this.setState({ postsBlezing1: newArray });
    }
    else {
      newArray = this.state.postsBlezing2
      newArray[index].likedOrNot = false;
      newArray[index].totalLikes = newArray[index].totalLikes - 1;
      this.setState({ postsBlezing2: newArray });
    }
  }
  else if (activePageIndex == 3) {
    if (this.state.isDisPhoto == true) {
      newArray = this.state.postsDispensry1
      newArray[index].likedOrNot = false;
      newArray[index].totalLikes = newArray[index].totalLikes - 1;
      this.setState({ postsDispensry1: newArray });
    }
    else {
      newArray = this.state.postsDispensry2
      newArray[index].likedOrNot = false;
      newArray[index].totalLikes = newArray[index].totalLikes - 1;
      this.setState({ postsDispensry2: newArray });
    }
  }
  else if (activePageIndex == 4) {
    if (this.state.isMarPhoto == true) {
      newArray = this.state.postsMarker1
      newArray[index].likedOrNot = false;
      newArray[index].totalLikes = newArray[index].totalLikes - 1;
      this.setState({ postsMarker1: newArray });
    }
    else {
      newArray = this.state.postsMarker2
      newArray[index].likedOrNot = false;
      newArray[index].totalLikes = newArray[index].totalLikes - 1;
      this.setState({ postsMarker2: newArray });
    }
  }

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
        console.log('emitted refreshProfileFeed')
        // DeviceEventEmitter.emit('refreshProfileFeed', {});
      } else {
      }
    })
    .catch(error => {});
}

newTestCool(index){
  this.setState({indexOfScroll : index})
}

  renderButtons() {
    return (
      <View style={DiscoveryStyle_New.group3}>
        <Button
          onPress={() => {
            this.goToSignUp(this.props.navigation);
          }}
          style={{ backgroundColor: Colors.clearTransparent, height: 30}}
        >
          <Text
            style=
              {{color: 'white'}}
          >SKIP
        </Text>
        </Button>
      </View>
    );
  }
  componentDidMount(){
    NetInfo.isConnected.fetch().then(isConnected => {
      isConnected ? this.getSativaPosts(0) : this.setState({ isConnected: false, isLoading: false });
      isConnected ? this.getBLAZINGNEWSPosts(0) : this.setState({ isConnected: false, isLoading: false });
      isConnected ? this.getBUDBITESPosts(0) : this.setState({ isConnected: false, isLoading: false });
      isConnected ? this.getDISPENSARYPosts(0) : this.setState({ isConnected: false, isLoading: false });
      isConnected ? this.getMarketPosts(0) : this.setState({ isConnected: false, isLoading: false });
    });
  }
  renderActivityIndicator () {
    return (
      <ActivityIndicator
        animating
        size="large"
        style={DiscoveryStyle_New.activityindicatorStyle}
        color={Colors.primary}
      />
    )
  }


myCustomAnimatedValue = new Animated.Value(3);

getPageTransformStyle = index => ({

});


  render() {
    return (
      <View style={DiscoveryStyle_New.container}>

       
        {(this.state.isActivityIndicator == true) ?

        <ActivityIndicator
          animating
          size="large"
          style={DiscoveryStyle_New.activityindicatorStyle}
          color={Colors.primary}
        />
          :

        <ParallaxSwiper
        speed={0.22}
        animatedValue={this.myCustomAnimatedValue}
        dividerWidth={0}
        dividerColor="black"
        backgroundColor= {Colors.clearTransparent}
        onMomentumScrollEnd={activePageIndex => 
          this.newTestCool(activePageIndex)
        }
        scrollToIndex = {this.state.indexOfScroll}
        showProgressBar={false}
        progressBarBackgroundColor="rgba(0,0,0,0.25)"
        progressBarValueBackgroundColor="white"
      >
      
        <ParallaxSwiperPage
          BackgroundComponent={
            <Image
              style={styles.backgroundImage}
              source={Images.Savita_D}
            />
          }
          ForegroundComponent={
            
              <View style={DiscoveryStyle_New.slide1}>
                   <ScrollView
                      ////keyboardDismissMode="interactive"
                      //keyboardShouldPersistTaps={"always"}
                      bounces = {false}
                      ref='_scrollView'
                      contentInsetAdjustmentBehavior = {'always'}
                      contentOffset = {{x: 0, y: isIPhoneX() ? -42 : 0}}
                      contentContainerStyle={{ marginTop: -20 }}
                 >
                <View 
                  style={DiscoveryStyle_New.imageContainer}
                />
                <TouchableOpacity
                  onPress={() => {       
                    // this.props.navigation.dispatch(backAction)
                  }}
                  activeOpacity={0.5}
        
                  style={{ position: 'absolute',
                    top: screenHeight * (isIPhoneX() ? 0.07 : 0.09),
                    left: screenWidth * 0.07,
                    width : 38, height : 48
                  }}
                  onPressIn={() => {this.setState({ headerLeftSelected: true });}}
                  onPressOut={() => {this.setState({ headerLeftSelected: false });}}
                >
                {/* <Image
                  source={Images.backButton}
                  style={[Styles.headerLeftImage, { height: 15, width: 8, tintColor : 'white' }]}
                /> */}
                </TouchableOpacity>
                 <Image 
                    style={{ position: 'absolute',
                    top: screenHeight * (isIPhoneX() ? 0.30 : 0.32),
                    left: screenWidth * 0.10,
                    width : 50, height : 45, tintColor : 'white'}}
                    source={Images.discoveryIconsStrains}
                   />
                  <Animated.Text 
                    style={[DiscoveryStyle_New.AnimatedTextStyle, this.getPageTransformStyle(0)]}
                  >#SATIVA</Animated.Text>
        
                <Text style={{
                    position: 'absolute',
                    top: screenHeight * (isIPhoneX() ? 0.48 : 0.50),
                    left: screenWidth * 0.10,
                    width : '80%', height : 60,
                    fontFamily: 'SourceSansPro-Bold',
                    fontSize: 12,
                    color :'white',
                    textAlign: 'left',
                    alignItems: 'center',
                  }}>Sativa cannabis plants have thinner leaves and longer
                  flowering cycles than their indica counterparts.</Text>
        
                <TouchableOpacity style = {{ position: 'absolute',top: screenHeight * ( isIPhoneX() ? 0.56 : 0.58),
                    left: screenWidth * 0.10,flex: 1, flexDirection: 'row'}}>
                      <Image
                          style={{width: 24, height: 24, alignItems : 'center'}}
                          source={Images.barChart}
                      />
                     <Text style={{marginTop : 5,marginLeft : 20,fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white', width : '82%', height : 25}}>STATS</Text>
               </TouchableOpacity>
        
               <TouchableOpacity style = {{ position: 'absolute',top: screenHeight * (isIPhoneX() ? 0.63 : 0.68),
                    left: screenWidth * 0.10,flex: 1, flexDirection: 'column',width : 100}}>
                      <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 16, color : 'white', width : '82%', height : 25}}>{this.state.txtCountSa}</Text>
                     <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white', width : '82%', height : 25}}>POSTS</Text>
               </TouchableOpacity>
        
        
                <View style = {{ position: 'absolute',top: screenHeight * (isIPhoneX() ? 0.71 : 0.80),
                    left: screenWidth * 0.10,flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                       onPress={() => {  
                          this.setState({ isSaPhoto: true });
                        }}
                    >
                    <View 
                      style={{
                      width : 70, height : 27,flex: 1, flexDirection: 'column'}}>
                       <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white'}}>Photos</Text>
                       <View style={{marginTop : 10,width : 20,height : 3, backgroundColor : this.state.isSaPhoto ? Colors.primary : Colors.clearTransparent}}></View>
                      </View>
                  </TouchableOpacity>
        
                  <TouchableOpacity
                       onPress={() => {  
                          this.setState({ isSaPhoto: false });
                        }}
                    >
                    <View 
                      style={{
                      width : 70, height : 27,flex: 1, flexDirection: 'column'}}>
                       <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white'}}>Videos</Text>
                       <View style={{marginTop : 10,width : 20,height : 3, backgroundColor : this.state.isSaPhoto ? Colors.clearTransparent : Colors.primary}}></View>
                    </View>
                  </TouchableOpacity>
        
              </View>
        
              <FlatList 
                      style={{ marginTop : isIPhoneX() ? -70 : -60,borderRadius: 20}}
                      data={this.state.isSaPhoto ?  this.state.postsSativa1 : this.state.postsSativa2}
                      numColumns={1}
//                      keyExtractor={this._keyExtractor}
                      renderItem={this.renderListItem}
                      //onEndReachedThreshold={0.1}
                      // ref={ref => {
                      //   this.flatListRef = ref;
                      // }}
                />
                </ScrollView>
              </View>
            
          }
        />

        <ParallaxSwiperPage
          BackgroundComponent={
            <Image
              style={styles.backgroundImage}
              source={Images.buddyBite}
            />
          }
          ForegroundComponent={
              <View style={DiscoveryStyle_New.slide1}>
                   <ScrollView
                bounces = {false}
                ////keyboardDismissMode="interactive"
                //keyboardShouldPersistTaps={"always"}
                ////contentContainerStyle={{ marginTop: 0}}
                contentInsetAdjustmentBehavior = {'always'}
                contentOffset = {{x: 0, y: isIPhoneX() ? -42 : 0}}
                contentContainerStyle={{ marginTop: -20 }}
        
                ref='_scrollView2'
        
                >
                <View 
                  style={DiscoveryStyle_New.imageContainer}
                />
                 <TouchableOpacity
                  onPress={() => {       
                    // this.props.navigation.dispatch(backAction)
                  }}
                  activeOpacity={0.5}
        
                  style={{ position: 'absolute',
                    top: screenHeight * (isIPhoneX() ? 0.07 : 0.09),
                    left: screenWidth * 0.07,
                    width : 38, height : 48
                  }}
                  onPressIn={() => {this.setState({ headerLeftSelected: true });}}
                  onPressOut={() => {this.setState({ headerLeftSelected: false });}}
                >
                {/* <Image
                  source={Images.backButton}
                  style={[Styles.headerLeftImage, { height: 15, width: 8, tintColor : 'white' }]}
                /> */}
                </TouchableOpacity>
                 <Image 
                    style={{ position: 'absolute',
                    top: screenHeight * (isIPhoneX() ? 0.30 : 0.32),
                    left: screenWidth * 0.10,
                    width : 50, height : 50, tintColor : 'white'}}
                    source={Images.discoveryIconsBudbites}
                   />

                   <Animated.Text 
                    style={[DiscoveryStyle_New.AnimatedTextStyle, this.getPageTransformStyle(1)]}>
                    #BUDBITES</Animated.Text>
        
                <Text style={{
                    position: 'absolute',
                    top: screenHeight * 0.48,
                    left: screenWidth * 0.10,
                    width : '80%', height : 60,
                    fontFamily: 'SourceSansPro-Bold',
                    fontSize: 12,
                    color :'white',
                    textAlign: 'left',
                    alignItems: 'center',
                  }}>The go-to spot for finding all the best cannabis infused recipes on Starbuds.</Text>
        
                <TouchableOpacity style = {{ position: 'absolute',top: screenHeight * (isIPhoneX() ? 0.56 :0.58),
                    left: screenWidth * 0.10,flex: 1, flexDirection: 'row'}}>
                      <Image
                          style={{width: 24, height: 24, alignItems : 'center'}}
                          source={Images.barChart}
                      />
                     <Text style={{marginTop : 5,marginLeft : 20,fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white', width : '82%', height : 25}}>STATS</Text>
               </TouchableOpacity>
        
               <TouchableOpacity style = {{ position: 'absolute',top: screenHeight * (isIPhoneX() ? 0.63 : 0.68),
                    left: screenWidth * 0.10,flex: 1, flexDirection: 'column',width : 100}}>
                      <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 16, color : 'white', width : '82%', height : 25}}>{this.state.txtCountBu}</Text>
                     <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white', width : '82%', height : 25}}>POSTS</Text>
               </TouchableOpacity>
        
               
               <View style = {{ position: 'absolute',top: screenHeight * (isIPhoneX() ? 0.71 : 0.80),
                    left: screenWidth * 0.10,flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                       onPress={() => {  
                          this.setState({ isBuPhoto: true });
                        }}
                    >
                    <View 
                      style={{
                      width : 70, height : 27,flex: 1, flexDirection: 'column'}}>
                       <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white'}}>Photos</Text>
                       <View style={{marginTop : 10,width : 20,height : 3, backgroundColor : this.state.isBuPhoto ? Colors.primary : Colors.clearTransparent}}></View>
                      </View>
                  </TouchableOpacity>
        
                  <TouchableOpacity
                       onPress={() => {  
                          this.setState({ isBuPhoto: false });
                        }}
                    >
                    <View 
                      style={{
                      width : 70, height : 27,flex: 1, flexDirection: 'column'}}>
                       <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white'}}>Videos</Text>
                       <View style={{marginTop : 10,width : 20,height : 3, backgroundColor : this.state.isBuPhoto ? Colors.clearTransparent : Colors.primary}}></View>
                    </View>
                  </TouchableOpacity>
        
              </View>
        
        
              <FlatList 
                      style={{ marginTop : (isIPhoneX() ? -70 : -60),borderRadius: 20}}
                      data={this.state.isBuPhoto ?  this.state.postsBuBytes1 : this.state.postsBuBytes2}
                      numColumns={1}
//                      keyExtractor={this._keyExtractor}
                      renderItem={this.renderListItem}
                      //onEndReachedThreshold={0.1}
                      // ref={ref => {
                      //   this.flatListRef = ref;
                      // }}
                />
                </ScrollView>
              </View>
          }
        />

        <ParallaxSwiperPage
          BackgroundComponent={
            <Image
              style={styles.backgroundImage}
              source={Images.Bazzling}
            />
          }
          ForegroundComponent={
            
              <View style={DiscoveryStyle_New.slide1}>
                   <ScrollView
                           bounces = {false}
                           contentInsetAdjustmentBehavior = {'always'}
                           contentContainerStyle={{ marginTop: -20 }}
        
                ref='_scrollView3'
                contentOffset = {{x: 0, y: isIPhoneX() ? -42 : 0}}
        
                >
                <View 
                  style={DiscoveryStyle_New.imageContainer}
                />
                 <TouchableOpacity
                  onPress={() => {       
                    // this.props.navigation.dispatch(backAction)
                  }}
                  activeOpacity={0.5}
        
                  style={{ position: 'absolute',
                    top: screenHeight * (isIPhoneX() ? 0.07 : 0.09),
                    left: screenWidth * 0.07,
                    width : 38, height : 48
                  }}
                  onPressIn={() => {this.setState({ headerLeftSelected: true });}}
                  onPressOut={() => {this.setState({ headerLeftSelected: false });}}
                >
                {/* <Image
                  source={Images.backButton}
                  style={[Styles.headerLeftImage, { height: 15, width: 8, tintColor : 'white' }]}
                /> */}
                </TouchableOpacity>
                 <Image 
                    style={{ position: 'absolute',
                    top: screenHeight * (isIPhoneX() ? 0.30 : 0.32),
                    left: screenWidth * 0.10,
                    width : 38, height : 48, tintColor : 'white'}}
                    source={Images.discoveryIconsNews}
                   />

                  <Animated.Text 
                    style={[DiscoveryStyle_New.AnimatedTextStyle, this.getPageTransformStyle(2)]}
                  >#BLAZINGNEWS</Animated.Text>
        
                <Text style={{
                    position: 'absolute',
                    top: screenHeight * (isIPhoneX() ? 0.48 : 0.50),
                    left: screenWidth * 0.10,
                    width : '80%', height : 60,
                    fontFamily: 'SourceSansPro-Bold',
                    fontSize: 12,
                    color :'white',
                    textAlign: 'left',
                    alignItems: 'center',
                  }}>The best source for reading all the latest cannabis related news on Starbuds.</Text>
        
                <TouchableOpacity style = {{ position: 'absolute',top: screenHeight *  (isIPhoneX() ? 0.56 : 0.58),
                    left: screenWidth * 0.10,flex: 1, flexDirection: 'row'}}>
                      <Image
                          style={{width: 24, height: 24, alignItems : 'center'}}
                          source={Images.barChart}
                      />
                     <Text style={{marginTop : 5,marginLeft : 20,fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white', width : '82%', height : 25}}>STATS</Text>
               </TouchableOpacity>
        
               <TouchableOpacity style = {{ position: 'absolute',top: screenHeight * (isIPhoneX() ? 0.63 : 0.68),
                    left: screenWidth * 0.10,flex: 1, flexDirection: 'column',width : 100}}>
                      <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 16, color : 'white', width : '82%', height : 25}}>{this.state.txtCountBle}</Text>
                     <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white', width : '82%', height : 25}}>POSTS</Text>
               </TouchableOpacity>
        
        
               <View style = {{ position: 'absolute',top: screenHeight * (isIPhoneX() ? 0.71 : 0.80),
                    left: screenWidth * 0.10,flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                       onPress={() => {  
                          this.setState({ isBlePhoto: true });
                        }}
                    >
                    <View 
                      style={{
                      width : 70, height : 27,flex: 1, flexDirection: 'column'}}>
                       <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white'}}>Photos</Text>
                       <View style={{marginTop : 10,width : 20,height : 3, backgroundColor : this.state.isBlePhoto ? Colors.primary : Colors.clearTransparent}}></View>
                      </View>
                  </TouchableOpacity>
        
                  <TouchableOpacity
                       onPress={() => {  
                          this.setState({ isBlePhoto: false });
                        }}
                    >
                    <View 
                      style={{
                      width : 70, height : 27,flex: 1, flexDirection: 'column'}}>
                       <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white'}}>Videos</Text>
                       <View style={{marginTop : 10,width : 20,height : 3, backgroundColor : this.state.isBlePhoto ? Colors.clearTransparent : Colors.primary}}></View>
                    </View>
                  </TouchableOpacity>
        
              </View>
        
        
              <FlatList 
                      style={{ marginTop : (isIPhoneX() ? -70 : -60),borderRadius: 20}}
                      data={this.state.isBlePhoto ?  this.state.postsBlezing1 : this.state.postsBlezing2}
                      numColumns={1}
//                      keyExtractor={this._keyExtractor}
                      renderItem={this.renderListItem}
                      //onEndReachedThreshold={0.1}
                      // ref={ref => {
                      //   this.flatListRef = ref;
                      // }}
                />
              </ScrollView>
              </View>
            
          }
        />

      <ParallaxSwiperPage
          BackgroundComponent={
            <Image
              style={styles.backgroundImage}
              source={Images.Dispenary}
            />
          }
          ForegroundComponent={
              <View style={DiscoveryStyle_New.slide1}>
                   <ScrollView
                           bounces = {false}
                           ref='_scrollView4'
                           contentInsetAdjustmentBehavior = {'always'}
                           contentOffset = {{x: 0, y: isIPhoneX() ? -42 : 0}}
                           contentContainerStyle={{ marginTop: -20 }}
                >
                <View 
                  style={DiscoveryStyle_New.imageContainer}
                  source={Images.Dispenary}
                />
                 <TouchableOpacity
                  onPress={() => {       
                    // this.props.navigation.dispatch(backAction)
                  }}
                  activeOpacity={0.5}
        
                  style={{ position: 'absolute',
                    top: screenHeight * (isIPhoneX() ? 0.07 : 0.09),
                    left: screenWidth * 0.07,
                    width : 38, height : 48
                  }}
                  onPressIn={() => {this.setState({ headerLeftSelected: true });}}
                  onPressOut={() => {this.setState({ headerLeftSelected: false });}}
                >
                {/* <Image
                  source={Images.backButton}
                  style={[Styles.headerLeftImage, { height: 15, width: 8, tintColor : 'white' }]}
                /> */}
                </TouchableOpacity>
                 <Image 
                    style={{ position: 'absolute',
                    top: screenHeight * (isIPhoneX() ? 0.30 : 0.32),
                    left: screenWidth * 0.10,
                    width : 38, height : 48, tintColor : 'white'}}
                    source={Images.discoveryIconsDispensary}
                   />

                  <Animated.Text 
                    style={[DiscoveryStyle_New.AnimatedTextStyle, this.getPageTransformStyle(3)]}
                  >#DISPENSARY</Animated.Text>
        
                <Text style={{
                    position: 'absolute',
                    top: screenHeight * (isIPhoneX() ? 0.48 : 0.50),
                    left: screenWidth * 0.10,
                    width : '80%', height : 60,
                    fontFamily: 'SourceSansPro-Bold',
                    fontSize: 12,
                    color :'white',
                    textAlign: 'left',
                    alignItems: 'center',
                  }}>The most exclusive, top grade, cannabis dispensaries around the country.</Text>
        
                <TouchableOpacity style = {{ position: 'absolute',top: screenHeight * (isIPhoneX() ? 0.56 : 0.58),
                    left: screenWidth * 0.10,flex: 1, flexDirection: 'row'}}>
                      <Image
                          style={{width: 24, height: 24, alignItems : 'center'}}
                          source={Images.barChart}
                      />
                     <Text style={{marginTop : 5,marginLeft : 20,fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white', width : '82%', height : 25}}>STATS</Text>
               </TouchableOpacity>
        
               <TouchableOpacity style = {{ position: 'absolute',top: screenHeight * (isIPhoneX() ? 0.63 : 0.68),
                    left: screenWidth * 0.10,flex: 1, flexDirection: 'column',width : 100}}>
                      <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 16, color : 'white', width : '82%', height : 25}}>{this.state.txtCountDis}</Text>
                     <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white', width : '82%', height : 25}}>POSTS</Text>
               </TouchableOpacity>
        
               <View style = {{ position: 'absolute',top: screenHeight * (isIPhoneX() ? 0.71 : 0.80),
                    left: screenWidth * 0.10,flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                       onPress={() => {  
                          this.setState({ isDisPhoto: true });
                        }}
                    >
                    <View 
                      style={{
                      width : 70, height : 27,flex: 1, flexDirection: 'column'}}>
                       <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white'}}>Photos</Text>
                       <View style={{marginTop : 10,width : 20,height : 3, backgroundColor : this.state.isDisPhoto ? Colors.primary : Colors.clearTransparent}}></View>
                      </View>
                  </TouchableOpacity>
        
                  <TouchableOpacity
                       onPress={() => {  
                          this.setState({ isDisPhoto: false });
                        }}
                    >
                    <View 
                      style={{
                      width : 70, height : 27,flex: 1, flexDirection: 'column'}}>
                       <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white'}}>Videos</Text>
                       <View style={{marginTop : 10,width : 20,height : 3, backgroundColor : this.state.isDisPhoto ? Colors.clearTransparent : Colors.primary}}></View>
                    </View>
                  </TouchableOpacity>
        
              </View>
        
              <FlatList 
                      style={{ marginTop : (isIPhoneX() ? -70 : -60),borderRadius: 20}}
                      data={this.state.isDisPhoto ?  this.state.postsDispensry1 : this.state.postsDispensry2}
                      numColumns={1}
//                      keyExtractor={this._keyExtractor}
                      renderItem={this.renderListItem}
                      ////onEndReachedThreshold={0.1}
                      // ref={ref => {
                      //   this.flatListRef = ref;
                      // }}
                />
                </ScrollView>
              </View>
            
          }
        />

        
      <ParallaxSwiperPage
          BackgroundComponent={
            <Image
              style={styles.backgroundImage}
              source={Images.market_Bg}
            />
          }
          ForegroundComponent={
              <View style={DiscoveryStyle_New.slide1}>
                   <ScrollView
                           bounces = {false}
                           ref='_scrollView5'
                           contentInsetAdjustmentBehavior = {'always'}
                           contentOffset = {{x: 0, y: isIPhoneX() ? -42 : 0}}
                           contentContainerStyle={{ marginTop: -20 }}
      
                           >
                <View 
                  style={DiscoveryStyle_New.imageContainer}
                />
                 <TouchableOpacity
                  onPress={() => {       
                    // this.props.navigation.dispatch(backAction)
                  }}
                  activeOpacity={0.5}
        
                  style={{ position: 'absolute',
                    top: screenHeight * (isIPhoneX() ? 0.07 : 0.09),
                    left: screenWidth * 0.07,
                    width : 38, height : 48
                  }}
                  onPressIn={() => {this.setState({ headerLeftSelected: true });}}
                  onPressOut={() => {this.setState({ headerLeftSelected: false });}}
                >
                {/* <Image
                  source={Images.backButton}
                  style={[Styles.headerLeftImage, { height: 15, width: 8, tintColor : 'white' }]}
                /> */}
                </TouchableOpacity>
                 <Image 
                    style={{ position: 'absolute',
                    top: screenHeight * (isIPhoneX() ? 0.30 : 0.32),
                    left: screenWidth * 0.10,
                    width : 46, height : 44, tintColor : 'white'}}
                    source={Images.star}
                   />
                

                <Animated.Text 
                    style={[DiscoveryStyle_New.AnimatedTextStyle, this.getPageTransformStyle(4)]}>#MARKET</Animated.Text>
        
                <Text style={{
                    position: 'absolute',
                    top: screenHeight * (isIPhoneX() ? 0.48 : 0.50),
                    left: screenWidth * 0.10,
                    width : '80%', height : 60,
                    fontFamily: 'SourceSansPro-Bold',
                    fontSize: 12,
                    color :'white',
                    textAlign: 'left',
                    alignItems: 'center',
                  }}>A convenient destination on Starbuds to discover new items with people in the community.</Text>
        
                <TouchableOpacity style = {{ position: 'absolute',top: screenHeight * (isIPhoneX() ? 0.56 : 0.58),
                    left: screenWidth * 0.10,flex: 1, flexDirection: 'row'}}>
                      <Image
                          style={{width: 24, height: 24, alignItems : 'center'}}
                          source={Images.barChart}
                      />
                     <Text style={{marginTop : 5,marginLeft : 20,fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white', width : '82%', height : 25}}>STATS</Text>
               </TouchableOpacity>
        
               <TouchableOpacity style = {{ position: 'absolute',top: screenHeight * (isIPhoneX() ? 0.63 : 0.68),
                    left: screenWidth * 0.10,flex: 1, flexDirection: 'column',width : 100}}>
                      <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 16, color : 'white', width : '82%', height : 25}}>{this.state.txtCountMar}</Text>
                     <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white', width : '82%', height : 25}}>POSTS</Text>
               </TouchableOpacity>
        
               <View style = {{ position: 'absolute',top: screenHeight * (isIPhoneX() ? 0.71 : 0.80),
                  left: screenWidth * 0.10,flex: 1, flexDirection: 'row'}}>
                  <TouchableOpacity
                     onPress={() => {  
                        this.setState({ isMarPhoto: true });
                      }}
                  >
                  <View 
                    style={{
                    width : 70, height : 27,flex: 1, flexDirection: 'column'}}>
                     <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white'}}>Photos</Text>
                     <View style={{marginTop : 10,width : 20,height : 3, backgroundColor : this.state.isMarPhoto ? Colors.primary : Colors.clearTransparent}}></View>
                    </View>
                </TouchableOpacity>
      
                <TouchableOpacity
                     onPress={() => {  
                        this.setState({ isMarPhoto: false });
                      }}
                  >
                  <View 
                    style={{
                    width : 70, height : 27,flex: 1, flexDirection: 'column'}}>
                     <Text style={{fontFamily: 'SourceSansPro-Bold',fontSize: 14, color : 'white'}}>Videos</Text>
                     <View style={{marginTop : 10,width : 20,height : 3, backgroundColor : this.state.isMarPhoto ? Colors.clearTransparent : Colors.primary}}></View>
                  </View>
                </TouchableOpacity>
      
            </View>
        
              <FlatList 
                    style={{ marginTop : (isIPhoneX() ? -70 : -60),borderRadius: 20}}
                    data={this.state.isMarPhoto ?  this.state.postsMarker1 : this.state.postsMarker2}
                      numColumns={1}
//                      keyExtractor={this._keyExtractor}
                      renderItem={this.renderListItem}
                      //onEndReachedThreshold={0.1}
                      // ref={ref => {
                      //   this.flatListRef = ref;
                      // }}
                />
                </ScrollView>
              </View>
            
          }
        />

      </ParallaxSwiper>
        }
       
        {/* {this.renderLogo()} */}
        {/* {this.renderButtons()} */}
        {/* <View style={DiscoveryStyle_New.group3}> */}
        <ShareActionSheet
          {...this.props}
          postByUserId={this.state.postByUserId}
          getActionSheetRef={this.getActionSheetRef}
          postIdURL={this.state.postIdURL}
          postIdForSharing={this.state.postIdForSharing}
        />
        <SharePostModal
          {...this.props}
          modalVisible={this.state.modalVisible}
          post={this.state.shareInChatPost}
          toggleModalVisibility={this.toggleModalVisibility}
        />
      </View>
      // </View>
    );
  }
}

Discovery_New.navigationOptions = {
  header: null
};

const mapStateToProps = ({ authReducer }) => {
  const { userData, token } = authReducer;
  return { userData, token };
};
export default connect(mapStateToProps, {
  setUserData,
  setToken,
})(Discovery_New);

const styles = StyleSheet.create({
  backgroundImage: {
    width : screenWidth,
    height : screenWidth * (isIPhoneX() ? 1.7813333333 : 1.7813333333)
  },
  foregroundTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  foregroundText: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: 0.41,
    color: "white"
  }
});