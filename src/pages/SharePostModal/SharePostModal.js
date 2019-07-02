import React, { Component } from "react";
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import { Images, Colors, Styles, Metrics } from "./../../theme";
import { SharePostModalStyle } from "./SharePostModalStyle";
import { updateLoading } from "../../actions";
import { CachedImage } from "react-native-cached-image";
import CheckBox from 'react-native-check-box';
import { apiCall } from "./../../services/AuthService";
import asyncEach from 'async/each';
import { alert, toastMessage } from "./../../services/AlertsService";
import firebase from 'react-native-firebase';
import Snackbar from 'react-native-snackbar';
import PropTypes from 'prop-types';
import _ from 'lodash';
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');

class SharePostModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchMode: false,
      searchText: '',
      userList: []
    };
    this.conversationRef = firebase.firestore().collection('conversations');
    this.chatRef = firebase.firestore().collection('chats');
  }

  toggleSearchMode = () => {
    this.setState({
      searchMode : true
    });
  }
  onChangeText = (text) => {
    this.setState({
      searchText: text
    });
  }
  componentDidMount(){
    this.searchUsersFromApi();
  }
  showSnackBar = () => {
    let {selectedUserList, searchText, userList} = this.state;
    let selectedUsers = selectedUserList.filter((user)=> user.isSelected && user.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    let firstUsersName = selectedUsers[0].name;
    let selectedUserCount = selectedUsers.length; //userList.reduce((sum,user)=> sum + user.isSelected ? 1 : 0,0);
    asyncEach(selectedUsers,(user,callback)=>{
      this.updateUnreadStatus(this.props.userData._id, user._id,callback);
    },(err)=>{
      let title = '';
      if(err){
        title = 'Something went wrong';
      } else {
        title = `Message sent to ${firstUsersName} `;
        title += selectedUserCount > 1 ? `and ${selectedUserCount - 1} others` : '';
      }
      //let unselectedUserList = userList.map((user)=>{ user.isSelected= false; return user});
      this.setState({
        //userList: unselectedUserList,
        searchText: '',
        searchMode: false
      });
      setTimeout(()=> 
        Snackbar.show({
          title: title,
          duration: Snackbar.LENGTH_LONG,
        })
        ,1000);
    });
  }
  updateUnreadStatus = (senderId, receiverId,callback) => {
    this.conversationRef
    //.where(`chatID`, '==', this.state.chatID)
    .where(`collaborators.${senderId}._id`, '==', senderId)
    .where(`collaborators.${receiverId}._id`, '==',receiverId)
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
          callback();
        }).catch((err)=>{
          callback(err);
        });
      } else {
        callback();
      }
    });
  }
  sendNotification = (dataObj) => {
    let headers = {
      "Content-Type": "application/json",
      firebaseNotificationKey: Metrics.firebaseNotificationKey //"k5z2fALWstAcg3W23c9ZZKRPKLDBshJM"
    };
      apiCall('users/firebaseNotifications',dataObj,headers)
      .then(response=>{
      })
      .catch((err)=>{
      });
  }

  searchUsersFromApi = () => {
    const data = {
      userId: this.props.userData._id,
      query: ''
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    return new Promise((resolve, reject) => {
      apiCall("users/searchUser", data, headers)
      .then(response => {
        this.setState({
          userList: response.result.length ? response.result : []
        });
        this.props.updateLoading(false);
      })
      .catch(error=> {
        reject(error);
      });
    });
  }
  componentWillReceiveProps(nextProps){
  }
  selectItem = (user,index) => {
    let userList = [...this.state.userList];
    let selectedUserObj = userList.find((userItem)=> userItem._id === user._id);
    if(selectedUserObj.isSelected){
      selectedUserObj.isSelected = false;
    } else{
      selectedUserObj.isSelected = true;
    }
    this.setState({
      userList: userList
    });
  }
  addSharedMessage = (chatID,receiverId,receiverName) => {
    return new Promise((resolve,reject)=>{
      const {post} = this.props;
      const image = post.medias[0].mediaType === 2 ? post.medias[0].thumbnail : post.medias[0].mediaUrl;
      const userID = this.props.userData._id;
      const name = this.props.userData.name;
      const avatar = this.props.userData.profileImageUrl;
      const createdDate =  new Date();
      const chatObj = {
        post: post,
        _id: uuidv4(),
        image: image,
        conversationID: chatID,
        createdAt: createdDate,
        readStatus: false,
        type: 'post',
        text: this.state.shareMessage,
        timestamp: createdDate.getTime(),
        user: {
          _id: userID,
          name: name,
          avatar: avatar
        }
      };
      this.chatRef.add(chatObj)
      .then((docRef)=>{
        this.sendNotification({senderId:userID,receiverId:receiverId,data:{chatID:chatID,chatUserId:receiverId,chatName:receiverName}});
          resolve({status:true}); 
      })
      .catch((error)=>{
      }); 
    });
  }

  // this.showSnackBar();
  sendChat = () => {
    this.props.toggleModalVisibility();
    const {userList, searchText} = this.state;
    let selectedUsers = userList.filter(user=> user.isSelected && user.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);

    let unselectedUserList = userList.map((user)=>{
      user = _.cloneDeep(user); 
      user.isSelected= false; 
      return user;
    });
    this.setState({
      userList: unselectedUserList,
      selectedUserList: selectedUsers,
      searchText: '',
      searchMode: false
    });

    asyncEach(selectedUsers,this.addChat,(err)=>{
      if(err){
        alert('Something went wrong',err);
      } else {
        this.showSnackBar();
      }
    });
  }
  addChat = (item,callback) => {
    let otherUserId= item._id;
    let {_id} = this.props.userData;

    //this.props.updateLoading(true);

    this.conversationRef
    .where(`collaborators.${_id}._id`, '==', _id)
    .where(`collaborators.${otherUserId}._id`, '==',otherUserId)
    .get()
    .then(querySnapShot=>{
      let doesConversationExist = querySnapShot.docs.length ? true: false;
      if(!doesConversationExist){
        var conversationObj = {};
        conversationObj.chatID = uuidv1();
        conversationObj.timestamp = new Date().getTime();
        conversationObj.collaborators = {
          [_id]: Object.assign({},this.props.userData,{initiator:true}),
          [otherUserId]: item  //Object.assign({},item,{readStatus: true})
        };
        this.conversationRef.add(conversationObj)
        .then((docRef)=>{
          //navigate to chat message screen with conversationObj.chatID and other params
          this.addSharedMessage(conversationObj.chatID,item._id,item.name).then(()=>{
            this.setState({
              chatID: conversationObj.chatID,
              chatName: item.name,
              chatUserId: item._id
            });
            callback();
            //this.props.updateLoading(false);
            //this.showSnackBar();
          });

        })
        .catch((error)=>{
          callback(error);
        });
      } else {
        let chatID = '';
        querySnapShot.forEach((conversationDoc)=>{
          let conversationData  = conversationDoc.data();
          chatID = conversationData.chatID;
        });
        
        this.addSharedMessage(chatID,item._id,item.name).then(()=>{
          this.setState({
            chatID: chatID,
            chatName: item.name,
            chatUserId: item._id
          });
          callback();
        });
      }
    });
  }

  renderListItem = (item,index) => {
    const {userList, searchText} = this.state;

    let selectedUserObj = userList[index];

    return (
      <View key={item._id} style={SharePostModalStyle.listRow}>
        <View style={SharePostModalStyle.imageContainer}>
          <CachedImage 
                    style= {SharePostModalStyle.userProfileImage}
                    source= {{ uri: item.thumbnail }}
                    defaultSource= {Images.defaultUser}
                    fallbackSource= {Images.defaultUser}
                    activityIndicatorProps= {{ display: "none", opacity: 0 }}
                  >
                  {(selectedUserObj.isSelected) ? 
                   <Image
                    source={Images.selectedMultipleImages}
                    style={SharePostModalStyle.checkBoxImageStyle}
                  />  :
                  null
                }
          </CachedImage>
        </View>
        <View style={SharePostModalStyle.detailContainer}>
          <TouchableWithoutFeedback onPress={() => this.selectItem(item,index)}>
            <View style={SharePostModalStyle.usernameContainer}>
              <Text style={SharePostModalStyle.username}>{item.name}</Text>
              <Text style={SharePostModalStyle.username}>{item.username}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };



  renderScrollViewItem = (item,index) => {
    return(
      <View style={{marginRight:20, maxWidth: Platform.OS === 'ios' ? 70 : 80}} key={item._id}>
          <CheckBox
            onClick={() => this.selectItem(item,index)}
            isChecked={item.isSelected}
            key={item._id}
            checkedImage={
              <View>
                <CachedImage 
                    style= {SharePostModalStyle.userProfileImage}
                    source= {{ uri: item.thumbnail }}
                    defaultSource= {Images.defaultUser}
                    fallbackSource= {Images.defaultUser}
                    activityIndicatorProps= {{ display: "none", opacity: 0 }}
                  >
                  <Image
                    source={Images.selectedMultipleImages}
                    style={SharePostModalStyle.checkBoxImageStyle}
                  />
                </CachedImage>
                <Text style={{color:Colors.black,textAlign:'center', marginTop:5}} numberOfLines={1} ellipsizeMode={'tail'}>
                  {item.name}
                </Text>
                <Text style={{color: Colors.black,Opacity:25,textAlign:'center', marginTop:5}} numberOfLines={1} ellipsizeMode={'tail'}>
                  {item.username}
                </Text>
              </View>
          }
            unCheckedImage={
              <View>
                <CachedImage 
                    style= {SharePostModalStyle.userProfileImage}
                    source= {{ uri: item.thumbnail }}
                    defaultSource= {Images.defaultUser}
                    fallbackSource= {Images.defaultUser}
                    activityIndicatorProps= {{ display: "none", opacity: 0 }}
                >
                </CachedImage>
                <Text style={{color:Colors.black,textAlign:'center', marginTop:5}} numberOfLines={1} ellipsizeMode={'tail'}>
                  {item.name}
                </Text>
                <Text style={{color: Colors.black,Opacity:25,textAlign:'center', marginTop:5 }} numberOfLines={1} ellipsizeMode={'tail'}>
                  {item.username}
                </Text>
              </View>
            }
        />
      </View>
    );
  }

  handleClearSearchText = () => {
    this.setState({searchText: ''})
  }

  renderClearSearchTextButton = () => {
    if(this.state.searchText === '') { 
      return null
     } else{
      return (
        <TouchableOpacity 
          style={SharePostModalStyle.cancelSearchButton}
          onPress={() => {this.handleClearSearchText()}}
         >
         <View>
            <Image source={Images.closeIconWhite} style={SharePostModalStyle.closeIcon} />
         </View>
        </TouchableOpacity>
        )
     }
  }

  render() {
    const { modalVisible, toggleModalVisibility } = this.props;
    const {searchText, userList} = this.state;
    let filteredUsersByName = [];
    filteredUsersByName = userList.filter((user)=> user.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 );
    let allUnselected = !(userList.some((user)=> user.isSelected));
    return (
      <Modal 
        animationType = {"fade"}
        transparent = {true}
        visible = {modalVisible}
        onRequestClose = {()=>  toggleModalVisibility()}
      >
      <KeyboardAvoidingView 
        behavior={Platform.select({
          ios: 'padding'
        })}
        style={SharePostModalStyle.modalContainer} 
      >
          <TouchableOpacity  style={{flex:1}} onPress={()=>{

          let unselectedUserList = this.state.userList.map((user) => {
            user.isSelected = false;
            return user
          });
            this.setState({userList: unselectedUserList, searchText: '', searchMode: false});
                  toggleModalVisibility();
            }}>
            
          </TouchableOpacity>
          <View style={{backgroundColor: '#FFFFFF',borderRadius : 20, marginBottom : -20}}>
            { 
              <TouchableOpacity
                onPress={() => {this.toggleSearchMode()} }
              >
              <View  style={{height : 60,	borderBottomWidth: 1.0,borderBottomColor: 'rgba(255, 255, 255, 0.06)'}}>
                {/* <View style={Styles.headerLeftContainer}>
                  <Image
                    source={Images.searchPeople}
                    style={[SharePostModalStyle.iconStyle, SharePostModalStyle.iconStyleDefault]}
                  />
                </View> */}
                <Text style={{fontFamily:'SourceSansPro-Regular',marginTop : 20,fontSize:16, backgroundColor: 'transparent',alignSelf:'center',textAlign:'center'}}>
                  SEND TO
              </Text>
              </View>
              </TouchableOpacity>
            }
            <View style={SharePostModalStyle.userListContainer}>
              <ScrollView
                vertical
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                automaticallyAdjustContentInsets={false}
                directionalLockEnabled
                contentContainerStyle={{justifyContent:'space-around', flexDirection:'column'}}
              >
              {filteredUsersByName.map(this.renderListItem)}
            </ScrollView>
            </View>
            {allUnselected ?
              <View >
                
              </View>
              :
              <TouchableOpacity style={SharePostModalStyle.sendButton} onPress={this.sendChat}>
                  <Image source={Images.Share_new} style={{marginLeft : 10,width : 50, height : 50}} />
              </TouchableOpacity>
            }
          </View>
          </KeyboardAvoidingView>
      </Modal>
    );
  }
}

SharePostModal.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  post: PropTypes.object.isRequired,
  toggleModalVisibility: PropTypes.func.isRequired
}
const mapStateToProps = ({ authReducer }) => {
  const { userData, loading, token } = authReducer;
  return { userData, loading, token };
};
export default connect(mapStateToProps, { updateLoading })(SharePostModal);

