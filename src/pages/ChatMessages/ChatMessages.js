import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  View,
  Keyboard,
  FlatList
} from "react-native";
import { CachedImage } from "react-native-cached-image";
import { connect } from "react-redux";
import firebase from "react-native-firebase";
import { NavigationActions } from "react-navigation";
import { Colors, Images, Styles, Metrics } from '../../theme';
import { ChatMessagesStyle } from "./ChatMessagesStyle";
import { updateLoading } from '../../actions';
import { calculateTimeDuration, calculateTimeDurationShort, navigateTo, isIPhoneX } from './../../services/CommonFunctions';
import Spinner from "react-native-loading-spinner-overlay";
import _ from 'lodash';
import { apiCall } from "./../../services/AuthService";
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
const backAction = NavigationActions.back({
    key: null
});

class ChatMessages extends Component {
  constructor(props){
    super(props);
    this.chatRef = firebase.firestore().collection('chats');
    this.conversationRef = firebase.firestore().collection('conversations');
    this.batch = firebase.firestore().batch();
    this.messageLimit = 50;
    this.state = {
      messages: [],
      stopLoadEarlier: true,
      loadingEarlier: false
    }
  }

  sendNotification = (dataObj) => {
    const {chatUserId, chatID, chatName} = this.props.navigation.state.params;
    dataObj.data = {};
    dataObj.data.chatUserId = this.props.userData._id;
    dataObj.data.chatID = chatID;
    dataObj.data.chatName = this.props.userData.name;

    let headers = {
      "Content-Type": "application/json",
      firebaseNotificationKey: Metrics.firebaseNotificationKey //"k5z2fALWstAcg3W23c9ZZKRPKLDBshJM"
    };
    apiCall('users/firebaseNotifications',dataObj,headers).then(response=>{
    })
    .catch((err)=>{
    });
  }

  onSend(messages = []) {
    //
    let chat = messages[0];
    chat.timestamp = chat.createdAt.getTime();
    chat.readStatus = false;
    chat.conversationID = this.props.navigation.state.params.chatID;
    chat.type = 'text';

    const receiverId = this.profileID;
    const senderId = chat.user._id;
    this.sendNotification({receiverId,senderId});

    this.chatRef.add(chat)
    .then((docRef)=>{
     this.updateUnreadStatus(senderId,receiverId);
    })
    .catch((error)=>{
    });
  }

  componentWillMount(){
    let chatID = this.props.navigation.state.params.chatID;
    this.chatID = this.props.navigation.state.params.chatID;
    this.ignoreStateUpdate = true;
    //this.props.updateLoading(true);
    this.setState({
      loading: true
    });
    this.profileID = this.props.navigation.state.params.chatUserId;
    this.getChatMessages(chatID).then(()=>{
      //this.props.updateLoading(false);
      this.setState({
        loading: false
      });
      this.listenToChatUpdates(chatID);
      this.updateReadStatus();
    });
  }

  componentWillUnmount() {
    if(this.chatListener){
      this.chatListener();
    }
    Keyboard.dismiss();
  }

