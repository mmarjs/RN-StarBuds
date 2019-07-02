import PropTypes from 'prop-types';
import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native';
import { CachedImage } from "react-native-cached-image";
//import Lightbox from 'react-native-lightbox';

export default class MessageImage extends React.Component {
  
  render() {
    //let ImageIcon = this.props.imageMetaDataIcon;
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        {/* <Lightbox
          activeProps={{
            style: styles.imageActive,
          }}
          {...this.props.lightboxProps}
        > */}
          <View>
            {/* <Image
              {...this.props.imageProps}
              style={[styles.image, this.props.imageStyle]}
              source={{uri: this.props.currentMessage.image}}
            /> */}
            <CachedImage
              {...this.props.imageProps}
              style={[styles.image, this.props.imageStyle]}
              source={{uri: this.props.currentMessage.image}}
              defaultSource={this.props.postImagePlaceHolder}
              fallbackSource={this.props.postImagePlaceHolder}
              activityIndicatorProps={{ display: "none", opacity: 0 }}
            />
            {this.props.imageMetaDataIcon }
          </View>
        {/* </Lightbox> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    //margin: 3,
    resizeMode: 'cover',
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
});

MessageImage.defaultProps = {
  currentMessage: {
    image: null,
  },
  containerStyle: {},
  imageStyle: {},
};

MessageImage.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: PropTypes.object,
  lightboxProps: PropTypes.object,
};
