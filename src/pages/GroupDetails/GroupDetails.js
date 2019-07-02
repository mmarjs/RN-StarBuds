import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native";
import ActionSheet from "react-native-actionsheet";
import { NavigationActions } from "react-navigation";
import { CachedImage } from "react-native-cached-image";
import CheckBox from 'react-native-check-box';
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import { Images, Colors, Styles } from "./../../theme";
import { GroupDetailsStyle } from "./GroupDetailsStyle";
import { AddFromSavedStyle } from "../AddFromSaved/AddFromSavedStyle";
import { FavouritesSavedAllStyle } from "../FavouriteSavedAll/FavouritesSavedAllStyle";
import { NewGroupModalStyle } from "../NewGroupModal/NewGroupModalStyle";
import { apiCall } from "./../../services/AuthService";
import { alert } from './../../services/AlertsService';
import { filterArrayByValue, navigateTo } from './../../services/CommonFunctions';
import {
  updateSingleGroup,
  deleteSingleGroup
} from "./../../actions";

let selectedPostsIndices = new Array();
let selectedPosts = new Array();
const backAction = NavigationActions.back({ key: null });
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 3;
const options = ["Cancel", "Change group name", "Add posts in group", "Delete"];
const title = "Group Options";

class GroupDetails extends Component {
  constructor(props) {
    super(props);
    this.openGroupOptions = this.openGroupOptions.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.state = {
      group: this.props.navigation.state.params.group,
      selected: "",
      newGroup: this.props.navigation.state.params.group.name,
      updateGroupNameVisible: false,
      addImagesVisible: false,
      isUpdating: false,
      postsNotAdded: [],
      refreshinPostsNotAdded: false,
      postsNotAddedFlag: 0 //1 for failure
    };
  }

