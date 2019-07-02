import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import DatePicker from "react-native-datepicker";
import Picker from "react-native-picker";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import Moment from "moment";
import {
  KeyboardAwareScrollView,
  KeyboardAwareListView
} from "react-native-keyboard-aware-scrollview";
import { Card, CardSection, Button, CustomPicker } from "../../components";
import Input from "../../components/Input/Input";
import { SignUpWithFacebookStyle } from "./SignUpWithFacebookStyle";
import { Images, Colors, Styles } from "../../theme";
import { apiCall, facebookLogin } from "./../../services/AuthService";
import {
  getCurrentLocation,
  fetchNearByLocation
} from "./../../services/LocationService";
import {
  getData,
  storeUser,
  storeToken
} from "./../../services/StorageService";
import { registerPushToken } from "./../../services/PushNotificationService";
import { setUserData, setToken, updateLoading } from "../../actions";
import { alert } from "./../../services/AlertsService";
import { navigateTo } from '../../services/CommonFunctions';
var pickerStatus = 0;

class SignUpWithFacebook extends Component {
  constructor(props) {
    super(props);
    let _params = this.props.navigation.state.params;
    this.state = {
      name: _params.name,
      email: _params.email,
      username: _params.username,
      dateofbirth: _params.dateofbirth, //Aug-16-2017
      gender: 'Gender',
      socialId: _params.socialId,
      profileImageUrl: _params.profileImageUrl,
      loading: false,
      email_error: "",
      username_error: "",
      name_error: "",
      dateofbirth_error: "",
      gender_error: "",
      dobNotNull: true,
      friends: _params.friends
    };
    this.props.updateLoading(false);
  }

  componentWillMount() {
    if (this.state.dateofbirth == "") {
      this.setState({ dobNotNull: false });
    } else {
      this.setState({ dobNotNull: true });
    }
  }

  enableSignUpButton() {
    if (
      this.state.dateofbirth == "Date of birth" ||
      this.state.email == "" ||
      this.state.username == "" ||
      this.state.gender == "Gender"
    ) {
      return true;
    } else {
      return false;
    }
  }

  renderSignUpTextStyle() {
    if (
      this.state.dateofbirth != "" &&
      this.state.email != "" &&
      this.state.username != "" &&
      this.state.gender != "Gender"
    ) {
      return SignUpWithFacebookStyle.btnText;
    } else {
      return SignUpWithFacebookStyle.btnTextDisabled;
    }
  }

  openPicker(selectedGender) {
    if (this.state.gender == "Gender") {
      let genderData = ["Male", "Female"];

      if (pickerStatus != 1) {
        Picker.init({
          pickerData: genderData,
          selectedValue: [selectedGender],
          pickerConfirmBtnText: "Select",
          pickerConfirmBtnColor: [255, 255, 255, 1],
          pickerCancelBtnText: "Cancel",
          pickerCancelBtnColor: [255, 255, 255, 1],
          pickerTitleText: "Gender",
          pickerTitleColor: [255, 255, 255, 1],
          pickerToolBarBg: [0, 0, 0, 1],
          onPickerConfirm: data => {
            if (data[0] == "Gender") {
              // this.state.genderChanged('Male');
            } else {
              this.setState({ gender: data[0] });
            }
            pickerStatus = 0;
          },
          onPickerCancel: data => {
            pickerStatus = 0;
          }
        });
        Picker.show();
      }
    }
  }

