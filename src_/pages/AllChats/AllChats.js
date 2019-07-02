import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  Image,
  Dimensions,
  View,
  FlatList,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import firebase from "react-native-firebase";
import { NavigationActions } from "react-navigation";
import { Colors, Images, Styles } from '../../theme';
import { AllChatsStyle } from "./AllChatsStyle";
import { updateLoading } from '../../actions';
import { calculateTimeDuration, calculateTimeDurationShort, navigateTo } from './../../services/CommonFunctions';
import Input from "../../components/Input/Input";
import { CachedImage } from "react-native-cached-image";
import async from "async";
import _ from 'lodash';
import TimeAgo from '../../components/TimeAgo/TimeAgo.js';
const screenHeight = Dimensions.get("window").height;

const backAction = NavigationActions.back({
  key: null
});

class AllChats extends Component {
  constructor(props){
    super(props);
    this.conversationRef = firebase.firestore().collection('conversations');
    this.chatRef = firebase.firestore().collection('chats');
    this.state = {
      chatOverview: [],
      searchText: '',
      loading: false
    }
  }
  refreshFunction = () => {
    //this.props.updateLoading(true);
    this.getAllChats()
    //setTimeout(()=> this.getAllChats() , 5000 ); 
  }
  componentWillUnmount(){
    if(this.conversationListener){
      this.conversationListener();
    }
  }
  componentDidMount(){
    this.props.navigation.setParams({
      refreshFunction: this.refreshFunction
    });
    this.setState({
      loading: true
    });
    //this.props.updateLoading(true);
    this.getAllChats();
  }
  _keyExtractor = (item,index) => {
    return item.docID;
  }
  getAllChats() {
    let chatOverview = [];
    let {_id} = this.props.userData;
    this.conversationListener = this.conversationRef
    .where(`collaborators.${_id}._id`, '==', _id)
    .onSnapshot((querySnapShot)=>{
      let refsDoc = [];
      querySnapShot.forEach(function(doc) {
        refsDoc.push(doc);
      });
      async.mapLimit(refsDoc,10,(doc,callback)=>{
        this.getLastMessage(doc).then((chatObj)=>{
          callback(null,chatObj);
        });
      },(err,results)=>{
        if(!err){
          //Don't allow empty objects, empty objects are the ones who don't have any messages so there's no last message;
          results = results.filter(chatItem=> !(_.isEmpty(chatItem)) );
          let chatOverview = _.orderBy(results, ['epoc'],['desc']);
          //this.props.updateLoading(false);
          this.setState({
            loading: false
          });

          this.setState({
            chatOverview: chatOverview
          });
        }
      });
    });
  }

  getLastMessage(doc){
    let {_id} = this.props.userData;
    let metaData = doc.data();
    let otherCollaborators = Object.keys(metaData.collaborators).filter(item=> item !== _id);
    let otherCollaboratorID = otherCollaborators[0];
    let chatObj = {};
    let { username,profileImageUrl,name} = metaData.collaborators[otherCollaboratorID];
    let {chatID} = metaData;
    return new Promise((resolve,reject)=>{
      this.chatRef
      .where('conversationID', '==', chatID)
      .orderBy("createdAt","desc")
      .limit(1)
      .get()
      .then(querySnapShot=>{
        querySnapShot.forEach((chatDoc)=>{
          let chatData = chatDoc.data();
            chatObj.docID = doc.id;
            chatObj.chatID = chatID;
            chatObj.userName = username;
            chatObj.name = name;
            chatObj.readStatus = chatData.user._id === _id ? true : chatData.readStatus;
            chatObj.messageID = chatData._id;
            chatObj.type = chatData.type;
            chatObj.profileImageUrl = profileImageUrl;
            chatObj.lastMessage = chatData.text || 'Sent a post';
            chatObj.timestamp = calculateTimeDurationShort(chatData.createdAt).replace(/\s/g, '');
            chatObj.createdAt = chatData.createdAt;
            chatObj.epoc = chatData.timestamp;
            chatObj._id = otherCollaboratorID
          });
          resolve(chatObj);
        }).catch((error)=>{
          reject(error);
        });
      });
  }
  onChangeText = (text) => {
    this.setState({
      searchText: text
    });
  }

  renderHeader = () => {
    return (
      <Input
        icon="searchPeople"
        placeholder="Search"
        placeholderTextColor={Colors.placeholderTextColor}
        style={[{ paddingLeft: 20 }, Styles.thinBottomBorder7]}
        textStyle= {{fontSize:16.5}}
        onChangeText={ text => {
          this.onChangeText(text);
        }}
        customIconStyle={{ height: 23.7, width: 23.7, alignSelf: 'flex-start' }}
      />
    );
  }

  gotoChat = (chatMessageObj) => {
    let {chatID,readStatus, _id , name} = chatMessageObj;
    navigateTo(this.props.navigation, 'ChatMessages', {
      chatID: chatID,
      chatName: name,
      chatUserId: _id,
      refreshFunction: this.refreshFunction,
      from: this.props.navigation.state.params.from
    });
    //navigate to ChatMessages with chatID
    //Updating read status
  }
  // updateReadStatus(readStatus,messagStatus){
  //   if(readStatus === false){
  //     let {_id} = this.props.userData;
  //     this.chatRef
  //     .where('messageID','==',messageID)
  //     .get()
  //     .then(querySnapShot=>{
  //       let chatDocs = [];
  //       querySnapShot.forEach(function(doc) {
  //         chatDocs.push(doc);
  //       });
  //       let chatDoc = chatDocs[0];
  //       chatDoc.ref
  //       .update({
  //         'readStatus': true
  //       }).then(()=>{
  //         alert("Document Updated Successfully");
  //       });
  //     });
  //   }
  // }

