import React, { Component } from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  Image,
  NetInfo,
  View,
  Text,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { CachedImage } from "react-native-cached-image";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { Card, CardSection, Button, CustomPicker, NoNetworkView } from "../../components";
import { FavouritesSavedGroupsStyle } from './FavouritesSavedGroupsStyle';
import { Images, Colors, Styles } from './../../theme';
import { StackNavigator } from 'react-navigation';
import NewGroupModal from '../NewGroupModal/NewGroupModal';
import AddFromSaved from '../AddFromSaved/AddFromSaved';
import { alert } from "./../../services/AlertsService";
import { apiCall } from "./../../services/AuthService";
import { addGroup, updateSingleGroup, updateGroups, updateIsGroupAvailable } from "./../../actions";
import { navigateTo } from '../../services/CommonFunctions';

class FavouritesSavedGroups extends Component {
  constructor(props) {
    super(props);
    this.newGroupAction = this.newGroupAction.bind(this);
    this.state = {
      isGroupsAvailable: 0, // 0 for loading, 1 for no posts, 2 for posts
      refreshing: false,
      isNewGroupModalVisible: false,
      isAddFromSavedModalVisible: false,
      newGroupName: "",
      isCreatingGroup: false, //flag to show the group creating indicator when makin api call
      lastAddedGroupId: null,
      isConnected: true,
      isLoading: true
    };
    DeviceEventEmitter.addListener("refreshSaved", e => {
      this.getGroups();
    });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      newGroupAction: this.newGroupAction
    });
    NetInfo.isConnected.fetch().then(isConnected => {
      isConnected ? this.getGroups() : this.setState({ isConnected: false, isLoading: false });
    });
    NetInfo.isConnected.addEventListener('change', this._handleConnectionChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('change', this._handleConnectionChange);
  }

  _handleConnectionChange = (isConnected) => {
    if(isConnected) {
      this.setState({ isConnected: true }, () => {
        this.setState({ isLoading: true });
        this.getGroups();
      })
    } else {
      this.setState({ isConnected: false })
    }
  };

  getGroups() {
    const data = {
      userId: this.props.userData._id
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/getAllCollection", data, headers)
      .then(response => {
        if (response.status) {
          this.props.updateGroups(response.result);
          if (this.props.groups.length > 0) {
            this.setState({
              isGroupsAvailable: 2,
              refreshing: false,
              isLoading: false
            });
          } else {
            this.setState({
              isGroupsAvailable: 1,
              refreshing: false,
              isLoading: false
            });
          }
        } else {
          this.setState({ refreshing: false, isLoading: false });
        }
      })
      .catch(error => {
        this.setState({ refreshing: false, isLoading: false }, () => {
          alert("Failed", "Failed to get your groups!");
        });
      });
  }

  newGroupAction() {
    this.state.isConnected ? this.setState({ isNewGroupModalVisible: true }) : alert('No internet connection', 'Please check your network connectivity.');
  }

  groupCancelAction() {
    this.setState({ isNewGroupModalVisible: false });
  }

  groupNextAction = (newGroupName) => {
    if(newGroupName.length > 0) {
      this.setState({
        newGroupName: newGroupName,
        isAddFromSavedModalVisible: true,
        isNewGroupModalVisible: false
      });
      this.setState({ isCreatingGroup: true }, () => {
      const data = {
        "user": this.props.userData._id,
        "post": [],
        "name": this.state.newGroupName	
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
        userid: this.props.userData._id
      };
      apiCall("posts/saveCollection", data, headers)
        .then(response => {
          if(response.status) {
            this.setState({ lastAddedGroupId: response.result[0]._id }, () => {
              this.props.addGroup(response.result[0]);
            });
          } else {
            alert('Failed', response.message);
          }
        }).catch(error => {
            alert("Failed", error.message ? error.message : 'Something went wrong!');
        })
      });
    } else {
      alert('Alert', 'Please give group a name.');
    }
  }

  savedCancelAction() {
    this.setState({ isAddFromSavedModalVisible: false });
  }

  savedNextAction = (selectedImages) => {
    if(selectedImages.length == 0) {
      this.setState({ newGroupName: '', isAddFromSavedModalVisible: false });
    } else {
      this.setState({ isCreatingGroup: true }, () => {
        const data = {
          "collectionId": this.state.lastAddedGroupId,
          "post": selectedImages,
        };
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.props.token,
          userid: this.props.userData._id
        };
        apiCall("posts/updateCollectionPost", data, headers)
          .then(response => {
            if(response.status) {
              this.props.updateSingleGroup(response.result[0]);
              this.setState({ newGroupName: '', isAddFromSavedModalVisible: false });
            } else {
              alert('Failed', response.message);
            }
          }).catch(error => {
              alert("Failed", error.message ? error.message : 'Something went wrong!');
          });
      });
    }
  };

  _keyExtractor = (item, index) => item._id;

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.getGroups();
      }
    );
  };

  openGroup(item, index) {
    navigateTo(this.props.navigation, 'GroupDetails', {
      group: item,
      groupIndex: index
    })
  }

  subTitle() {
    return (
      <View style={FavouritesSavedGroupsStyle.subTitleContainer}>
        <Text style={FavouritesSavedGroupsStyle.subTitle}>
          Saved items Are Private
        </Text>
      </View>
    );
  }

  noGroups() {
    return (
      <View style={FavouritesSavedGroupsStyle.noGroupsContainer}>
        <View>
          <Image
            style={FavouritesSavedGroupsStyle.createGroupImage}
            source={Images.createGroup}
          />
        </View>
        <Text style={FavouritesSavedGroupsStyle.createGroupTitle}>
          CREATE GROUPS
        </Text>
        <Text style={FavouritesSavedGroupsStyle.createGroupDesc}>
          Groups can be created to organize strain reviews, videos, recipes or
          anything else you want to refer to later.
        </Text>
      </View>
    );
  }

  renderGroupItem = ({ index, item }) => {
    if (item.postEmptyOrNot === true) {
      return (
        <View
          style={FavouritesSavedGroupsStyle.imageInListEmpty}
          key={item._id ? item._id : index}
        >
          <TouchableOpacity
            onPress={() => this.openGroup(item, index)}
            activeOpacity={0.8}
            style={FavouritesSavedGroupsStyle.imageInListEmpty}
          >
            {/* <LinearGradient
              colors={["transparent", "#000000"]}
              style={FavouritesSavedGroupsStyle.groupOverlay}
              // locations={[0.8,0.1]}
            >
              <Text style={FavouritesSavedGroupsStyle.groupName}>
                {item.name}
              </Text>
            </LinearGradient> */}
            <ImageBackground
              source={Images.groupOverlay}
              style={FavouritesSavedGroupsStyle.groupOverlayStyle}
            >
              <Text style={FavouritesSavedGroupsStyle.groupName}>
                {item.name}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      );
    } else {
      if (item.posts[0].medias[0].mediaType == 2) {
        return (
          // <LinearGradient
          //   colors={["transparent", "#000000"]}
          //   style={FavouritesSavedGroupsStyle.groupOverlay}
          //   // locations={[0.8,0.1]}
          //   key={item._id}
          // >
            <TouchableOpacity
              onPress={() => this.openGroup(item, index)}
              activeOpacity={0.8}
              key={item._id}
              style={FavouritesSavedGroupsStyle.imageInList}
            >
              <CachedImage
                style={FavouritesSavedGroupsStyle.imageInList}
                source={{ uri: item.posts[0].medias[0].thumbnail }}
                defaultSource={Images.placeHolder}
                activityIndicatorProps={{ display: "none", opacity: 0 }}
              >
                <Image
                  source={Images.videoIcon}
                  style={FavouritesSavedGroupsStyle.videoIconStyle}
                />
              </CachedImage>
              <ImageBackground
                source={Images.groupOverlay}
                style={FavouritesSavedGroupsStyle.groupOverlayStyle}
              >
                <Text style={FavouritesSavedGroupsStyle.groupName}>
                  {item.name}
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          // </LinearGradient>
        );
      } else {
        if (item.posts[0].medias.length > 1) {
          return (
            // <LinearGradient
            //   colors={["transparent", "#000000"]}
            //   style={FavouritesSavedGroupsStyle.groupOverlay}
            //   // locations={[0.8,0.1]}
            //   key={item._id}
            // >
              <TouchableOpacity
                onPress={() => this.openGroup(item, index)}
                activeOpacity={0.8}
                key={item._id}
                style={FavouritesSavedGroupsStyle.imageInList}
              >
                <CachedImage
                  style={FavouritesSavedGroupsStyle.imageInList}
                  source={{ uri: item.posts[0].medias[0].mediaUrl }}
                  defaultSource={Images.placeHolder}
                  activityIndicatorProps={{ display: "none", opacity: 0 }}
                >
                  <Image
                    source={Images.multipleImages}
                    style={FavouritesSavedGroupsStyle.multipleImageIconStyle}
                  />
                </CachedImage>
                <ImageBackground
                  source={Images.groupOverlay}
                  style={FavouritesSavedGroupsStyle.groupOverlayStyle}
                >
                  <Text style={FavouritesSavedGroupsStyle.groupName}>
                    {item.name}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            /* </LinearGradient> */
          );
        } else {
          return (
            // <LinearGradient
            //   colors={["transparent", "#000000"]}
            //   style={FavouritesSavedGroupsStyle.groupOverlay}
            //   // locations={[0.8,0.1]}
            //   key={item._id}
            // >
              <TouchableOpacity
                onPress={() => this.openGroup(item, index)}
                activeOpacity={0.8}
                key={item._id}
                style={FavouritesSavedGroupsStyle.imageInList}
              >
                <CachedImage
                  style={FavouritesSavedGroupsStyle.imageInList}
                  source={{ uri: item.posts[0].medias[0].mediaUrl }}
                  defaultSource={Images.placeHolder}
                  activityIndicatorProps={{ display: "none", opacity: 0 }}
                />
                <ImageBackground
                  source={Images.groupOverlay}
                  style={FavouritesSavedGroupsStyle.groupOverlayStyle}
                >
                  <Text style={FavouritesSavedGroupsStyle.groupName}>
                    {item.name}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            //</LinearGradient>
          );
        }
      }
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "#0a0a0a"
        }}
      >
        {this.subTitle()}
        {this.state.isLoading && (
          <ActivityIndicator
            animating
            size="large"
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0a0a0a"
            }}
            color={Colors.primary}
          />
        )}
        {this.state.isConnected && !this.state.isLoading && this.props.isGroupsAvailable == 1 && this.noGroups()}
        {this.state.isConnected && !this.state.isLoading && this.props.isGroupsAvailable == 2 && (
          <FlatList
            data={this.props.groups}
            numColumns={1}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderGroupItem}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            ItemSeparatorComponent={() => (
              <View style={FavouritesSavedGroupsStyle.listItemBorder} />
            )}
            extraData={this.state}
            showsVerticalScrollIndicator={false}
          />
        )}
        {!this.state.isConnected && <NoNetworkView />}
        <NewGroupModal
          modalVisible={this.state.isNewGroupModalVisible}
          groupCancelAction={() => this.groupCancelAction()}
          groupNextAction={this.groupNextAction}
        />
        <AddFromSaved
          modalVisible={this.state.isAddFromSavedModalVisible}
          savedCancelAction={() => this.savedCancelAction()}
          savedNextAction={this.savedNextAction}
        />
      </View>
    );
  }
}
FavouritesSavedGroups.navigationOptions = ({navigation}) => ({
  tabBarLabel: ({ focused }) => (
    <Text style={focused ? FavouritesSavedGroupsStyle.tabLabelActive : FavouritesSavedGroupsStyle.tabLabel}>
      Groups
    </Text>
	),
  headerRight: (
    <TouchableOpacity
      onPress={() => navigation.state.params.newGroupAction()}
      style={Styles.headerRightContainer}
      activeOpacity={0.5}
    >
      <Image
        source={Images.plusIcon}
        style={[
          Styles.headerRightImage,
          {
            height: 15,
            width: 15
          }
        ]}
      />
    </TouchableOpacity>
  )
});

const mapStateToProps = ({ authReducer, groupReducer }) => {
  const { userData, loading, token } = authReducer;
  const { groups, isGroupsAvailable } = groupReducer;
  return { userData, loading, token, groups, isGroupsAvailable };
};
export default connect(mapStateToProps, { addGroup, updateSingleGroup, updateGroups, updateIsGroupAvailable })(
  FavouritesSavedGroups
);