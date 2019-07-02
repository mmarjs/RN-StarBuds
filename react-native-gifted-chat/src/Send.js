import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Image
} from 'react-native';

export default class Send extends React.Component {
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.text.trim().length === 0 && nextProps.text.trim().length > 0 || this.props.text.trim().length > 0 && nextProps.text.trim().length === 0) {
  //     return true;
  //   }
  //   return false;
  // }
  render() {
    if (this.props.text.trim().length > 0) {
      return (
        <TouchableOpacity
          style={[styles.container, this.props.containerStyle]}
          onPress={() => {
            this.props.onSend({text: this.props.text.trim()}, true);
          }}
          accessibilityTraits="button"
        >
          <View style={{marginRight: 10, marginBottom: 10}}>
            <Image source={this.props.activeIamge} resizeMode={'contain'} style={{height:23, width:19.3}}/>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        accessibilityTraits="button"
        disabled={true}
      >
        <View style={{marginRight: 10, marginBottom: 10}}>
          <Image source={this.props.inActiveIamge} resizeMode={'contain'} style={{height:23, width:19.3}}/>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'flex-end',
  },
  text: {
    color: '#0084ff',
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: 'transparent',
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
  },
});

Send.defaultProps = {
  text: '',
  onSend: () => {},
  label: 'Send',
  containerStyle: {},
  textStyle: {},
  activeIamge: {},
  inActiveIamge: {}
};

Send.propTypes = {
  text: PropTypes.string,
  onSend: PropTypes.func,
  label: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  activeIamge: PropTypes.any,
  inActiveIamge: PropTypes.any
};
