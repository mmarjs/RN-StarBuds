import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
  Platform,
  DeviceEventEmitter
} from "react-native";
import { CachedImage } from "react-native-cached-image";
import { TabNavigator, NavigationActions } from "react-navigation";
import Swiper from "react-native-swiper";
import { Card, CardSection, Button, CustomPicker } from "../../components";
import { Images, Colors, Styles, Metrics } from "../../theme";
import { PhotoTagsStyle } from "./PhotoTagsStyle";
import { connect } from "react-redux";
import _ from "lodash";
import {
  updateLoading,
  setTaggedPeople,
  setTaggedPeopleForCompare
} from "../../actions";
import { navigateTo } from '../../services/CommonFunctions';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const backAction = NavigationActions.back({
  key: null
});
class PhotoTags extends Component {
  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params.chooseMultipleImage;
    this.state = {
      images: [],
      updateTaggedPeople: false,
      taggedPeople: []
    };
    this.top = "";
    this.left = "";
    this.lastIndex = "";
    this.taggedPeoples = this.props.navigation.state.params.taggedPeople ? this.props.navigation.state.params.taggedPeople : [];
    this.medias = [];
    this.tempMedias = [];
    this.choose_multiple_image = [];
    for(let i = 0; i<params.length;i++){
      if (params[i].isType == 'image' || params[i].isType == 'camera'){
        let tempData = params[i];
        tempData.index = i
        this.choose_multiple_image.push(tempData);
      }
    }
    console.log("choose_multiple_image", this.choose_multiple_image)
  }

  componentWillMount() {
    DeviceEventEmitter.addListener("taggedPeople", e => {
      this.setState({ taggedPeople: e });
    });
    this.setState({ taggedPeople: this.props.taggedPeople });
  }
  //  componentWillReceiveProps(_data){
  //
  //    // received props from TagPeople
  //    let data = _data.friendList;
  //    if(data){
  //      let tempData = {};
  //      tempData.username = data.username;
  //      tempData.user = data._id;
  //      tempData.locationY = this.top;
  //      tempData.locationX = this.left;
  //      tempData.mediaNumber = this.lastIndex;
  //      let tempTaggedPeoples = this.state.taggedPeoplesList;
  //      //let tempTaggedPeoples = this.props.tagged_peoples_for_display;
  //
  //      // IT'S FOR DISPLAY USER ON PHOTO
  //      tempTaggedPeoples.push(tempData);
  //      this.props.taggedPeoplesForDisplay(tempTaggedPeoples)
  //      this.setState({taggedPeoplesList: tempTaggedPeoples });
  //
  //      // IT'S FROM COMPAIR TWO ARRAY USER IS TAGGED OR NOT
  //      this.taggedPeoples.push(data);
  //      // this.props.taggedPeoplesForCompare(this.taggedPeoples);
  //    }
  //  }
  //
  //
  //  componentWillMount () {
  //   this.taggedPeoples = this.props.tagged_peoples_for_compare;
  //   this.setState({taggedPeoplesList: this.props.tagged_peoples_for_display});
  //   this.props.initTransferUtility()
  // }

  imgUrl(url) {
    if (Platform.OS === "android") {
    } else {
      return url;
    }
  }

  dynamicStyle(data) {
    let left = screenWidth * data.locationX / 100;
    let top = screenHeight * data.locationY / 100;
    let right = screenWidth * (100-data.locationX) / 100;
    if (data.locationX > 70){
      return {
        position: "absolute",
        top: data.locationY < 50 ? top : top-37,
        right: right > 15 ? right-20: right,
        justifyContent: 'center',
        alignItems: 'center',  
      };
    } else {
      return {
        position: "absolute",
        top: data.locationY < 50 ? top : top - 37,
        left: left < 22 ? 2 : left - 22,
        justifyContent: 'center',
        alignItems: 'center',
      };
    }
  }

  removeUser(user) {
    // remove user from display array
    let tempTaggedPeoples = this.state.taggedPeople;

    let index1 = _.findIndex(tempTaggedPeoples, function(o) {
      return o.user == user.user;
    });
    tempTaggedPeoples.splice(index1, 1);
    this.setState({ tempTaggedPeoples: tempTaggedPeoples });

    // remove user from passing array
    // let index2 =  _.findIndex(this.props.taggedPeopleForCompare, function(o) { return o._id == user._id });
    // this.props.taggedPeople.splice(index2, 1);
    // this.props.setTaggedPeople(this.props.taggedPeople)

    // remove user from compare array
    let index3 = _.findIndex(this.props.taggedPeopleForCompare, function(o) {
      return o.user == user.user;
    });
    this.props.taggedPeopleForCompare.splice(index3, 1);
    this.props.setTaggedPeopleForCompare(this.props.taggedPeopleForCompare);
  }
  
  getImages() {
    return this.choose_multiple_image.map((data, index) => {
      if (data.isType == 'image' || data.isType == 'camera'){
        return(
          <View style={PhotoTagsStyle.slide1} key={index} >
            <TouchableWithoutFeedback
              onPress={evt => {
                this.lastIndex = data.index;
                this.top = evt.nativeEvent.locationY * 100 / screenHeight;
                this.left = evt.nativeEvent.locationX * 100 / screenWidth;
                navigateTo(this.props.navigation, 'TagPeople', {
                  mediaNumber: this.lastIndex,
                  top: this.top,
                  left: this.left,
                  compareTaggedPeople: this.props.navigation.state.params.compareTaggedPeople
                });
              }}
              style={{ padding: 50, backgroundColor: 'red' }}
            >
              <View>
                {data.mediaUrl && (
                  <CachedImage
                    style={PhotoTagsStyle.imageContainer}
                    source={{ uri: data.mediaUrl }}
                    defaultSource={Images.placeHolder}
                    fallbackSource={Images.placeHolder}
                    activityIndicatorProps={{ display: "none", opacity: 0 }}
                  />
                )}
                {data.uri && (
                  <Image
                    style={PhotoTagsStyle.imageContainer}
                    source={{ uri: data.uri }}
                  />
                )}
                {this.state.taggedPeople &&
                  this.state.taggedPeople.map((dt, subIndex) => {
                    if (dt.mediaNumber == index) {
                      return (
                        <TouchableOpacity
                          key={subIndex}
                          style={this.dynamicStyle(dt)}
                          onPress={() => {
                            this.removeUser(dt);
                          }}
                        >
                          <View key={subIndex} >
                            {
                              dt.locationY < 50 && (<View style={dt.locationX > 70 ? Styles.rightTagTriangle : Styles.leftTagTriangle}>
                                <View style={Styles.tagTriangle} />
                              </View>) || null
                            }

                            <View style={Styles.tagUserView}>
                              <Text style={Styles.tagListText}>
                                {/* {" username"} */}
                                {dt.username}{" "}
                              </Text>
                              <View style={PhotoTagsStyle.removeTagUser}>
                                <Image
                                  style={PhotoTagsStyle.removeIcon}
                                  source={require("../../images/remove.png")}
                                />
                              </View>
                            </View>
                            {
                              dt.locationY > 50 && (<View style={dt.locationX > 70 ? Styles.rightTagTriangle : Styles.leftTagTriangle}>
                                <View style={Styles.tagTriangleBottom} />
                              </View>) || null
                            }
                          </View>
                        </TouchableOpacity>
                      );
                    }
                  })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        )
      }
  });
  }

  render() {
    return <View style={{ flex: 1 }}>
        <View style={{ height: screenWidth, width: screenWidth }}>
          <Swiper index={0} dotColor={Colors.white} activeDotColor={Colors.primary} loop={false}>
            {this.getImages()}
          </Swiper>
        </View>
        <View style={PhotoTagsStyle.bottomView}>
          <Text style={PhotoTagsStyle.bottomViewText}>
            Tap photo to tag people.
          </Text>
          <Text style={PhotoTagsStyle.bottomViewText}>
            Tap again to remove.
          </Text>
        </View>
      </View>;
  }
}

PhotoTags.navigationOptions = ({ navigation }) => ({
  tabBarIcon: ({ focused }) => {
    return (
      <Image style={{ width: 20, height: 20 }} source={Images.addPhotoTab} />
    );
  },
  title: "TAG PEOPLE",
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
        style={[Styles.headerLeftImage, {
          height: 15,
          width: 8
        }]}
      />
    </TouchableOpacity>
  ),
  headerRight: (
    <TouchableOpacity
      onPress={() => {
        navigation.dispatch(backAction);
      }}
      style={Styles.headerRightContainer}
      activeOpacity={0.5}
    >
      <Text
        style={[Styles.headerRightText, {
          color: Colors.primary,
          marginLeft: 10,
          fontFamily: "ProximaNova-Medium",
          fontSize: 16,
          textAlign: 'right'
        }]}
      >
        Done
      </Text>
    </TouchableOpacity>
  )
});
const mapStateToProps = ({ userActionReducer }) => {
  const { taggedPeople, taggedPeopleForCompare } = userActionReducer;

  return { taggedPeople, taggedPeopleForCompare };
};
export default connect(mapStateToProps, {
  setTaggedPeople,
  setTaggedPeopleForCompare
})(PhotoTags);
