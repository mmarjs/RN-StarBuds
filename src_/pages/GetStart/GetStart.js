import React, { Component } from 'react';
import { Text, View, Image, ScrollView, DeviceEventEmitter, StatusBar, ImageBackground } from 'react-native';
import { NavigationActions } from "react-navigation";
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import { Button } from './../../components';
import { GetStartStyle } from './GetStartStyle';
import { Images, Colors } from './../../theme';
import { Dimensions } from 'react-native';
import { getData } from './../../services/StorageService';
import { navigateTo } from '../../services/CommonFunctions';

const { height } = Dimensions.get('window');

class Launchscreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      createAccountPressStatus: false,
      logInPressStatus: false,
      disableCreateAccount: false,
      disableLogin: false
    };

    DeviceEventEmitter.addListener('backToGetStart', (e) => {
      this.setState({
        disableCreateAccount: false,
        disableLogin: false
      });
    });
  }

  goToSignUp(navigation) {
    navigateTo(this.props.navigation, 'SignUp');
  }

  goToLogin(navigation) {
    navigateTo(this.props.navigation, 'Login');
  }

  renderLogo() {
    return (
      <View style={GetStartStyle.group1}>
        <Image
          style={GetStartStyle.headerImage}
          source={Images.white_image}
        />
      </View>
    );
  }

  renderLaunchScreen1() {
    return (
      <View style={GetStartStyle.slide1}>

        <Image
          style={GetStartStyle.imageContainer}
          source={Images.launchScreen1}
        />
        <View style={GetStartStyle.group2}>
          <View>
            <Text style={GetStartStyle.textTitle}>SOCIAL</Text>
          </View>
          <View>
            <Text style={GetStartStyle.textData}>
              The premium cannabis social network.
              We are here to connect cannabis lovers around the world.
              </Text>
          </View>
        </View>
      </View>
    );
  }

  renderLaunchScreen2() {
    return (
      <View style={GetStartStyle.slide2}>
        <ImageBackground
          style={GetStartStyle.imageContainer}
          source={Images.launchScreen2}
        >
          <View style={GetStartStyle.group2}>
            <View>
              <Text style={GetStartStyle.textTitle}>NEWS</Text>
            </View>
            <View>
              <Text style={GetStartStyle.textData}>
                Stay up-to-date on industry news.
                We bring you relevant to the min news from around the world.
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  renderLaunchScreen3() {
    return (
      <View style={GetStartStyle.slide3}>
        <ImageBackground
          style={GetStartStyle.imageContainer}
          source={Images.launchScreen3}
        >
          <View style={GetStartStyle.group2}>
            <View>
              <Text style={GetStartStyle.textTitle}>RECIPES</Text>
            </View>
            <View>
              <Text style={GetStartStyle.textData}>
                We bring you the most decadent edible recipes sourced from top chefs.
            </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  renderLaunchScreen4() {
    return <View style={GetStartStyle.slide4}>
      <ImageBackground style={GetStartStyle.imageContainer} source={Images.launchScreen4}>
        <View style={GetStartStyle.group2}>
          <View>
            <Text style={GetStartStyle.textTitle}>MEDIA</Text>
          </View>
          <View>
            <Text style={GetStartStyle.textData}>
              Videos and photos from around the cannabis industry. Social
              influencers who are blazing the new generation.
              </Text>
          </View>
        </View>
      </ImageBackground>
    </View>;
  }

  renderButtons() {
    return (
      <View style={GetStartStyle.group3}>
        <Button
          disabled={this.state.disableCreateAccount}
          onPress={() => {
            this.setState({ disableCreateAccount: true });
            setTimeout(() => {
              this.setState({ disableCreateAccount: false });
            }, 2500);
            this.goToSignUp(this.props.navigation);
          }}
          onHideUnderlay={() => { this.setState({ createAccountPressStatus: false }); }}
          onShowUnderlay={() => { this.setState({ createAccountPressStatus: true }); }}
          style={this.state.createAccountPressStatus ? { backgroundColor: Colors.primaryDarker } :
            { backgroundColor: Colors.primary, borderRadius: 5 }}
        >
          <Text style={GetStartStyle.createAccountText}>CREATE ACCOUNT</Text>
        </Button>
        <Text style={GetStartStyle.logInTextSmall}>Already a user?</Text>
        <Button
          disabled={this.state.disableLogin}
          onPress={() => {
            this.setState({ disableLogin: true });
            setTimeout(() => {
              this.setState({ disableLogin: false });
            }, 2500);
            this.goToLogin(this.props.navigation);
          }}
          onHideUnderlay={() => { this.setState({ logInPressStatus: false }); }}
          onShowUnderlay={() => { this.setState({ logInPressStatus: true }); }}
          style={this.state.logInPressStatus ? { backgroundColor: Colors.darkActive, height: 49.7 } :
            { backgroundColor: Colors.white, height: 49.7, borderRadius: 5 }}
        >
          <Text
            style={
              this.state.logInPressStatus ? GetStartStyle.logInTextOnPress : GetStartStyle.logInText
            }
          >
            LOG IN
        </Text>
        </Button>
      </View>
    );
  }

  render() {

    return (
      <View style={GetStartStyle.container}>
        <Swiper
          style={GetStartStyle.wrapper}
          paginationStyle={GetStartStyle.customDotPosition}
          dotColor={Colors.blackTransparent}
          activeDotColor={Colors.white}
        >
          {this.renderLaunchScreen1()}
          {this.renderLaunchScreen2()}
          {this.renderLaunchScreen3()}
          {this.renderLaunchScreen4()}
        </Swiper>
        {this.renderLogo()}
        {this.renderButtons()}
      </View>
    );
  }
}

Launchscreen.navigationOptions = {
  header: null
};

export default connect(null, {})(Launchscreen)
