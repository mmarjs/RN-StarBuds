import React, { Component } from "react";
import { Dimensions, Image, View, TouchableHighlight } from "react-native";
import VideoPlayer from "react-native-video-player";
import { Colors, Images } from "../../theme";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get( 'window' ).height;

export default class FeedVideo extends React.Component {
  constructor(props) {
    super(props);
  }
  
  onLoad = (data) => {
    // if(data.duration) {
    //   this.setState({ duration: data.duration });
    // }
  };

  onLoadStart = (data) => {
    if(data.duration) {
      this.setState({ duration: data.duration });
    }
  };

  render() {
    return (
      <View style={this.props.videoContainerStyle}>
        <VideoPlayer
          endWithThumbnail
          thumbnail={{
            uri: this.props.imageData.thumbnail
          }}
          video={{ uri: this.props.imageData.mediaUrl }}
          videoWidth={this.props.videoWidth || screenWidth}
          videoHeight={this.props.videoHeight || screenWidth}
          disableControlsAutoHide={true}
        />
        {
          // <View style={{bottom: 0, width:100, backgroundColor: 'red', }}>
          // 	<Text style={{color: '#FFF', fontFamily: 'ProximaNova-Extrabld'}}>Learn <Text style={{color: '#FFF', fontFamily: 'ProximaNova-Regular'}}>More</Text></Text>
          // </View>
        }
        <Image source={Images.videoIcon} style={{position: 'absolute', top: 10, right: 8, height: 40, width: 48.3}} />
      </View>
    );
  }
}