  renderListItem = ({ item, index }) => {
    let fontStyle = item.readStatus === false ? AllChatsStyle.boldFont : {};
    let fontColor = item.readStatus === false ? {color:Colors.white} : {}
    return (
      <TouchableHighlight
        onPress={() => { this.gotoChat(item) } }
      > 
      <View style={AllChatsStyle.flatItemContainer}>
        <View style={AllChatsStyle.chatUserImageContainer}>
          <CachedImage 
            style= {AllChatsStyle.chatUserProfileImage}
            source= {{ uri: item.profileImageUrl }}
            defaultSource= {Images.defaultUser}
            fallbackSource= {Images.defaultUser}
            activityIndicatorProps= {{ display: "none", opacity: 0 }}
          />
        </View>
        <View style={AllChatsStyle.chatDetail} >
          <View>
            <Text style={[AllChatsStyle.chatName,fontStyle]}>
              {item.name}
            </Text>
            <Text style={[{color:Colors.inputColor},fontStyle,fontColor]} numberOfLines={2} ellipsizeMode={'tail'} >
              {item.lastMessage}
            </Text>
          </View>
        </View>
        <View style={AllChatsStyle.chatTimestamp}>
          <TimeAgo time = {item.createdAt} style={{color:Colors.inputColor}} timeFormat = {(time)=> {
            let timeToShow = calculateTimeDurationShort(time).replace(/\s/g, '');
            timeToShow = timeToShow.indexOf('s') === timeToShow.length - 1  ? 'now' : timeToShow;
            return timeToShow;
          }}/>
          {/* <Text style={{color:Colors.inputColor}}>
            {calculateTimeDuration(item.createdAt)}
          </Text> */}
          {!item.readStatus && <View style={AllChatsStyle.greenDot}/>}
        </View>
      </View>
      </TouchableHighlight>
    )
  }
  render(){
    let { searchText } = this.state;
    let filteredChatsByName = [];
    filteredChatsByName = this.state.chatOverview.filter((chat)=> chat.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ); 
    return(
      <View style={AllChatsStyle.container}>
        {this.renderHeader()}
        {this.state.loading && 
          <ActivityIndicator
            animating
            size="large"
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0a0a0a",
            }}
          color={Colors.primary}
        />
        }        
        {filteredChatsByName.length === 0 && !this.state.loading && (
          <View style={AllChatsStyle.emptyContainer }>
            <View>
              <Image
                style={AllChatsStyle.noMessagesImage}
                source={Images.noMessages}
              />
            </View>
            <Text style={AllChatsStyle.noMessagesText1}>
              NO MESSAGES
            </Text>
            <Text style={AllChatsStyle.noMessagesText2}>
              When you have messages from Buds they will appear here.
            </Text>
          </View>
        )}
        {filteredChatsByName.length !== 0 && !this.state.loading && (
          <View style={AllChatsStyle.flatListContainer}>
            <FlatList
              data={filteredChatsByName}
              numColumns={1}
              renderItem={this.renderListItem}
              keyExtractor={this._keyExtractor}
            />
          </View>
        )}
      </View>
    );
  }
}

AllChats.navigationOptions = ({ navigation }) => ({
	title: 'BUD CHAT',
	// headerTitleStyle: {
	// 	fontSize: 16,
	// 	letterSpacing: 0.8,
	// 	color: Colors.white,
	// 	fontFamily: 'ProximaNova-Regular'
  // },
  headerTitleStyle: Styles.headerTitleStyle,
	// headerStyle: {
  //   backgroundColor: 'black'
  // },
  headerStyle: Styles.headerStyle,
	headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(backAction);
          }}
          style={Styles.headerLeftContainer}
        >
          <Image source={Images.backButton} style={[ Styles.headerLeftImage, { height: 15, width: 8 }]} />
        </TouchableOpacity>
      ),
    headerRight: (
      <TouchableOpacity
        onPress = {()=> {
          navigateTo(navigation, 'AddChat',{
            refreshFunction: navigation.state.params.refreshFunction,
            from: navigation.state.params.from
          });
        }}
        style={Styles.headerRightContainer}
      >
        <Image style={[Styles.headerRightImage, { height: 15, width: 15 }]} source={Images.addNewChat}/>
      </TouchableOpacity> 
    ),
  tabBarVisible: false,
});

const mapStateToProps = ({ authReducer }) => {
  const { userData, token, loading } = authReducer;
  return { userData, token, loading };
};
export default connect(mapStateToProps, {updateLoading})(AllChats);
/*

          { {this.props.loading && 
            <ActivityIndicator  animating  size="large"  
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f0f'}}
              color={Colors.primary} 
            />
          } }


                    {/<View style={AllChatsStyle.addPhotoContainer}>
            <Image source={Images.addPhotoTabSelected} style={AllChatsStyle.addPhotoImage} />
          </View>}
*/
