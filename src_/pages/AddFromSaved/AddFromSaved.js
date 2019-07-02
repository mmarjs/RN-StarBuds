import React, { Component } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { CachedImage } from "react-native-cached-image";
import CheckBox from 'react-native-check-box';
import { connect } from "react-redux";
import { Images, Colors, Styles } from "./../../theme";
import { AddFromSavedStyle } from "./AddFromSavedStyle";
import { FavouritesSavedAllStyle } from "../FavouriteSavedAll/FavouritesSavedAllStyle";
import { apiCall } from "./../../services/AuthService";
import { alert } from './../../services/AlertsService';
import { filterArrayByValue } from "./../../services/CommonFunctions";

let selectedPosts = new Array();
let selectedPostsWithDetails = new Array();

class AddFromSaved extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      pageNo: 0,
      nextPageAvailable: false,
    };
  }

  getSavedPostsFromApi(page) {
    const data = {
      user: this.props.userData._id,
      pageNo: page
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/getSavedPost", data, headers)
      .then(response => {
        if (response.status) {
          if (page == 0) {
            let temp = new Array();
            for (let i = 0; i < response.result.posts.length; i++) {
              let newPost = response.result.posts[i];
              newPost.checked = false;
              temp.push(newPost);
            }
            this.setState({ posts: temp }, () => {
              if (this.state.posts.length > 0) {
                this.setState({
                  showNoPosts: 2,
                  refreshing: false
                });
              } else {
                this.setState({
                  showNoPosts: 1,
                  refreshing: false
                });
              }
            });
          } else {
            let temp = new Array();
            for (let i = 0; i < response.result.posts.length; i++) {
              let newPost = response.result.posts[i];
              newPost.checked = false;
              temp.push(newPost);
            }
            tempData = this.state.posts.concat(temp);
            this.setState({ posts: tempData }, () => {
              this.setState({
                posts: tempData,
                refreshing: false,
                showNoPosts: 2
              });
            });
          }
          if (response.result.nextPageAvailable) {
            this.setState({ nextPageAvailable: true, allowScroll: true });
          } else {
            this.setState({ nextPageAvailable: false, allowScroll: false });
          }
        } else {
          this.setState({ refreshing: false, showNoPosts: 5 });
        }
      })
      .catch(error => {
        this.setState({ refreshing: false, showNoPosts: 5 });
      });
  }

  handleRefresh = () => {
    this.setState(
      {
        pageNo: 0,
        refreshing: true
      },
      () => {
        this.getSavedPostsFromApi(0);
      }
    );
  };

  handleLoadMore = () => {
    if (this.state.nextPageAvailable) {
      this.setState(
        {
          pageNo: this.state.pageNo + 1
        },
        () => {
          this.getSavedPostsFromApi(this.state.pageNo);
        }
      );
    }
  };

  checkUncheckPost(index, post) {
    const newArray = [...this.state.posts];
    if (newArray[index].checked) {
      newArray[index].checked = false;
      selectedPosts = filterArrayByValue(selectedPosts, post._id);
      selectedPostsWithDetails = filterArrayByValue(selectedPostsWithDetails, post._id);
      this.setState({ posts: newArray });
    } else {
      newArray[index].checked = true;
      selectedPosts.push(post._id);
      selectedPostsWithDetails.push(post);
      this.setState({ posts: newArray });
    }
  }

  doneAction() {
    if (selectedPosts.length > 0) {
      this.props.savedNextAction(selectedPosts);
    } else {
      this.props.savedNextAction(new Array());
      // alert('Failed', 'Please select images for the created group!');
    }
  }
  componentWillMount() {
    this.getSavedPostsFromApi(0);
  }

  _keyExtractor = (item, index) => item._id;

  renderFooter = () => {
    if (!this.state.refreshing) return null;
    return (
      <ActivityIndicator
        animating
        size="large"
        style={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a"
        }}
        color={Colors.primary}
      />
    );
  };

  renderGridItem = ({ index, item }) => {
    if (item.post) {
      if (item.post.medias[0].mediaType == 2) {
        return (
          <CheckBox
            style={FavouritesSavedAllStyle.imageInGrid}
            onClick={() => this.checkUncheckPost(index, item.post)}
            isChecked={item.post.checked}
            key={item.post._id}
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
              key={item.post._id}
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
                    source={Images.multipleImages}
                    style={AddFromSavedStyle.multipleImageIconStyle}
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
              key={item.post._id}
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
                </CachedImage>
              }
            />
          );
        }
      }
    }
  };

  render() {
    const { modalVisible, savedCancelAction } = this.props;
    return (
      <Modal animationType={"none"} transparent={false} visible={modalVisible}>
        <View style={AddFromSavedStyle.container}>
          <View style={Styles.modalTitleBar}>
            <TouchableOpacity
              style={Styles.headerLeftContainer}
              onPress={() => savedCancelAction()}
            >
              <Text
                style={[
                  Styles.headerLeftText,
                  {
                    color: Colors.white,
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
            <Text style={Styles.modalTitle}>ADD FROM SAVED</Text>
            <TouchableOpacity
              style={Styles.headerRightContainer}
              onPress={() => this.doneAction()}
              activeOpacity={selectedPosts.length > 0 ? 0.5 : 1}
            >
              <Text
                style={[
                  Styles.headerRightText,
                  {
                    color: selectedPosts.length > 0 ? Colors.white : Colors.warmGrey,
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
          {this.state.posts.length > 0 && (
            <FlatList
              data={this.state.posts}
              numColumns={3}
              keyExtractor={this._keyExtractor}
              renderItem={this.state.posts && this.renderGridItem}
              ListFooterComponent={this.renderFooter}
              onEndReachedThreshold={0.01}
              onEndReached={this.handleLoadMore}
              onRefresh={this.handleRefresh}
              refreshing={this.state.refreshing}
              extraData={this.state}
            />
          )}
        </View>
      </Modal>
    );
  }
}

// AddFromSaved.navigationOptions = ({ navigation }) => ({ header: null })

const mapStateToProps = ({ authReducer }) => {
  const { userData, token } = authReducer;
  return { userData, token };
};
export default connect(mapStateToProps, {})(AddFromSaved);
