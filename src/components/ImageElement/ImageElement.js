import React, { Component } from 'react';
import {
  Animated,
  View
} from 'react-native';
import ProgressiveImage from 'react-native-offline-placeholder';

export default class ImageElement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0), // opacity 0
    };
  }

  componentDidMount() {
    Animated.timing(       // Uses easing functions
      this.state.fadeAnim, // The value to drive
      {
        toValue: 1,        // Target
        duration: 2000,    // Configuration
        useNativeDriver: true,
      },
    ).start();             // Don't forget start!
  }

  render() {
    return (
      <Animated.View   // Special animatable View
        style={{
          opacity: this.state.fadeAnim,  // Binds
        }}>
        <ProgressiveImage
          imageKey={this.props.imageKey}
          source={this.props.source}
          resizeMode={this.props.resizeMode}
          thumbnailresizeMode={this.props.thumbnailresizeMode}
          thumbnail={this.props.thumbnail}
          style={this.props.style}
          onPress={()=>{alert('sdfsd')}}
        />
      </Animated.View>
    );
  }
}