  getPostsNotAdded() {
    const data = {
      user: this.props.userData._id,
      collectionId: this.state.group._id
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/getPostsNotExistInCollection", data, headers)
      .then(response => {
        if (response.status) {
          this.setState({
            postsNotAdded: response.result,
            refreshinPostsNotAdded: false
          });
        } else {
          this.setState({
            postsNotAddedFlag: 1,
            refreshinPostsNotAdded: false
          });
        }
      })
      .catch(error => {
        this.setState({
          postsNotAddedFlag: 1,
          refreshinPostsNotAdded: false
        });
      });
  }

  openPostDetails(item) {
    navigateTo(this.props.navigation, 'PostDetails', {
      post: item,
      user: item.userDetails,
      from: "Profile"
    });
  }

  getActionSheetRef = ref => {
    this.actionSheet = ref;
  };

  openGroupOptions() {
    this.actionSheet.show();
  }

  updateGroupName() {
    this.setState({ isUpdating: true });
    const newGroup = this.state.group;
    newGroup.name = this.state.newGroup;
    const data = {
      collectionId: this.state.group._id,
      name: this.state.newGroup
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/updateCollectionName", data, headers)
      .then(response => {
        if (response.status) {
          this.props.navigation.setParams({ group: response.result[0] });
          this.props.updateSingleGroup(response.result[0]);
          this.setState({ isUpdating: false }, () => {
            this.setState({
              group: response.result[0],
              updateGroupNameVisible: false
            });
          });
        } else {
          this.setState({ isUpdating: false }, () => {
            alert("Failed", response.message);
          });
        }
      })
      .catch(error => {
        this.setState({ isUpdating: false }, () => {
          alert("Failed", error.message ? error.message : "Failed to update group name!");
        });
      });
  }

  deleteGroup() {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete "+this.state.group.name+"?",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            this.setState({ isUpdating: true });
            const newGroup = this.state.group;
            newGroup.name = this.state.newGroup;
            const data = {
              collectionId: this.state.group._id,
            };
            const headers = {
              "Content-Type": "application/json",
              Authorization: "Bearer " + this.props.token,
              userid: this.props.userData._id
            };
            apiCall("posts/deleteCollection", data, headers)
              .then(response => {
                if (response.status) {
                  this.props.deleteSingleGroup(this.state.group);
                  this.setState({ isUpdating: true }, () => {
                    this.setState(
                      {
                        updateGroupNameVisible: false
                      },
                      () => {
                        this.props.navigation.dispatch(backAction);
                      }
                    );
                  });
                } else {
                  this.setState({ isUpdating: true }, () => {
                    alert("Failed", response.message);
                  });
                }
              })
              .catch(error => {
                this.setState({ isUpdating: true }, () => {
                  alert("Failed", error.message ? error.message : "Failed to update group name!");
                });
              });
          }
        }
      ],
      { cancelable: false }
    );
  }

  handlePress(i) {
    this.setState({
      selected: i
    });
    switch (i) {
      case 1:
        this.setState({ updateGroupNameVisible: true });
        break;
      case 2:
        this.setState({ addImagesVisible: true });
        break;
      case 3:
        this.deleteGroup();
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      openGroupOptions: this.openGroupOptions,
      groupDetailsBackAction: this.groupDetailsBackAction
    });
    this.getPostsNotAdded();
  }

  _keyExtractor = (item, index) => item._id;

  renderGridItem = ({ index, item }) => {
    if (item.medias[0].mediaType == 2) {
      return (
        <TouchableOpacity onPress={() => this.openPostDetails(item)}>
          <CachedImage
            style={FavouritesSavedAllStyle.imageInGrid}
            source={{ uri: item.medias[0].thumbnail }}
            defaultSource={Images.placeHolder}
            activityIndicatorProps={{
              display: "none",
              opacity: 0
            }}
          >
            <Image
              source={Images.videoIcon}
              style={GroupDetailsStyle.videoIconStyle}
            />
          </CachedImage>
        </TouchableOpacity>
      );
    } else {
      if (item.medias.length > 1) {
        return (
          <TouchableOpacity onPress={() => this.openPostDetails(item)}>
            <CachedImage
              style={FavouritesSavedAllStyle.imageInGrid}
              source={{ uri: item.medias[0].thumbnail }}
              defaultSource={Images.placeHolder}
              activityIndicatorProps={{
                display: "none",
                opacity: 0
              }}
            >
              <Image
                source={Images.multipleImages}
                style={GroupDetailsStyle.multipleImageIconStyle}
              />
            </CachedImage>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity onPress={() => this.openPostDetails(item)}>
            <CachedImage
              style={FavouritesSavedAllStyle.imageInGrid}
              source={{ uri: item.medias[0].thumbnail }}
              defaultSource={Images.placeHolder}
              activityIndicatorProps={{
                display: "none",
                opacity: 0
              }}
            />
          </TouchableOpacity>
        );
      }
    }
  };

  updateGroupNameCancel() {
    this.setState({
      newGroup: this.props.navigation.state.params.group.name,
      updateGroupNameVisible: false
    });
  }

  addImagesInGroupCancel() {
    this.setState({
      newGroup: this.props.navigation.state.params.group.name,
      addImagesVisible: false
    });
  }

  checkUncheckPost(index, post) {
    const newArray = [...this.state.postsNotAdded];
    if (newArray[index].checked) {
      newArray[index].checked = false;
      selectedPosts = filterArrayByValue(selectedPosts, post);
      selectedPostsIndices = filterArrayByValue(selectedPostsIndices, post._id);
      this.setState({ postsNotAdded: newArray });
    } else {
      newArray[index].checked = true;
      selectedPosts.push(post);
      selectedPostsIndices.push(post._id);
      this.setState({ postsNotAdded: newArray });
    }
  }

  updateGroupImages() {
    this.setState({ isUpdating: true });
    const data = {
      collectionId: this.state.group._id,
      post: selectedPostsIndices
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/updateCollectionPost", data, headers)
      .then(response => {
        if (response.status) {
          this.props.updateSingleGroup(response.result[0]);
          this.setState({ group: response.result[0] }, () => {
            this.setState({ isUpdating: false }, () => {
              this.setState({ addImagesVisible: false });
            });
          });
        } else {
          selectedPosts = [];
          selectedPostsIndices = [];
          this.setState({ isUpdating: false }, () => {
            alert("Failed", response.message);
          });
        }
      })
      .catch(error => {
          this.setState({ isUpdating: false }, () => {
            alert("Failed", error.message ? error.message : "Failed to add images in " + this.state.group.name + "!");
          });
      });
  }

  handleRefreshPostsNotAdded = () => {
    this.setState(
      {
        refreshinPostsNotAdded: true
      },
      () => {
        this.getPostsNotAdded();
      }
    );
  };

  renderPostsNotAddedGridItem = ({ index, item }) => {
    if (item.post) {
      if (item.post.medias[0].mediaType == 2) {
        return (
          <CheckBox
            style={FavouritesSavedAllStyle.imageInGrid}
            onClick={() => this.checkUncheckPost(index, item.post)}
            isChecked={item.post.checked}
            checkedImage={
              <CachedImage
                style={FavouritesSavedAllStyle.imageInGrid}
                source={{ uri: item.post.medias[0].thumbnail }}
                defaultSource={Images.placeHolder}
                activityIndicatorProps={{
                  display: "none",
                  opacity: 0
                }}
              >
                <Image
                  source={Images.selectedMultipleImages}
                  style={AddFromSavedStyle.checkBoxImageStyle}
                />
                <Image
                  source={Images.videoIcon}
                  style={AddFromSavedStyle.videoIconStyle}
                />
              </CachedImage>
            }
            unCheckedImage={
              <CachedImage
                style={FavouritesSavedAllStyle.imageInGrid}
                source={{ uri: item.post.medias[0].thumbnail }}
                defaultSource={Images.placeHolder}
                activityIndicatorProps={{
                  display: "none",
                  opacity: 0
                }}
              >
                <Image
                  source={Images.unSelectedMultipleImages}
                  style={AddFromSavedStyle.checkBoxImageStyle}
                />
                <Image
                  source={Images.videoIcon}
                  style={AddFromSavedStyle.videoIconStyle}
                />
              </CachedImage>
            }
          />
        );
      } else {
        if (item.post.medias.length > 1) {
          return (
            <CheckBox
              style={FavouritesSavedAllStyle.imageInGrid}
              onClick={() => this.checkUncheckPost(index, item.post)}
              isChecked={item.post.checked}
              checkedImage={
                <CachedImage
                  style={FavouritesSavedAllStyle.imageInGrid}
                  source={{ uri: item.post.medias[0].mediaUrl }}
                  defaultSource={Images.placeHolder}
                  activityIndicatorProps={{
                    display: "none",
                    opacity: 0
                  }}
                >
                  <Image
                    source={Images.selectedMultipleImages}
                    style={AddFromSavedStyle.checkBoxImageStyle}
                  />
                  <Image
                    source={Images.multipleImages}
                    style={AddFromSavedStyle.multipleImageIconStyle}
                  />
                </CachedImage>
              }
              unCheckedImage={
                <CachedImage
                  style={FavouritesSavedAllStyle.imageInGrid}
                  source={{ uri: item.post.medias[0].mediaUrl }}
                  defaultSource={Images.placeHolder}
                  activityIndicatorProps={{
                    display: "none",
                    opacity: 0
                  }}
                >
                  <Image
                    source={Images.unSelectedMultipleImages}
                    style={AddFromSavedStyle.checkBoxImageStyle}
                  />
                  <Image
                    source={Images.multipleImages}
                    style={AddFromSavedStyle.multipleImageIconStyle}
                  />
                </CachedImage>
              }
            />
          );
        } else {
          return (
            <CheckBox
              style={FavouritesSavedAllStyle.imageInGrid}
              onClick={() => this.checkUncheckPost(index, item.post)}
              isChecked={item.post.checked}
              checkedImage={
                <CachedImage
                  style={FavouritesSavedAllStyle.imageInGrid}
                  source={{ uri: item.post.medias[0].mediaUrl }}
                  defaultSource={Images.placeHolder}
                  activityIndicatorProps={{
                    display: "none",
                    opacity: 0
                  }}
                >
                  <Image
                    source={Images.selectedMultipleImages}
                    style={AddFromSavedStyle.checkBoxImageStyle}
                  />
                </CachedImage>
              }
              unCheckedImage={
                <CachedImage
                  style={FavouritesSavedAllStyle.imageInGrid}
                  source={{ uri: item.post.medias[0].mediaUrl }}
                  defaultSource={Images.placeHolder}
                  activityIndicatorProps={{
                    display: "none",
                    opacity: 0
                  }}
                >
                  <Image
                    source={Images.unSelectedMultipleImages}
                    style={AddFromSavedStyle.checkBoxImageStyle}
                  />
                </CachedImage>
              }
            />
          );
        }
      }
    }
  };

  renderUpdateGroupNameModal() {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.updateGroupNameVisible}
      >
        <View style={NewGroupModalStyle.container}>
          <View style={Styles.modalTitleBar}>
            <TouchableOpacity
              style={Styles.headerLeftContainer}
              onPress={() => this.updateGroupNameCancel()}
            >
              <Text
                style={[
                  Styles.headerLeftText,
                  {
                    fontFamily: "ProximaNova-Light",
                    letterSpacing: 0.8,
                    fontSize: 16,
                    textAlign: "left",
                    color : 'black'
                  }
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={Styles.modalTitle}></Text>
            <TouchableOpacity
              style={Styles.headerRightContainer}
              onPress={() => this.updateGroupName()}
            >
              <Text
                style={[
                  Styles.headerRightText,
                  {
                    color: Colors.warmGrey,
                    fontFamily: "ProximaNova-Light",
                    letterSpacing: 0.8,
                    fontSize: 16,
                    textAlign: "left"
                  }
                ]}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={NewGroupModalStyle.nameText}>NAME</Text>
          <TextInput
            placeholder="Group Name"
            placeholderTextColor={Colors.white}
            value={this.state.newGroup}
            onChangeText={newGroup => {
              this.setState({ newGroup: newGroup });
            }}
            style={NewGroupModalStyle.inputStyle}
            selectionColor={Colors.primary}
            autoCapitalize="sentences"
            maxLength={30}
            autoCorrect={false}
            autoFocus={true}
            returnKeyType={"done"}
            onSubmitEditing={() => this.updateGroupName()}
            underlineColorAndroid="transparent"
          />
        </View>
      </Modal>
    );
  }

  renderAddImagesModal() {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.addImagesVisible}
      >
        <View style={NewGroupModalStyle.container}>
          <View style={Styles.modalTitleBar}>
            <TouchableOpacity
              style={Styles.headerLeftContainer}
              onPress={() => this.addImagesInGroupCancel()}
            >
              <Text
                style={[
                  Styles.headerLeftText,
                  {
                    color: 'black',
                    fontFamily: "ProximaNova-Light",
                    letterSpacing: 0.8,
                    fontSize: 16,
                    textAlign: "left"
                  }
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={Styles.modalTitle}>
              ADD IN {this.state.group.name.toUpperCase()}
            </Text>
            <TouchableOpacity
              style={Styles.headerRightContainer}
              onPress={() => this.updateGroupImages()}
            >
              <Text
                style={[
                  Styles.headerRightText,
                  {
                    color: Colors.warmGrey,
                    fontFamily: "ProximaNova-Light",
                    letterSpacing: 0.8,
                    fontSize: 16,
                    textAlign: "left"
                  }
                ]}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
          {this.state.postsNotAddedFlag == 1 && (
            <Text styler={GroupDetailsStyle.noPostsText}>
              Failed to get posts you have not added!
            </Text>
          )}
          {this.state.postsNotAddedFlag == 0 && (
            <FlatList
              data={this.state.postsNotAdded}
              numColumns={3}
              keyExtractor={this._keyExtractor}
              renderItem={
                this.state.postsNotAdded && this.renderPostsNotAddedGridItem
              }
              onRefresh={this.handleRefreshPostsNotAdded}
              refreshing={this.state.refreshinPostsNotAdded}
            />
          )}
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <View style={GroupDetailsStyle.container}>
        {this.state.group.postEmptyOrNot && (
          <Text style={GroupDetailsStyle.noPostsText}>There are no images in {this.state.group.name}.</Text>
        )}
        {!this.state.group.postEmptyOrNot && (
          <FlatList
            data={this.state.group.posts}
            numColumns={3}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderGridItem}
            extraData={this.state}
          />
        )}
        <ActionSheet
          ref={this.getActionSheetRef}
          title={title}
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this.handlePress}
        />
        {this.renderUpdateGroupNameModal()}
        {this.renderAddImagesModal()}
        {this.state.isUpdating && (
          <ActivityIndicator
            animating
            size="large"
            style={{
              position: 'absolute', top:0, bottom: 0, left: 0, right: 0,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0a0a0a'
            }}
            color={Colors.primary}/>
        )}
      </View>
    );
  }
}

GroupDetails.navigationOptions = ({ navigation }) => ({
  title: navigation.state.params.group.name,
  headerTitleStyle: Styles.headerTitleStyle,
  headerStyle: Styles.headerStyle,
  tabBarVisible: false,
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
        navigation.state.params.openGroupOptions();
      }}
      style={Styles.headerRightContainer}
      activeOpacity={0.5}
    >
      <Image
        source={Images.threeHorizontalDots}
        style={[
          Styles.headerRightImage,
          {
            height: 2.7,
            width: 16.7,
            tintColor : 'black'
          }
        ]}
      />
    </TouchableOpacity>
  )
});

const mapStateToProps = ({ authReducer, groupReducer }) => {
  const { userData, loading, token } = authReducer;
  const { groups } = groupReducer;
  return { userData, loading, token, groups };
};
export default connect(mapStateToProps, {
  updateSingleGroup,
  deleteSingleGroup
})(GroupDetails);