  signUpClicked() {
    var emailRegEx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(emailRegEx.test(this.state.email) == false) {
      this.setState({ email_error: 'Incorrect email address' });
    } else if (
      this.state.dateofbirth != "DateOfBirth" &&
      this.state.email != "" &&
      this.state.username != "" &&
      this.state.gender != "Gender"
    ) {
      // SignUp With Facebook api call
      this.props.updateLoading(true);
      let signUpData = {
        socialId: this.state.socialId,
        name: this.state.name,
        email: this.state.email,
        username: this.state.username,
        dob: this.state.dateofbirth,
        gender: this.state.gender == "Male" ? 1 : 2,
        provider: "facebook",
        isSocialLoggedIn: true,
        isOfficial: false,
        isFullDetail: true,
        profileImageUrl: this.state.profileImageUrl,
        thumbnail: this.state.profileImageUrl
      };
      apiCall("users/signup", signUpData).then(
        response => {
          storeUser(response.result);
          this.props.setUserData(response.result.user);
          this.props.setToken(response.result.token);
          getData("deviceToken").then(deviceToken => {
            registerPushToken(
              deviceToken.token,
              deviceToken.os,
              response.result.user,
              response.result.token
            );
          });
          if (response.status) {
            if (response.message == "User Found with social Id") {
              getCurrentLocation().then(currentLocation => {
                fetchNearByLocation(currentLocation);
              });
              navigateTo(this.props.navigation, 'mainStack');
            } else {
              getCurrentLocation().then(currentLocation => {
                fetchNearByLocation(currentLocation);
              });
              navigateTo(this.props.navigation, 'Contacts', { connected: true, fromFacebook: true });
            }
          } else {
            this.props.updateLoading(false);
            alert("Failed", response.message ? response.message : "Signup with facebook failed");
          }
        },
        error => {
          this.props.updateLoading(false);
          alert('Failed', error.message ? error.message : 'Something went wrong!')
        }
      );
    } else {
      const fieldsArr = ["name", "email", "dateofbirth", "username"];
      const fieldsArrCaps = ["Name", "Email", "Date of birth", "Username"];
      for (let i = 0; i < fieldsArr.length; i++) {
        let error_name = fieldsArr[i] + "_error";
        this.setState({
          [error_name]: ""
        });
        if (this.state[fieldsArr[i]] == "") {
          this.setState({
            [error_name]: `${fieldsArrCaps[i]} is required.`
          });
        }
      }
      if (this.state.gender == "Gender") {
        this.setState({
          gender_error: "Gender is required."
        });
      }
    }
  }

  renderDatePickerCustomStyles() {
    if (this.state.dateofbirth_error) {
      return SignUpWithFacebookStyle.datePickerCustomStyleError;
    } else {
      return SignUpWithFacebookStyle.datePickerCustomStyle;
    }
  }

  renderText() {
    return (
      <CardSection style={SignUpWithFacebookStyle.textContainerStyle}>
        <Text style={SignUpWithFacebookStyle.text}>
          WE NEED A COUPLE OF THINGS FROM YOU!
        </Text>
      </CardSection>
    );
  }

  rednerFooter() {
    return (
      <CardSection
        style={{ paddingLeft: 50, paddingRight: 50, paddingBottom: 50 }}
      >
        <Text style={SignUpWithFacebookStyle.orText}>
          By signing up, you agree to Starbuds Terms and conditions of User and
          Privacy Policy.
        </Text>
      </CardSection>
    );
  }