  // IN CONVERSATION COLLECTION
  updateUnreadStatus = (senderId, receiverId) => {
    this.conversationRef
    .where(`chatID`, '==', this.chatID)
    .get()
    .then(querySnapShot=>{
      let docRef = '';
      let docData = {};
      querySnapShot.forEach((conversationObj)=>{
        docRef = conversationObj.ref;
        docData = conversationObj.data();
      });

      if(docData.collaborators[receiverId].readStatus){
        docRef.update({
          [`collaborators.${receiverId}.readStatus`]: false
        }).then(()=>{
        }).catch((err)=>{
        });
      }
    });
  }
  updateReadStatus = () => {
    //Updating Chat collection
    var chatMessageDocs = [];
    let {_id} = this.props.userData;
    this.chatRef
    .where('conversationID','==',this.chatID)
    .get()
    .then(querySnapShot=>{
      querySnapShot.forEach((chatDoc)=>{
        let chatData = chatDoc.data();
        if(chatData.user._id !== _id && !chatData.readStatus){
          chatMessageDocs.push(chatDoc);
        }
      });
      chatMessageDocs.forEach((chatMessage)=>{
        this.batch.update(chatMessage.ref,{
          readStatus: true
        });
      });
      this.batch.commit().then(()=>{
      });
    });

    this.conversationRef
    .where(`collaborators.${_id}._id`, '==', _id)
    .where(`collaborators.${this.profileID}._id`,'==',this.profileID)
    .get()
    .then(querySnapShot=>{
      let docRef = '';
      querySnapShot.forEach((conversationObj)=>{
        docRef = conversationObj.ref;
      });
      docRef.update({
        [`collaborators.${_id}.readStatus`] : true
      }).then(()=>{
      }).catch((err)=>{
      });
    });
  }
  getChatMessages = (chatID) => {
    return new Promise((resolve,reject)=>{
      var messages = [];
      this.chatRef
      .where('conversationID','==', chatID)
      .orderBy("createdAt","desc")
      .limit(this.messageLimit)
      .get()
      .then(querySnapShot=>{
        this.firstVisible = querySnapShot.docs[querySnapShot.docs.length-1];
        let stopLoadEarlier = querySnapShot.docs.length < this.messageLimit ? true: false;
        querySnapShot.forEach((chatDoc)=>{
          let chatData = chatDoc.data();
          chatData.user.avatar = chatData.user.avatar;
          //chatData.createdAt = new Date(chatData.timestamp);
          messages.push(chatData);
        });
        let appendedMessages = GiftedChat.append(this.state.messages, messages);
        //_.uniqBy
        this.setState((previousState) => ({
          messages: appendedMessages,
          stopLoadEarlier
        }),()=> resolve());
      });
    });
  }

  loadEarlier = () => {
    this.setState({
      loadingEarlier: true
    });
    this.chatRef
    .where('conversationID','==',this.chatID)
    .orderBy('createdAt','desc')
    .limit(this.messageLimit)
    .startAfter(this.firstVisible)
    .get().then((querySnapShot)=>{
      var messages = [];
      this.firstVisible = querySnapShot.docs.length ? querySnapShot.docs[querySnapShot.docs.length-1] : this.firstVisible;
      let stopLoadEarlier = querySnapShot.docs.length < this.messageLimit ? true: false;
      let {avatarUrl} = this.setState;
      querySnapShot.forEach(function(chatDoc) {
        let chatData = chatDoc.data();
        chatData.user.avatar = avatarUrl && chatData.user._id !== this.props.userData._id ? avatarUrl : chatData.user.avatar;
        messages.push(chatData);
      });
      //removing 1st message due to startAfter problem of duplicate 1st message
      messages.splice(0,1);
      this.setState((previousState) => ({
        messages: GiftedChat.append(messages,previousState.messages),
        stopLoadEarlier,
        loadingEarlier: false
      }));
    });
  }

