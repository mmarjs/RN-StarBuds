import React, { Component } from 'react';
import { View, Image, Text, ActivityIndicator, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ScalableText from 'react-native-text';
import { Button } from './../../components';
import { ConfirmEmailStyle } from './ConfirmEmailStyle';
import { Images, Colors } from './../../theme';
import { apiCall, facebookLogin } from './../../services/AuthService';
import {
  getCurrentLocation,
  fetchNearByLocation
} from "./../../services/LocationService";
import { getData, storeUser, storeToken } from './../../services/StorageService';
import { setUserData, setToken, updateLoading } from "../../actions";
import { registerPushToken } from "./../../services/PushNotificationService";
import { alert } from "./../../services/AlertsService";
import { navigateTo } from '../../services/CommonFunctions';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class ConfirmEmail extends Component {
	static navigationOptions = {
		header: null
	};
	constructor(props) {
		super(props);
		let params = this.props.navigation.state.params;
		this.state = {
			pressStatus: false,
			email: params.email,
			password: params.password,
		};
	}

	gotIt() {
		this.props.updateLoading(true);
		let loginData = {
			name: this.state.email,
			password: this.state.password
		};

		apiCall('users/signin', loginData).then(response => {
			storeUser(response.result);
			this.props.setUserData(response.result.user);
			this.props.setToken(response.result.token);
			getData("deviceToken").then(deviceToken => {
        registerPushToken(deviceToken.token, deviceToken.os, response.result.user, response.result.token);
      });
			this.props.updateLoading(false);
			getCurrentLocation().then(currentLocation => {
        fetchNearByLocation(currentLocation);
      });
			navigateTo(this.props.navigation, 'FindFacebookFriends');
		}, (error) => {
			this.props.updateLoading(false);
			setTimeout(() => {
				if (error.message) {
					alert("Login Failed",error.message);
				} else {
					alert("Login Failed" ,'Something want to wrong please try again');
				}
			});
		})
	}

	renderLogo() {
		return (<Image style={ConfirmEmailStyle.headerImage} source={Images.logoFlower}/>);
	}

	renderText() {
		return (
			<Text style={ConfirmEmailStyle.textStyle}>
				Click the link in the email we just sent you to confirm your email address.
			</Text>
		);
	}

	renderButton() {
		return (
			<View style={ConfirmEmailStyle.buttonContainer}>
				<Button onPress={() => this.gotIt()} 
					onHideUnderlay={() => {
						this.setState({ pressStatus: false });
					}} 
					onShowUnderlay={() => {
						this.setState({ pressStatus: true });
					}} 
					underlayColor={Colors.darkActive} style={{
						backgroundColor: Colors.white
					}}>
					<View style={ConfirmEmailStyle.confirmEmailButtonWrapper}>
						<Text style={this.state.pressStatus
							? ConfirmEmailStyle.gotItTextOnPress
							: ConfirmEmailStyle.gotItText}>
							GOT IT
						</Text>
						{this.props.loading && 
							<ActivityIndicator
								animating
								size="small"
								style={{
									position: 'absolute',
									right: 5
								}}
								color={Colors.black}
							/>
							}
					</View>
				</Button>
				
			</View>
		);
	}

	render() {
		return (
			<View style={ConfirmEmailStyle.pageContainer}>
				<View style={ConfirmEmailStyle.part1}>
					{this.renderLogo()}
					{this.renderText()}
					{this.renderButton()}
				</View>
				<View style={ConfirmEmailStyle.part2}>
					<Image style={ConfirmEmailStyle.imageStyle} source={Images.confirmEmailBg}/>
				</View>
			</View>
		);
	}
}

const mapStateToProps = ({ authReducer }) => {
	const { loading } = authReducer;
	return { loading };
}
export default connect(mapStateToProps, { setUserData, setToken, updateLoading })(ConfirmEmail);
