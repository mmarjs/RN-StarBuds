import React, { Component } from 'react';
import { CachedImage } from "react-native-cached-image";
import { Dimensions, Image, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Images, Colors, Styles } from '../../theme';
import { TabNavigator, NavigationActions, TabBarTop } from 'react-navigation';
import { connect } from 'react-redux';
import Config from 'react-native-config'
import Share, {ShareSheet, Button} from 'react-native-share';
import FindBudsTabNavigator from './FindBudsTabNavigator';
import Buds from "./Buds/Buds";
import Featured from "./Featured/Featured";

import { FindBudsStyle } from "./FindBudsStyle";

const screenHeight = Dimensions.get("window").height;
const backAction = NavigationActions.back({ key: null })
const shareOptions = {
  title: "Download Starbuds",
  message: "I am inviting you to join Starbuds. You can download it from App Store or Google Play.",
  url:  Platform.OS === "ios" ? Config.APP_STORE_URL : Config.PLAY_STORE_URL, //
  subject: "Share Link For Starbuds" //  for email
};

class FindBuds extends React.Component {
  constructor(props) {
    super(props);
    this.openShare = this.openShare.bind(this);
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
      visible: false
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      openShare: this.openShare,
    });
  }

  openShare() {
    Share.open(shareOptions);
    // this.onOpen(); //To open customised share sheet
  }

  onCancel() {
    this.setState({visible:false});
  }
  onOpen() {
    this.setState({visible:true});
  }

  render () {
    return <View style={{ flex: 1 }}>
      <FindBudsTabNavigator />
      {/* <ShareSheet visible={this.state.visible} onCancel={this.onCancel.bind(this)}>
          <Button 
            iconSrc={Images.TWITTER_ICON}
            onPress={()=>{
              this.onCancel();
              setTimeout(() => {
                Share.shareSingle(Object.assign(shareOptions, {
                  "social": "twitter"
                }));
              },300);
            }}>Twitter</Button>
          <Button 
            iconSrc={Images.FACEBOOK_ICON}
            onPress={()=>{
              this.onCancel();
              setTimeout(() => {
                Share.shareSingle(Object.assign(shareOptions, {
                  "social": "facebook"
                }));
              },300);
            }}>Facebook</Button>
          <Button 
              iconSrc={Images.WHATSAPP_ICON}
              onPress={()=>{
              this.onCancel();
              setTimeout(() => {
                Share.shareSingle(Object.assign(shareOptions, {
                  "social": "whatsapp"
                }));
              },300);
            }}>Whatsapp</Button>
          <Button 
              iconSrc={Images.EMAIL_ICON}
              onPress={()=>{
              this.onCancel();
              setTimeout(() => {
                Share.shareSingle(Object.assign(shareOptions, {
                  "social": "email"
                }));
              },300);
            }}>Email</Button>
        </ShareSheet> */}
    </View>
  }
}

FindBuds.navigationOptions = ({ navigation }) => ({
  title: "FIND BUDS",
  headerTitleStyle: Styles.headerTitleStyle,
  headerStyle: Styles.headerStyle,
  tabBarIcon: ({ focused }) => {
    if (navigation.state.params.profileImageUrl != "") {
      if (focused) {
        return (
          <Image
            style={[FindBudsStyle.iconImage, FindBudsStyle.iconBorderWidth]}
            source={{ uri: navigation.state.params.profileImageUrl }}
            defaultSource={Images.defaultUser}
          />
        );
      }
      return (
        <Image
          style={FindBudsStyle.iconImage}
          source={{ uri: navigation.state.params.profileImageUrl }}
          defaultSource={Images.defaultUser}
        />
      );
    } else {
      if (focused) {
        return (
          <Image
            style={[FindBudsStyle.iconImage, styles.iconBorderWidth]}
            source={Images.defaultUser}
          />
        );
      }
      return (
        <Image style={FindBudsStyle.iconImage} source={Images.defaultUser} />
      );
    }
  },
  headerLeft: (
    <TouchableOpacity
      onPress={() => {
        // navigation.state.params.findBudsBackAction() ? navigation.state.params.findBudsBackAction() : null;
        navigation.dispatch(backAction);
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
  ),
  headerRight: (
    <TouchableOpacity
      onPress={() => {
        navigation.state.params.openShare();
      }}
      style={Styles.headerRightContainer}
      activeOpacity={0.5}
    >
      <Image
        source={Images.findBudsHeaderIcon}
        style={[
          Styles.headerRightImage,
          {
            height: 17.3,
            width: 17.3
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
export default connect(mapStateToProps, {})(FindBuds);
