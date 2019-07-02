import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  Image,
  View,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import { CachedImage } from "react-native-cached-image";
import firebase from "react-native-firebase";
import { NavigationActions } from "react-navigation";
import { Colors, Images, Styles } from '../../theme';
import { AddChatStyle } from "./AddChatStyle";
import { updateLoading } from '../../actions';
import { calculateTimeDuration, calculateTimeDurationShort, navigateTo } from './../../services/CommonFunctions';
import Input from "../../components/Input/Input";
import { apiCall } from '../../services/AuthService';
const uuidv1 = require('uuid/v1');
 
const backAction = NavigationActions.back({
    key: null
});

class AddChat extends Component {
  constructor(props){
    super(props);
    this.conversationRef = firebase.firestore().collection('conversations');
    this.state = {
      searchText: '',
      chatUserList: [],
      disableSelect: false
    }
  }
  componentWillMount(){
    this.setState({
      loading: true
    });
    this.searchUsersFromApi();
  }

  onChangeText = (text) => {
    this.setState({
      searchText: text
    });
  }
  _keyExtractor = (item,index) => {
    return item._id;
  }
  renderHeader = () => {
    return (
      <Input
        icon="searchPeople"
        placeholder="Search"
        placeholderTextColor={Colors.placeholderTextColor}
        style={[{ paddingLeft: 20 }, Styles.thinBottomBorder7, ]}
        onChangeText={ text => {
          this.onChangeText(text);
        }}
        customIconStyle={{ height: 23.7, width: 23.7, alignSelf: 'flex-start' }}
      />
    );
  }

  gotoChat = (item) => {
    let otherUserId= item._id;
    let {_id} = this.props.userData;
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
          [otherUserId]: Object.assign({},item,{readStatus: true})
        };
        this.conversationRef.add(conversationObj)
        .then((docRef)=>{
          //navigate to chat message screen with conversationObj.chatID and other params
          setTimeout(() => {
            this.setState({ disableSelect: false });
          }, 200);
          navigateTo(this.props.navigation, 'ChatMessages', {
            chatID: conversationObj.chatID,
            chatName: item.name,
            chatUserId: item._id,
            from: this.props.navigation.state.params.from
          });
        })
        .catch((error)=>{
        });
      } else {
        let chatID = '';
        querySnapShot.forEach((conversationDoc)=>{
          let conversationData  = conversationDoc.data();
          chatID = conversationData.chatID;
        });
        setTimeout(() => {
          this.setState({ disableSelect: false });
        }, 200);
        navigateTo(this.props.navigation, 'ChatMessages', {
          chatID: chatID,
          chatName: item.name,
          chatUserId: item._id,
          from: this.props.navigation.state.params.from
        });
      }
    });
    //make an entry in conversations collection if entry not already there
  }

  renderListItem = ({ item, index }) => { 
    const { disableSelect } = this.state;
    return (
      <TouchableHighlight
        onPress={() => {
          if (!disableSelect){
            this.setState({
              disableSelect: true
            }); 
            this.gotoChat(item); 
          }
        } 
      }
      > 
      <View style={AddChatStyle.flatItemContainer}>
        <View style={AddChatStyle.chatUserImageContainer}>
          <CachedImage 
            style= {AddChatStyle.chatUserProfileImage}
            source= {{ uri: item.profileImageUrl }}
            defaultSource= {Images.defaultUser}
            fallbackSource= {Images.defaultUser}
            activityIndicatorProps= {{ display: "none", opacity: 0 }}
          />
        </View>
        <View style={AddChatStyle.chatDetail} >
            <Text style={[AddChatStyle.chatName]}>
              {item.name}
            </Text>
        </View>
      </View>
    </TouchableHighlight>
    );
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
          chatUserList: response.result.length ? response.result : []
        });
        //this.props.updateLoading(false);
        this.setState({
          loading: false
        });
      })
      .catch(error=> {
        reject(error);
      });
    });
  }
  render(){
    let { searchText } = this.state;
    let filteredUsersByName = [];
    filteredUsersByName = this.state.chatUserList.filter((user)=> user.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ); 
    return(
      <View style={AddChatStyle.container}>
        {this.renderHeader()}
        {this.state.loading && 
          <ActivityIndicator  animating  size="large"  
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a'}}
          color={Colors.primary} 
          />
        }
        {!this.state.loading && !filteredUsersByName.length && <View style={AddChatStyle.noUsersContainer}>
              <Text style={AddChatStyle.noUsersText}> No Users Found</Text>
            </View>
        }
        <View style={AddChatStyle.flatListContainer}>
          <FlatList 
            data={filteredUsersByName} 
            numColumns={1} 
            renderItem={this.renderListItem} 
            keyExtractor={this._keyExtractor} 
          />
        </View>
      </View>
    );
  }
}

AddChat.navigationOptions = ({ navigation }) => ({
	title: 'ADD CHAT',
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
      <Image source={Images.backButton} style={[Styles.headerLeftImage, { height: 15, width: 8 }]} />
    </TouchableOpacity>
  ),
  tabBarVisible: false,
	tabBarIcon: ( { focused } ) => {
		if ( focused ) {
			return <Image style={{
					width: 18,
					height: 20
				}} source={Images.homeTabSelected}/>
		}
		return <Image style={{
				width: 18,
				height: 20
			}} source={Images.homeTab}/>
	}
});
const mapStateToProps = ({ authReducer }) => {
    const { userData, token, loading } = authReducer;
    return { userData, token, loading };
};
export default connect(mapStateToProps, {updateLoading})(AddChat);