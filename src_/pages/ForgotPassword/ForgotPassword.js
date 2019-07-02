import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
  ActivityIndicator,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import {
  KeyboardAwareScrollView,
  KeyboardAwareListView
} from "react-native-keyboard-aware-scrollview";
import { Card, CardSection, Button, Footer } from "../../components";
import { ForgotPasswordStyle } from "./ForgotPasswordStyle";
import { Images, Colors, Styles } from "../../theme";
import Input from "../../components/Input/Input";
import { apiCall } from "./../../services/AuthService";
import { updateLoading } from "../../actions";
import { alert } from "./../../services/AlertsService";
import { navigateTo } from '../../services/CommonFunctions';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      email_error: ""
    };
  }

  //handle input change on fields
  handleChange(name, error_name, fieldName, value) {
    if (value != "") {
      this.setState({
        [error_name]: ""
      });
    } else {
      this.setState({
        [error_name]: `${fieldName} is required`
      });
    }
    this.setState({
      [name]: value
    });
  }

  validation(name, fieldName, value) {
    if (value == "") {
      this.setState({
        [name]: `${fieldName} is required`
      });
    } else {
      this.setState({
        [name]: ""
      });
    }
  }

  requestResetPassword() {
    if (this.state.email != "") {
      this.props.updateLoading(true);
      apiCall("users/forgot", { email: this.state.email })
        .then(response => {
          this.props.updateLoading(false);
          setTimeout(() => {
            Alert.alert(
              "Success",
              response.message,
              [
                {
                  text: "OK",
                  onPress: () => {
                    navigateTo(this.props.navigation, 'Login');
                  }
                }
              ],
              { cancelable: false }
            );
          });
        })
        .catch(error => {
          this.props.updateLoading(false);
          if (error.message) {
            setTimeout(() => {
              alert("Failed", error.message);
            });
          } else {
            setTimeout(() => {
              // alert("Failed",'Failed to request a reset password link!');
            });
          }
        });
    } else {
      this.setState({ email_error: "Email or Username is required." });
    }
  }

  renderLogo() {
    return (
      <CardSection
        style={{ paddingLeft: 50, paddingRight: 50, paddingTop: 23 }}
      >
        <Image source={Images.logo} style={ForgotPasswordStyle.iconStyle} />
      </CardSection>
    );
  }

  renderContent() {
    return (
      <CardSection
        style={{ paddingLeft: 43, paddingRight: 43, paddingTop: 50 }}
      >
        <Text style={ForgotPasswordStyle.headingText}>Password Reset</Text>
        <Text style={ForgotPasswordStyle.subText}>
          Enter your{" "}
          <Text style={ForgotPasswordStyle.subTextBold}>Starbuds username</Text>{" "}
          OR the{" "}
          <Text style={ForgotPasswordStyle.subTextBold}>email address</Text>{" "}
          that you used to register. We will send you an email with your
          username and a link to reset your password.
        </Text>
      </CardSection>
    );
  }

  renderForm() {
    return (
      <View>
        <CardSection style={{ alignItems: "stretch", paddingTop: 10 }}>
          <Input
            icon="username"
            placeholder="Email address"
            onChangeText={email =>
              this.handleChange("email", "email_error", "Email", email)
            }
            onBlur={() =>
              this.validation(
                "email_error",
                "Email or Username",
                this.state.email
              )
            }
            style={{
              backgroundColor: this.state.email_error
                ? Colors.errorBackgroundColor
                : Colors.inputBackground
            }}
            value={this.state.email}
            keyboardType="email-address"
            customIconStyle={{ width: 12.3, height: 15.7 }}
            returnKeyType="go"
            onSubmitEditing={() => this.requestResetPassword()}
          />
          {this.state.email_error ? (
            <Text style={ForgotPasswordStyle.errorText}>
              {this.state.email_error}
            </Text>
          ) : null}
        </CardSection>

        <CardSection
          style={{ paddingLeft: 50, paddingRight: 50, paddingTop: 15 }}
        >
          <Button
            onPress={() => this.requestResetPassword()}
            disabled={this.props.loading}
            style={{ backgroundColor: Colors.primary }}
          >
            <Text style={ForgotPasswordStyle.btnText}>SEND</Text>
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
                top: "54%",
                right: "30%"
              }}
              color={Colors.black}
            />
          )}
        </CardSection>
      </View>
    );
  }

  render() {
    return (
      <Card>
        <KeyboardAwareScrollView
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps={"always"}
          extraHeight={500}
          innerRef={ref => {
            this.scroll = ref;
          }}
        >
        {this.renderLogo()}
        {this.renderContent()}
        {this.renderForm()}
        </KeyboardAwareScrollView>
      </Card>
    );
  }
}

const backAction = NavigationActions.back({
  key: null
});

ForgotPassword.navigationOptions = ({ navigation }) => ({
  title: "RECOVER PASSWORD",
  headerTitleStyle: Styles.headerTitleStyle,
  headerStyle: Styles.headerStyle,
  headerLeft: (
    <TouchableOpacity
      onPress={() => {
        DeviceEventEmitter.emit("backToGetStart", true);
        navigation.dispatch(backAction);
      }}
      style={Styles.headerLeftContainer}
      activeOpacity={0.5}
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
  const { loading } = authReducer;
  return { loading };
};
export default connect(mapStateToProps, {
  updateLoading
})(ForgotPassword);
