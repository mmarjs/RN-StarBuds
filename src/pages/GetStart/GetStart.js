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
    // navigateTo(this.props.navigation, 'SignUpWithFacebook');
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
          onPress={() => {
            this.goToSignUp(this.props.navigation);
          }}
          style={{ backgroundColor: Colors.clearTransparent, height: 30}}
        >
          <Text
            style=
              {{color: 'white'}}
          >SKIP
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
        {/* {this.renderLogo()} */}
        {/* {this.renderButtons()} */}
        <View style={GetStartStyle.group3}>
        <Button
          onPress={() => {
            this.goToSignUp(this.props.navigation);
          }}
          style={{ backgroundColor: Colors.clearTransparent, height: 80}}
        >
          <Text
            style=
              {{color: 'white'}}
          >SKIP
        </Text>
        </Button>
      </View>
      </View>
    );
  }
}

Launchscreen.navigationOptions = {
  header: null
};

export default connect(null, {})(Launchscreen)
