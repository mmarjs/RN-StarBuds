import React, { Component } from "react";
import {
  Modal,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import { Images, Colors, Styles } from "./../../theme";
import { NewGroupModalStyle } from "./NewGroupModalStyle";
import { updateLoading } from "../../actions";

class NewGroupModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newGroup: '',
    };
  }

  addNewGroup(newGroup) {
    this.setState({ newGroup: newGroup });
  }

  handleClearGroupText = () => {
    this.setState({newGroup: ''})
  }

  renderClearGroupTextButton = () => {
    if(this.state.newGroup === '') { 
      return null
     } else{
      return (
        <TouchableOpacity 
          style={NewGroupModalStyle.cancelGroupTextButton}
          onPress={() => {this.handleClearGroupText()}}
         >
         <View>
            <Image source={Images.closeIconWhite} style={NewGroupModalStyle.closeIcon} />
         </View>
        </TouchableOpacity>
        )
     }
  }

  render() {
    const { modalVisible, groupCancelAction, groupNextAction } = this.props;
    return (
      <Modal 
        animationType = {"slide"}
        transparent = {false}
        visible = {modalVisible}
      >
        <View style={NewGroupModalStyle.container}>
          <View style={Styles.modalTitleBar}>
            <TouchableOpacity
              style={Styles.headerLeftContainer}
              onPress={() => this.setState({ newGroup: '' }, () => {groupCancelAction();})}
            >
              {/* <Text
                style={[Styles.headerLeftText, {
                  color: 'black',
                  fontFamily: 'ProximaNova-Light',
                  letterSpacing: 0.8,
                  fontSize: 16,
                  textAlign: 'left'
                }]}
              >
                Cancel
              </Text> */}
            <Image source={Images.backButton} style={[Styles.headerLeftImage, {height: 15, width: 8 }]} />

            </TouchableOpacity>
            <Text style={Styles.headerTitleStyle}>
              NEW GROUP
            </Text>
            <TouchableOpacity
              style={Styles.headerRightContainer}
              onPress={() => {groupNextAction(this.state.newGroup); this.setState({ newGroup: '' })}}
            >
              <Text
                style={[Styles.headerRightText, {
                  color: Colors.warmGrey,
                  fontFamily: 'ProximaNova-Light',
                  letterSpacing: 0.8,
                  fontSize: 16,
                  textAlign: 'left'
                }]}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={NewGroupModalStyle.nameText}>
            NAME
          </Text>
          <View style={NewGroupModalStyle.inputContainer}>
          <TextInput
            placeholder="Group Name"
            placeholderTextColor={Colors.dark}
            value={this.state.newGroup}
            onChangeText={newGroup => {
              this.addNewGroup(newGroup);
            }}
            style={NewGroupModalStyle.inputStyle}
            selectionColor={Colors.primary}
            autoCapitalize="sentences"
            maxLength={30}
            autoCorrect={false}
            autoFocus={true}
            returnKeyType={"next"}
            underlineColorAndroid="transparent"
            onSubmitEditing={() => {groupNextAction(this.state.newGroup); this.setState({ newGroup: '' })}}
            // keyboardAppearance={'dark'}
          />
            {this.renderClearGroupTextButton()}
          </View>
        </View>
      </Modal>
    );
  }
}

// NewGroupModal.navigationOptions = ({ navigation }) => ({ header: null })

const mapStateToProps = ({ authReducer }) => {
  const { userData, loading, token } = authReducer;
  return { userData, loading, token };
};
export default connect(mapStateToProps, { updateLoading })(NewGroupModal);
