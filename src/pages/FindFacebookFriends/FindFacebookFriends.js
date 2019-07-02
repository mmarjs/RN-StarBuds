import React, { Component } from 'react';
import { View, Image, Text ,ImageBackground} from 'react-native';
import { connect } from 'react-redux';
import { Button } from './../../components';
import { FindFacebookFriendStyle } from './FindFacebookFriendStyle';
import { Images, Colors } from './../../theme';
import { apiCall, facebookLogin } from './../../services/AuthService';
import { updateLoading } from '../../actions';
import { alert } from "./../../services/AlertsService";
import { navigateTo } from '../../services/CommonFunctions';

class FindFacebookFriends extends Component {
	static navigationOptions = {
		header: null
	};

	constructor( props ) {
		super( props );
		this.state = {
			pressStatus: false
		};
	}

	connectFacebookFriends() {
		this.props.updateLoading( true );
		facebookLogin().then(( facebookResponse ) => {
			this.props.updateLoading( false );
			navigateTo(this.props.navigation, 'Contacts', {
				friends: facebookResponse.friends,
				connected: true,
				fromFacebook: false
			})
		}, ( error ) => {
			this.props.updateLoading( false );
			alert("Failed", 'Connect to Facebook failed!' );
		})
	}

	skipClicked() {
		navigateTo(this.props.navigation, 'DiscoverBuddies', this.props.userData);
	}

	renderLogo() {
		return (
			<View style={FindFacebookFriendStyle.group1}>
				<Image style={FindFacebookFriendStyle.headerImage} source={Images.addFriend}/>
			</View>
		);
	}

	renderMessage() {
		return (
			<View style={FindFacebookFriendStyle.group2}>
				<Text style={FindFacebookFriendStyle.titleStyle}>
					FIND FACEBOOK FRIENDS
				</Text>
				<Text style={FindFacebookFriendStyle.textStyle}>
					You choose which friends to follow.
				</Text>
				<Text style={FindFacebookFriendStyle.textStyle}>
					We’ll never post to Facebook without your permission.
				</Text>
			</View>
		);
	}

	renderButton() {
		return (
			<View style={FindFacebookFriendStyle.group3}>
				<Button onPress={() => this.connectFacebookFriends()} underlayColor={Colors.secondaryDarker} style={{
					backgroundColor: Colors.secondary
				}}>
					<Text style={FindFacebookFriendStyle.buttonText}>
						CONNECT TO FACEBOOK
					</Text>
				</Button>
			</View>
		);
	}

	renderSkip() {
		return (
			<View style={FindFacebookFriendStyle.group4}>
				<Text style={FindFacebookFriendStyle.skipText} onPress={() => this.skipClicked()}>
					SKIP
				</Text>
			</View>
		);
	}

	render() {
		return (
			<View style={FindFacebookFriendStyle.pageContainer}>
			<ImageBackground
          style={FindFacebookFriendStyle.imageContainer}
          source={Images.launchScreen1}
        >
				{this.renderLogo()}
				{this.renderMessage()}
				{this.renderButton()}
				{this.renderSkip()}
				</ImageBackground>
			</View>
		);
	}
}

const mapStateToProps = ({ authReducer }) => {
	const { userData, loading, token } = authReducer;
	return { userData, loading, token };
}
export default connect(mapStateToProps, { updateLoading })( FindFacebookFriends );