  listenToChatUpdates = (chatID) => {
    this.chatListener = this.chatRef
    .where('conversationID', '==', chatID)
    .orderBy("createdAt","desc")
    .limit(1)
    .onSnapshot(querySnapShot=>{
      let newMessages = [];
      let source = '';
      querySnapShot.forEach((chatDoc)=>{
        let chatData = chatDoc.data();
        source = chatDoc.metadata.hasPendingWrites ? 'local' : 'server';
        newMessages.push(chatData);
      });
      if(!this.ignoreStateUpdate /*&& source !== 'local'*/){
        this.setState((previousState) => ({
          messages: GiftedChat.append(previousState.messages, newMessages)
        }));
      } else{
        this.ignoreStateUpdate = false;
      }
    });
  }
  onBubblePress = (context,currentMessage) => {
    if(currentMessage.type === 'post'){
      let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.token,
        'userid': this.props.userData._id
      };
      let params = {
        'id': currentMessage.post._id,
        'userId': this.props.userData._id
      };
      this.setState({
        loading: true
      });
      //this.props.updateLoading(true);
      apiCall('posts/getSinglePost', params, headers).then((response) => {
        this.openPostDetails(response.result[0]);
      });
    }
  }

  openPostDetails(currentPost) {
    this.setState({
      loading: false
    }, () => {
      navigateTo(this.props.navigation, 'PostDetails', {
        post: currentPost,
        user: currentPost.userDetail[0],
        from: this.props.navigation.state.params.from
      })
    });
  }

  renderPost = (props) =>{
    let {type: messageType , post} = props.currentMessage;
    if(messageType === 'post'){
      return (
      <View style={ChatMessagesStyle.postContainer}>
        <View style={{flex:0.2, justifyContent: 'center', alignItems: 'center'}}>
          <CachedImage
            style={ChatMessagesStyle.postProfileImage}
            source={{uri: post.userDetail[0].profileImageUrl}}
            defaultSource={Images.defaultUser}
            fallbackSource={Images.defaultUser}
            activityIndicatorProps={{ display: "none", opacity: 0 }}
          />
        </View>
        <View style={{flex:0.7, justifyContent:'center'}}>
          <Text style={[{color:'rgb(13,14,21)'},ChatMessagesStyle.universalFont]}> {post.userDetail[0].name} </Text>
        </View>
        <View style={{flex:0.1,alignItems: 'center'}}>
          <Image source={Images.rightArrow} style={{width:5.3, height:9.7}} />
        </View>
      </View>
      );
    }
    return null;
  }

  renderImageMetaDataIcon = (props) => {
    let {type:messageType, post } = props.currentMessage;
    if(!post || _.isEmpty(post)){
      return null;
    }
    let isSingleImage = post.medias.length === 1;
    let postType = isSingleImage && post.medias[0].mediaType === 2 ? 'video' : 'multi-image';
    let imageIconSource = postType === 'video' ? Images.videoIcon : Images.multipleImages;
    let iconStyle = postType === 'video' ? ChatMessagesStyle.videoIcon : ChatMessagesStyle.multipleImagesIcon;
    if(messageType === 'post' && (!isSingleImage || postType === 'video')){
      return(
        <View
          style={{
            zIndex: 10,
            flex: 1,
            position: 'absolute',
            top: ChatMessagesStyle.bubbleImage.height - 25,
            alignSelf: "flex-end"
          }}
        >
          <Image source={imageIconSource} style={iconStyle} />
        </View>
      );
    }
    return null;
  }
  renderCaption = (props) => {
    let {type: messageType , post} = props.currentMessage;
    if(messageType === 'post' && post.caption){
      return (
        <View style={ChatMessagesStyle.captionContainer}>
          <Text style={ChatMessagesStyle.caption} numberOfLines={2} ellipsizeMode={'tail'} >
            <Text style={ChatMessagesStyle.captionName}> 
              {post.userDetail[0].name}
            </Text>
            {" "}
            <Text style={{color:'rgb(13,14,21)',
        fontFamily:'SourceSansPro-Regular'}}>
              {post.caption}
            </Text>
          </Text>
        </View>
      )
    }
    return null;
  }
  renderBubble = (props) => {
    const {type:messageType} = props.currentMessage;
    return (
      <Bubble
      
        {...props}
        customTextStyle = {[ChatMessagesStyle.chatMessage,ChatMessagesStyle.universalFont]}
        renderCustomView = {this.renderPost}
        renderCaption = {this.renderCaption}
        postImagePlaceHolder = {Images.placeHolder}
        imageMetaDataIcon = {this.renderImageMetaDataIcon(props)}
        imageStyle = {ChatMessagesStyle.bubbleImage}
        onPress = {(context,currentMessage)=> this.onBubblePress(context,currentMessage)}
        textProps={{ style: { color: messageType === 'text' ?'black': 'rgba(255, 255, 255, 0.22)' } }}
        wrapperStyle={{
          left: {
            backgroundColor: messageType === 'text' ? 'rgb(105,197,25)' : 'white',
            marginTop: 10,
            //borderRadius: 20
            //borderRadius: 25
          },
          right: {
            backgroundColor: messageType === 'text' ? 'rgb(207,207,207)' : 'white',
            marginTop: 10,
            shadowOffset:{  width: 5,  height: 5,  },
            shadowColor: 'black',
            shadowOpacity:  messageType === 'text' ? 0.0 : 0.3,
            shadowRadius: 5,
            //borderRadius: 20
            //borderRadius: 25
          }
        }}
      />
    );
  }
  renderLoading = () => {
    return (
      <Spinner
        visible={this.state.loading}
        overlayColor="rgba(0, 0, 0, 0.05)"
        color={Colors.primary}
      />
    );
  }
        // <ActivityIndicator  animating  size="large"  
      //   style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f0f',zIndex:5}}
      //   color={Colors.primary} 
      // />
  renderSend = (props) => {
    return (
      <Send
        {...props}
        activeIamge={Images.sendActive}
        inActiveIamge={Images.sendInactive}
      >
        <View style={{marginRight: 10, marginBottom: 10}}>
          <Image source={Images.sendActive} resizeMode={'contain'} style={{height:23, width:19.3, tintColor : 'black'}}/>
        </View>
      </Send>
    );
  }
  render(){
    return(
      <View style={ChatMessagesStyle.chatMessageContainer}>
        {this.state.loading && this.renderLoading()}
        <GiftedChat
          renderBubble={this.renderBubble}
          messages={this.state.messages}
          placeholderTextColor = {Colors.black}
          textInputStyle = {{borderRadius : 5,marginLeft : 40,marginRight : 10,color: Colors.black,backgroundColor : 'rgb(240,241,244)'}}
          dayDisplayStyle = {{color: Colors.black,fontSize: 11.9}}
          textInputAutoCorrect = {false}
          renderAvatarOnTop = {false}
          defaultAvatar = {Images.defaultUser}
          //renderLoading = {this.renderLoading}
          textInputSelectionColor = {Colors.primary}
          loadEarlier = {!this.state.stopLoadEarlier}
          InputContainerStyle = {{marginBottom : 10,backgroundColor:Colors.clearTransparent}} //InputContainerStyle
          onSend={(messages) => this.onSend(messages)}
          onLoadEarlier = {()=> this.loadEarlier()}
          isLoadingEarlier = {this.state.loadingEarlier}
          renderSend = {this.renderSend}
          user={{
           _id: this.props.userData._id,
           name: this.props.userData.name,
           avatar: this.props.userData.profileImageUrl
          }}
        />
      </View>
    );
  }
}

