import React, { Component } from "react";
import ActionSheet from 'react-native-actionsheet';
import { ShareDialog } from "react-native-fbsdk";
import { alert } from "./../../services/AlertsService";
import { apiCall } from "./../../services/AuthService";
import {writeToClipboard} from '../../services/CommonFunctions';

const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 3;
let actionSheetOptions = ["Cancel", "Share to Facebook", "Copy Link", "Report"];
const actionSheetTitle = "Share";
let actionSheetButtons = [...actionSheetOptions];

export default class ShareActionSheet extends Component {
  shareOnFacebook = () => {
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: this.props.postIdURL,
      contentDescription: 'Check this post',
    };
    ShareDialog.canShow(shareLinkContent).then(
      (canShow) => {
        if (canShow) {
          return ShareDialog.show(shareLinkContent);
        }
      },
      function(error){
        return error;
        alert('error',error.message);
      }
    ).then(
      (result) => {
        // if (result.isCancelled) {
        //   alert('Share operation was cancelled');
        // } else {
        //   alert('Share was successful');
        // }
      },
      function(error) {
        alert('Share failed with error: ' + error.message);
      }
    );
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.userData != "" && nextProps.userData._id === nextProps.postByUserId){
      actionSheetButtons = actionSheetOptions.slice(0,3);
    } else {
      actionSheetButtons = [...actionSheetOptions];
    }
  }
  reportPost = () => {
    const postIdToReport = this.props.postIdForSharing;
    const data = {
      postId: postIdToReport,
      userId: this.props.userData._id
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    apiCall("posts/reportPost", data, headers)
      .then(response => {
        if (response.status) {
          alert('Post has been reported');
        } else {
        }
      })
      .catch(error => {
      });
    }
    handleActionSheetPress = (i) => {
      switch (i) {
        case 1:
          this.shareOnFacebook();
          break;
        case 2:
          writeToClipboard(this.props.postIdURL);
          break;
        case 3:
          this.reportPost();
          break;
        default:
          break;
      }
    }
    reportPost = () => {
      const postIdToReport = this.props.postIdForSharing;
      const data = {
        postId: postIdToReport,
        userId: this.props.userData._id
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
        userid: this.props.userData._id
      };
      apiCall("posts/reportPost", data, headers)
        .then(response => {
          if (response.status) {
            alert('Post has been reported');
          } else {
            alert('Something went wrong');
          }
        })
        .catch(error => {
          alert('Something went wrong');
        });
    }
  render(){
    return(
        <ActionSheet
          ref={this.props.getActionSheetRef}
          title={actionSheetTitle}
          options={actionSheetButtons}
          cancelButtonIndex={CANCEL_INDEX}
          onPress={this.handleActionSheetPress}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
        />
    );
  }
}