  renderForm() {
    let genderColor =
      this.state.gender == "Gender"
        ? Colors.placeholderTextColor
        : Colors.white;
    return (
      <View>
        {/* name */}
        <CardSection style={{ alignItems: "stretch" }}>
          <Input
            icon="username"
            placeholder="Enter Name"
            onChangeText={name => this.setState({ name: name })}
            value={
              this.state.name // onBlur={()=>this.state.validation('name',this.state.name)}
            }
            style={{
              backgroundColor: this.state.name_error
                ? Colors.errorBackgroundColor
                : Colors.inputBackground
            }}
            customIconStyle={{ width: 12, height: 15.3 , tintColor : 'white'}}
            autoCapitalize={"words"}
            inputRef={r => {
              this.name = r;
            }}
            returnKeyType="next"
            onSubmitEditing={event => {
              this.username.focus();
            }}
          />
          {this.state.name_error ? (
            <Text style={SignUpWithFacebookStyle.errorText}>
              {this.state.name_error}
            </Text>
          ) : null}
        </CardSection>
        {/* username */}
        <CardSection style={{ alignItems: "stretch", marginTop: 2 }}>
          <Input
            icon="username"
            placeholder="Choose Username"
            onChangeText={username => this.setState({ username: username })}
            value={
              this.state.username // onBlur={()=>this.state.validation('username',this.state.username)}
            }
            style={{
              backgroundColor: this.state.username_error
                ? Colors.errorBackgroundColor
                : Colors.inputBackground
            }}
            customIconStyle={{ width: 12, height: 15.3, tintColor : 'white' }}
            inputRef={r => {
              this.username = r;
            }}
            returnKeyType="next"
            onSubmitEditing={event => {
              this.email.focus();
            }}
          />
          {this.state.username_error ? (
            <Text style={SignUpWithFacebookStyle.errorText}>
              {this.state.username_error}
            </Text>
          ) : null}
        </CardSection>
        {/* email */}
        <CardSection style={{ alignItems: "stretch", marginTop: 2 }}>
          <Input
            icon="email"
            placeholder="Email"
            onChangeText={email => this.setState({ email: email })}
            value={this.state.email}
            style={{
              backgroundColor: this.state.email_error
                ? Colors.errorBackgroundColor
                : Colors.inputBackground
            }}
            editable={this.state.email != "" ? false : true}
            customIconStyle={{ width: 12.7, height: 10.7, tintColor : 'white' }}
            inputRef={r => {
              this.email = r;
            }}
            returnKeyType="next"
            onSubmitEditing={event => {
              this.datePicker.onPressDate();
            }}
          />
          {this.state.email_error ? (
            <Text style={SignUpWithFacebookStyle.errorText}>
              {this.state.email_error}
            </Text>
          ) : null}
        </CardSection>
        {/* dateOfBirth */}
        <CardSection style={{ alignItems: "stretch", marginTop: 2 }}>
          <DatePicker
            style={[
              SignUpWithFacebookStyle.datePickerStyle,
              {
                backgroundColor: this.state.dateofbirth_error
                  ? Colors.errorBackgroundColor
                  : Colors.inputBackground
              }
            ]}
            mode="date"
            date={this.state.dateofbirth}
            format="MMM-DD-YYYY"
            maxDate={Moment(new Date()).format("MMM-DD-YYYY")}
            confirmBtnText="DONE"
            cancelBtnText=""
            placeholder="Date of birth"
            iconSource={Images.calender}
            customStyles={
              this.state.dateofbirth_error
                ? SignUpWithFacebookStyle.datePickerCustomStyleError
                : SignUpWithFacebookStyle.datePickerCustomStyle
            }
            disabled={this.state.dobNotNull}
            onDateChange={date => {
              this.setState({ dateofbirth: date });
            }}
            onCloseModal={() => this.openPicker(this.state.gender)}
            ref={picker => {
              this.datePicker = picker;
            }}
          />
          {this.state.dateofbirth_error ? (
            <Text style={SignUpWithFacebookStyle.errorText}>
              {this.state.dateofbirth_error}
            </Text>
          ) : null}
        </CardSection>
        {/* gender */}
        <CardSection style={{ alignItems: "stretch", marginTop: 2 }}>
          <View
            style={[
              SignUpWithFacebookStyle.genderContainerStyle,
              {
                backgroundColor: this.state.gender_error
                  ? Colors.errorBackgroundColor
                  : Colors.inputBackground
              }
            ]}
          >
            <Image
              source={Images.username}
              style={SignUpWithFacebookStyle.iconStyle}
            />
            <Text
              style={[
                SignUpWithFacebookStyle.genderText,
                { color: 'white' }
              ]}
              onPress={() => this.openPicker(this.state.gender)}
            >
              {this.state.gender}
            </Text>
          </View>
          {this.state.gender_error ? (
            <Text style={SignUpWithFacebookStyle.errorText}>
              {this.state.gender_error}
            </Text>
          ) : null}
        </CardSection>
        <CardSection style={SignUpWithFacebookStyle.signupBtnContainer}>
          {this.renderSignupButton()}
        </CardSection>
      </View>
    );
  }
  
  renderSignupButton() {
    return (
      <View style={{ alignSelf: "stretch" }}>
        <Button
          onPress={() => this.signUpClicked()}
          style={{ backgroundColor: Colors.primary }}
        >
          <Text style={SignUpWithFacebookStyle.btnText}>SIGN UP</Text>
        </Button>
        {this.props.loading && (
          <ActivityIndicator
            animating
            size="small"
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-end",
              position: "absolute",
              top: "33%",
              right: 10
            }}
            color={Colors.black}
          />
        )}
      </View>
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          borderTopWidth: 1,
          backgroundColor: "black",
          borderColor: "rgba(255, 255, 255, 0.17)"
        }}
      >
        <KeyboardAwareScrollView
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps={"always"}
          getTextInputRefs={() => {
            return [
              this.email,
              this.username,
              this.name
              //this.birthofdate,
              //this.gender
            ];
          }}
        >
          {this.renderText()}
          {this.renderForm()}
          {this.rednerFooter()}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const backAction = NavigationActions.back({
  key: null
});

SignUpWithFacebook.navigationOptions = ({ navigation }) => ({
  title: "FACEBOOK SIGN UP",
  headerTitleStyle: Styles.headerTitleStyle,
  headerStyle: Styles.headerStyle,
  headerLeft: (
    <TouchableOpacity
      onPress={() => {
        navigation.dispatch(backAction);
      }}
      style={Styles.headerLeftContainer}
    >
      <Image
        source={Images.backButton}
        style={[Styles.headerLeftImage, { height: 15, width: 8 }]}
      />
    </TouchableOpacity>
  ),
  headerRight: <Text />
});

const mapStateToProps = ({ authReducer }) => {
  const { userData, loading } = authReducer;
  return { userData, loading };
};
export default connect(mapStateToProps, {
  setUserData,
  setToken,
  updateLoading
})(SignUpWithFacebook);
