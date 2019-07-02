import React, { Component } from "react";
import {
  Animated,
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import { CachedImage } from "react-native-cached-image";
import { MentionsTextInput, SuggestionsList} from 'react-native-mentions';
import { Button } from "../../components";
import { Images, Colors, Styles, Metrics } from "./../../theme";
import { AddCaptionModalStyle } from "./AddCaptionModalStyle";
import TextArea from "../../components/TextArea/TextArea";
import { updateLoading } from "../../actions";
import { apiCall } from '../../services/AuthService';
import { checkNetworkConnection } from '../../services/CommonFunctions';
const oldCaption = "";
const backAction = NavigationActions.back({ key: null });
import _ from "lodash";

class AddCaptionModal extends Component {
  constructor(props) {
    super(props);
    this.cancelAction = this.cancelAction.bind(this);
    this.okAction = this.okAction.bind(this);
    this.state = {
      addCaptionModalVisible: false,
      newCaption: this.props.navigation.state.params.caption,
      keyword: "",
      users: [],
      hashTags: [
        'bud',
        'wee',
        'pot',
        'chronic'
      ],
      hasChanged: false,
      generatedHashTags: [],
      mentionedUsers:  [],
      tempMentionedUsers: this.props.navigation.state.params.tempMentionedUsers ? this.props.navigation.state.params.tempMentionedUsers : [],
    };
    console.log("tempMentionedUsers", this.props.navigation.state.params.tempMentionedUsers )
    this.isTrackingStarted = false;
    this.previousChar = " ";
    this.reqTimer = 0;
  }

  static navigationOptions = ({ navigation }) => ({
    title: "POST CAPTION",
    headerTitleStyle: Styles.headerTitleStyle,
    headerStyle: Styles.headerStyle,
    tabBarVisible: false,
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params.okAction();
        }}
        style={Styles.headerLeftContainer}
        activeOpacity={0.5}
      >
        <Text
          style={{
            color: Colors.white,
            marginLeft: 10,
            fontFamily: "ProximaNova-Light",
            fontSize: 16
          }}
        >
          Cancel
        </Text>
        {/* <Image
          source={Images.backButton}
          style={[Styles.headerLeftImage, { height: 15, width: 8 }]}
        /> */}
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params.okAction();
        }}
        style={Styles.headerRightContainer}
        activeOpacity={0.5}
      >
        <Text style={[Styles.headerRightText, AddCaptionModalStyle.nextButton]}>
          OK
        </Text>
      </TouchableOpacity>
    )
  });

  componentWillMount() {
    this.setState({
      textInputHeight: this.state.textInputMinHeight
    })
  }
  // get mentions user from caption  
  async getMentionsUsers(caption) {
    let patt = /@([a-zA-Z0-9.,]+)(?:^|[ ])/g
    let result = caption.match(patt);
    let tempArr = [];
    if (result) {
      for (let i = 0; i < result.length; i++) {
        tempArr.push({ username: result[i].trim().replace('@', '') })
      }
      var removedMentionsUserArray = _.differenceBy(this.state.tempMentionedUsers, tempArr, 'username');
      var newMentionsUserArray = _.differenceWith(this.state.tempMentionedUsers, removedMentionsUserArray, _.isEqual)
      var tempNewMentionUser = []
      for (let i = 0; i < newMentionsUserArray.length; i++) {
        let index = tempNewMentionUser.indexOf(newMentionsUserArray[i]._id)
        if(index < 0) {
          tempNewMentionUser.push(newMentionsUserArray[i]._id)
        }
      }
      this.setState({
        mentionedUsers: tempNewMentionUser
      })
    } else {
      this.setState({
        mentionedUsers: []
      })
    }
  }

  // get mentions hash tags from caption
  async getMentionsHashTags(caption){
    let patt = /#([a-zA-Z0-9.,]+)/g
    let result = caption.match(patt);
    let tempArr = [];
    if (result) {
      for (let i = 0; i < result.length; i++) {
        tempArr.push(result[i].trim().replace('#', ''))
      }
      this.setState({
        generatedHashTags: tempArr
      })
    } else {
      this.setState({
        generatedHashTags: []
      })
    }
  }

  // update caption
  async updateCaption(caption) {
   
    await this.getMentionsUsers(caption);
    await this.getMentionsHashTags(caption);
    DeviceEventEmitter.emit("captionUpdated", { caption, generatedHashTags: this.state.generatedHashTags, mentionedUsers: this.state.mentionedUsers, tempMentionedUsers: this.state.tempMentionedUsers});
    this.props.navigation.dispatch(backAction);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      cancelAction: this.cancelAction,
      okAction: this.okAction
    });
  }

  cancelAction() {
    this.props.navigation.dispatch(backAction);
  }

  okAction() {
    this.updateCaption(this.state.newCaption);
  }

  getUserSuggestions(searchText) {
    return new Promise((resolve, reject) => {
      const data = {
        query: searchText.substring(1),
      };
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
        userid: this.props.userData._id
      };
      apiCall('users/searchAllUsers', data, headers).then(response => {
        resolve(response.result);
      }).catch(error => {
        reject(error)
      })
    });
  }

  getHashTags(searchText) {
    return new Promise((resolve, reject) => {
      const data = {
        query: searchText.substring(1),
      };
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
        userid: this.props.userData._id
      };
      apiCall('users/searchAllUsers', data, headers).then(response => {
        resolve(response.result);
      }).catch(error => {
        reject(error)
      })
    })
  }

  onSuggestion1Tap(user, hidePanel) {
    console.log("user", user)
    hidePanel();
    const comment = this.state.newCaption.slice(0, - this.state.keyword.length)
    this.setState({
      users: [],
      newCaption: comment + '@' + user.username + ' ',
      tempMentionedUsers: [...this.state.tempMentionedUsers, user]
    }, () => {
    })
  }

  onSuggestion2Tap(hashtag, hidePanel) {
    hidePanel();
    const comment = this.state.newCaption.slice(0, - this.state.keyword.length)
    this.setState({
      hashTags: [],
      newCaption: comment + '#' + hashtag + ' ',
      // generatedHashTags: [...this.state.generatedHashTags,hashtag]
    }, () => {
    })
  }

  callback1(keyword) {
    if(keyword.length > 0 && keyword != '@') {
      if (this.reqTimer) {
        clearTimeout(this.reqTimer);
      }
      this.reqTimer = setTimeout(() => {
        if(checkNetworkConnection()) {
        this.getUserSuggestions(keyword)
            .then(data => {
              this.setState({
                keyword: keyword,
                users: [...data],
                suggestionRowHeight: data.length
              })
            })
            .catch(err => {
            });
        } else {
        alert('No internet connection', 'Please check your network connectivity.');
        }      
      }, 200);
    }
  }

  callback2(keyword) {
    if(keyword.length > 0 && keyword != '#') {
        if (this.reqTimer) {
        clearTimeout(this.reqTimer);
      }
      // this.reqTimer = setTimeout(() => {
      //   this.getHashTags(keyword)
      //     .then(data => {
      //       this.setState({
      //         keyword: keyword,
      //         data: [...data]
      //       })
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     });
      // }, 200);
    }
  }

  onCaptionChange = (val) => {
    if(val.length == 0) {
      this.setState({ users: [] })
    } else if(val.slice(-1) == '@') {
      this.setState({ users: [] })
    } else if(val.slice(-1) == '#') {
      // @todo - uncomment this after hashtag api is available
      // this.setState({ hashTags: [] })
    }
    this.setState({ newCaption: val })
  }

  renderSuggestionsRow1({ item, index }, hidePanel) {
    return (
      <TouchableOpacity onPress={() => this.onSuggestion1Tap(item, hidePanel)} key={index}>
        <View style={AddCaptionModalStyle.suggestionsRowContainer} key={index}>
          <View style={AddCaptionModalStyle.userIconBox}>
            <CachedImage
              style={AddCaptionModalStyle.avtarImage}
              source={{ uri: item.thumbnail }}
              defaultSource={Images.defaultUser}
              fallbackSource={Images.defaultUser}
              activityIndicatorProps={{ display: "none", opacity: 0 }}
            />
          </View>
          <View style={AddCaptionModalStyle.userDetailsBox}>
            <Text style={AddCaptionModalStyle.displayNameText}>{item.name}</Text>
            <Text style={AddCaptionModalStyle.usernameText}>@{item.username}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderSuggestionsRow2({ item, index}, hidePanel) {
    return (
      <TouchableOpacity onPress={() => this.onSuggestion2Tap(item, hidePanel)} key={index}>
        <Text style={AddCaptionModalStyle.hashTags}>#{item}</Text>
      </TouchableOpacity>
    )
  }

  renderSuggestionsLoadingComponent = () => {
    return (
      <View style={{ flex: 1, width: Metrics.screenWidth, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.black }}>
        <ActivityIndicator
          animating
          size='small'
          style={{padding: 15}}
          color={Colors.primary}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={AddCaptionModalStyle.container}>
        <View style={AddCaptionModalStyle.captionConatiner}>
          <View style={AddCaptionModalStyle.avatarImageContainer}>
            <CachedImage
              style={AddCaptionModalStyle.avtarImage}
              source={{ uri: this.props.userData.profileImageUrl }}
              defaultSource={Images.defaultUser}
              fallbackSource={Images.defaultUser}
              activityIndicatorProps={{ display: "none", opacity: 0 }}
            />
          </View>
          <View style={AddCaptionModalStyle.captionTextContainerOuter}>
            <View style={AddCaptionModalStyle.captionTextContainer}>
              <MentionsTextInput
                textInputStyle={AddCaptionModalStyle.textAreaStyle}
                textInputMinHeight={30}
                textInputMaxHeight={80}
                inputValue={this.state.newCaption}
                keyboardAppearance="dark"
                autoFocus={true}
                underlineColorAndroid="transparent"
                selectionColor={Colors.primary}
                onChangeText={this.onCaptionChange}
              />
            </View>
            <View style={AddCaptionModalStyle.selectedPhotoContainer}>
              <Image
                source={{
                  uri: this.props.navigation.state.params.selectedImages[0].uri
                }}
                style={AddCaptionModalStyle.selectedPhoto}
              />
            </View>
          </View>
        </View>
        <SuggestionsList 
          suggestionsPanelStyle={AddCaptionModalStyle.suggestionsPanelStyle}
          loadingComponent={this.renderSuggestionsLoadingComponent}
          trigger={['@', '#']}
          triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
          inputValue={this.state.newCaption}
          triggerCallback={[this.callback1.bind(this), this.callback2.bind(this)]}
          renderSuggestionsRow={[this.renderSuggestionsRow1.bind(this), this.renderSuggestionsRow2.bind(this)]}
          suggestionsData={[this.state.users, this.state.hashTags]} // array of objects
          keyExtractor={(item, index) => index} 
          suggestionRowHeight={70}
          horizontal={false} // default is true, change the orientation of the list
          MaxVisibleRowCount={4} // this is required if horizontal={false}
        />
      </View>
    );
  }
}


const mapStateToProps = ({ authReducer }) => {
  const { userData, loading, token } = authReducer;
  return { userData, loading, token };
};
export default connect(mapStateToProps, { updateLoading })(AddCaptionModal);
