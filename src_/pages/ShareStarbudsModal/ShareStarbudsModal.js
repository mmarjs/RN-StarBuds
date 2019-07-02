import React, { Component } from 'react';
import {
	Modal,
	Text,
	View,
	Image,
	TouchableOpacity,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { CachedImage } from "react-native-cached-image";
import { Button } from '../../components';
import TextArea from "../../components/TextArea/TextArea";
import { Images, Colors, Styles } from './../../theme';
import { ShareStarbudsModalStyle } from './ShareStarbudsModalStyle';
import { updateLoading } from '../../actions';

const backAction = NavigationActions.back({ key: null });

class ShareStarbudsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: "SHARE STARBUDS",
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
          style={[Styles.headerLeftImage, {
            height: 15,
            width: 8
          }]}
        />
      </TouchableOpacity>
    )
  });

  render() {
    return (
      <View style={ShareStarbudsModalStyle.container}>
        <Text style={ShareStarbudsModalStyle.text}>Share Starbuds with your friends</Text>
      </View>
    );
  }
}

// ShareStarbudsModal.navigationOptions = ({ navigation }) => ({ header: null })

const mapStateToProps = ({ authReducer }) => {
	const { userData, loading, token } = authReducer;
	return { userData, loading, token };
}
export default connect(mapStateToProps, { updateLoading })( ShareStarbudsModal );
