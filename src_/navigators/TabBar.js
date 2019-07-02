import React, {Component} from 'react';
import {
  DeviceEventEmitter,
  Image,
  NetInfo,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Platform
} from 'react-native';
import {CachedImage} from 'react-native-cached-image';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import {Images, Colors} from '../theme';
import {alert} from '../services/AlertsService';
import {getData} from '../services/StorageService';

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.isNavigateToAddPhoto = true;
    this.state = {
      isNewActivity: false,
      currentIndex: 0,
      currentIndexForHomeFeedRefresh: 0,
      isAddPhotoActive: false,
    }
  }

  componentWillMount() {
    DeviceEventEmitter.addListener('updateActivityStatus', e => {
      this.setState({isNewActivity: e})
    })
  }

  renderItem = (route, index) => {
    const {navigation, jumpToIndex} = this.props;
    const isAddPhoto = route.routeName === 'AddPhoto';
    // const focused = index === this.state.currentIndex;
    const focused = index === navigation.state.index;
    const imageArray = [
      'Tab1',
      'Tab2',
      'Tab3',
      'Tab4',
      'Tab5',
      'homeTabSelected',
      'searchTabSelected',
      'addPhotoTabSelected',
      'activityTabSelected',
      'profileTabSelected'
    ];

    const image = focused
      ? Images[imageArray[index]]
      : Images[imageArray[index]];
    let tabIconStyle = {
      height: 24,
      width: 24
    };
    if (index == 0) {
      tabIconStyle = styles.homeIcon;
    } else if (index == 1) {
      tabIconStyle = styles.searchIcon;
    } else if (index == 2) {
      tabIconStyle = styles.addPhotoIcon;
    } else if (index == 3) {
      tabIconStyle = styles.activityIcon;
    }
    /*
        Get User Proile pic
    */
    return (index == 2 && (
      <TouchableWithoutFeedback 
        key={route.key} style={styles.tab}
        onPress={() => {
          if(this.isNavigateToAddPhoto){
            this.isNavigateToAddPhoto = false;
            setTimeout(()=>{
              this.isNavigateToAddPhoto = true
            },2000)
            this.setState({isAddPhotoActive: true});
            setTimeout(() => {
              this.setState({isAddPhotoActive: false})
            }, 200);
            NetInfo
              .isConnected
              .fetch()
              .then(isConnected => {
                if (isConnected) {
                  this
                    .props
                    .navigation
                    .dispatch(NavigationActions.navigate({routeName: 'AddPhotoModal'}))
                } else {
                  alert('No Internet Connection', 'Please check your internet connection.');
                }
              });
          }
        }}
      >
        <View style={styles.tab}>
          <View style={styles.tabView}>
            <Image style={tabIconStyle} source={this.state.isAddPhotoActive ? Images['addPhotoTabSelected'] : Images['addPhotoTab']}/>
          </View>
        </View>
      </TouchableWithoutFeedback>
    ) || (
      <TouchableWithoutFeedback
        key={route.key}
        style={styles.tab}
        onPress={() => {
          this.setState({currentIndexForHomeFeedRefresh: index})
          jumpToIndex(index)
          if (this.state.currentIndex == this.state.currentIndexForHomeFeedRefresh) {
            if (this.state.currentIndex == 0) {
              DeviceEventEmitter.emit('scrollHomePageToTop', null)
            } else if (this.state.currentIndex == 4) {
              DeviceEventEmitter.emit('scrollProfilePageToTop', null)
            }
          }
        }}
        onPressIn={() => {this.setState({currentIndex: index})}}
      >
        <View style={styles.tab}>
          <View style={styles.tabView}>
            {(index != 4 && ((index == 3 && this.state.isNewActivity && (
              <View style={styles.activityIconWrapper}>
                <Image style={tabIconStyle} source={image}/>
              </View>
            )) || <Image style={tabIconStyle} source={image}/>)) || ((focused && (
              <View style={[styles.profileIconImage, styles.iconBorderWidth]}>
                <CachedImage
                  style={styles.profileIconImage}
                  source={{
                  uri: this.props.userData.thumbnail
                    ? this.props.userData.thumbnail
                    : this.props.userData.profileImageUrl
                }}
                  defaultSource={Images.defaultUser}
                  fallbackSource={Images.defaultUser}
                  activityIndicatorProps={{
                  display: 'none',
                  opacity: 0
                }}
                  resizeMode={'cover'}/>
              </View>
            )) || (<CachedImage
              style={styles.profileIconImage}
              source={{
              uri: this.props.userData.thumbnail
                ? this.props.userData.thumbnail
                : this.props.userData.profileImageUrl
            }}
              defaultSource={Images.defaultUser}
              fallbackSource={Images.defaultUser}
              activityIndicatorProps={{
              display: 'none',
              opacity: 0
            }}
              resizeMode={'cover'}/>))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    ));
  };

  render() {
    const {navigation} = this.props;
    const {routes} = navigation.state;
    return (
      <View style={styles.tabBar}>{routes && routes.map(this.renderItem)}</View>
    );
  }
}

const mapStateToProps = ({authReducer}) => {
  const {userData} = authReducer;
  return {userData};
};
export default connect(mapStateToProps, {})(TabBar);

const styles = StyleSheet.create({
  tabBar: {
    height: 49,
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    backgroundColor: '#FFFFFF',
    alignItems: 'center'
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15
  },
  tabView: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  homeIcon: {
    width: 21.3,
    height: 24
  },
  searchIcon: {
    width: 23.7,
    height: 23.7
  },
  addPhotoIcon: {
    width: 24,
    height: 24
  },
  activityIcon: {
    width: 27.3,
    height: 24.3
  },
  profileIconImage: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderColor: Colors.primary
  },
  iconBorderWidth: {
    height: Platform.OS == 'android'
      ? 25
      : 24,
    width: Platform.OS == 'android'
      ? 25
      : 24,
    borderRadius: Platform.OS == 'android'
      ? 12.5
      : 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  activityIconWrapper: {
    width: 24,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary
  }
});