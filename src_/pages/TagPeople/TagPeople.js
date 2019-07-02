import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  DeviceEventEmitter,
  Dimensions
} from "react-native";
import { CachedImage } from 'react-native-cached-image';
import Swiper from "react-native-swiper";
import { connect } from "react-redux";
import { TabNavigator, NavigationActions } from "react-navigation";
import _ from "lodash";

import { Card, CardSection, Button, CustomPicker } from "../../components";
import { Images, Colors, Styles } from "../../theme";
import { TagPeopleStyle } from "./TagPeopleStyle";
import Input from "../../components/Input/Input";
import { apiCall } from "./../../services/AuthService";
import {
  setTaggedPeople,
  setTaggedPeopleForCompare
} from "../../actions";

const backAction = NavigationActions.back({
  key: null
});
class TagPeople extends Component {
  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params;
    this.state = {
      search_frined_list: [],
      tagged_peoples_for_compare: [],
      mediaNumber: params.mediaNumber,
      top: params.top,
      left: params.left
    };
  }
  componentDidMount() {
    this.searchUser("");
  }

  // changeText(text){
  //   this.searchUser(text)
  // }

  searchUser(text) {
    const data = {
      userId: this.props.userData._id,
      query: text
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("users/searchUser", data, headers)
      .then(response => {
        this.setState({ search_frined_list: _.differenceBy(response.result, this.props.taggedPeopleForCompare, '_id') });
      })
      .catch(error => {
      });
  }

  renderFriends() {
    if (this.state.search_frined_list) {
      let searchFriend = this.state.search_frined_list;
      if (searchFriend.length > 0) {
        return searchFriend.map((friend, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => {
              // this array for compare tagged people
              let tagPeople = this.props.taggedPeopleForCompare;
              if (tagPeople) {
                tagPeople.push(friend);
              } else {
                tagPeople = [];
                tagPeople.push(friend);
              }
              this.props.setTaggedPeopleForCompare(tagPeople);

              // display tag people array
              let tempData = this.props.taggedPeople;
              let tempFriend = {};
              tempFriend.mediaNumber = this.state.mediaNumber;
              tempFriend.locationY = this.state.top;
              tempFriend.locationX = this.state.left;

              tempFriend.username = friend.username;
              tempFriend.name = friend.name;
              tempFriend.user = friend._id;
              if (tempData) {
                tempData.push(tempFriend);
              } else {
                tempData = [];
                tempData.push(tempFriend);
              }
              this.props.setTaggedPeople(tempData);
              DeviceEventEmitter.emit("taggedPeople", tempData);

              this.props.navigation.dispatch(NavigationActions.back());
              // this.props.navigation.dispatch(backAction)
            }}
          >
            <View style={TagPeopleStyle.container}>
              <View style={TagPeopleStyle.group1}>
                <View style={TagPeopleStyle.photoConatiner}>
                  {(friend.profileImageUrl && (
                    <CachedImage
                      style={TagPeopleStyle.photo}
                      source={{uri: friend.profileImageUrl}}
                      defaultSource={Images.defaultUser}
                      fallbackSource={Images.defaultUser}
                      activityIndicatorProps={{ display: "none", opacity: 0 }}
                    />
                  )) || (
                    <CachedImage
                      style={TagPeopleStyle.photo}
                      source={Images.dummyUser}
                      defaultSource={Images.defaultUser}
                      fallbackSource={Images.defaultUser}
                      activityIndicatorProps={{ display: "none", opacity: 0 }}
                    />
                  )}
                </View>
              </View>
              <View style={TagPeopleStyle.group2}>
                <View style={TagPeopleStyle.usernameConatiner}>
                  <Text style={TagPeopleStyle.textUsername}>
                    {friend.username}
                  </Text>
                  <Text style={TagPeopleStyle.textFullname}>{friend.name}</Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        ));
      } else {
        return (
          <View style={TagPeopleStyle.gridContainer}>
            <Text style={TagPeopleStyle.noPostsText}>No user found</Text>
          </View>
        );
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <CardSection style={[{ alignItems: "stretch", marginTop: 0 }]}>
          <Input
            icon="searchPeople"
            placeholder="Find a person"
            onChangeText={text => {
              this.searchUser(text);
            }}
            customIconStyle={{ height: 20.3, width: 20.3 }}
            style={{ backgroundColor: 'rgb(243, 244, 246)' }}
            textStyle={{ fontFamily: 'OpenSans-Bold', color: 'rgb(118, 129, 150)', fontSize: 16,lineHeight:20, letterSpacing: 0 }}
            placeholderTextColor={Colors.placeholderTextColor}
          />
        </CardSection>
        <Card>
          <ScrollView contentContainerStyle={TagPeopleStyle.scrollContainer}>
            {this.renderFriends()}
          </ScrollView>
        </Card>
      </View>
    );
  }
}
TagPeople.navigationOptions = ({ navigation }) => ({
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
        // _this.nextPage()
        navigation.dispatch(backAction);
      }}
      style={Styles.headerRightContainer}
      activeOpacity={0.5}
    >
      <Text
        style={[Styles.headerRightText, {
          color: 'rgb(126,211,33)',
          fontFamily: "SourceSansPro-Regular",
          fontSize: 18,
          lineHeight:20,
          textAlign: 'right'
        }]}
      >
        Done
      </Text>
    </TouchableOpacity>
  )
});

const mapStateToProps = ({ authReducer, userActionReducer }) => {
  const { userData, token } = authReducer;
  const { taggedPeople, taggedPeopleForCompare } = userActionReducer;
  return { userData, token, taggedPeople, taggedPeopleForCompare };
};
export default connect(mapStateToProps, {
  setTaggedPeople,
  setTaggedPeopleForCompare
})(TagPeople);