ChatMessages.navigationOptions = ({ navigation }) => { 
  return {
    title: navigation.state.params.chatName,
    headerTitleStyle: Styles.headerTitleStyle,
    headerStyle: Styles.headerStyle,
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          const refreshFunction = navigation.state.params.refreshFunction;
          if(typeof refreshFunction === 'function'){
            refreshFunction();
          }
          navigation.dispatch(backAction);
        }}
        style={Styles.headerLeftContainer}
      >
        <Image source={Images.backButton} style={[ Styles.headerLeftImage, { height: 15, width: 8 }]} />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        onPress = {()=>{
          Keyboard.dismiss();
          navigateTo(navigation, 'OtherProfile', {
            profileId: navigation.state.params.chatUserId,
            profileName: navigation.state.params.chatName
          })
        }}
        style={Styles.headerRightContainer}
      >
      <Image style={[Styles.headerRightImage, ChatMessagesStyle.infoIconStyle]}
            source={Images.profile_ri}
            >
      </Image>
      </TouchableOpacity>
    ),
    tabBarVisible: false,
  }
}

const mapStateToProps = ({ authReducer }) => {
  const { userData, token, loading } = authReducer;
  return { userData, token, loading };
};
export default connect(mapStateToProps, {updateLoading})(ChatMessages);