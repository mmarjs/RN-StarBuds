import React, { Component } from 'react';
import { FlatList, View, Text, Image, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { CachedImage } from "react-native-cached-image";
import ScalableText from 'react-native-text';
import {connect} from 'react-redux';
import Spinner from "react-native-loading-spinner-overlay";
import { ContactsStyle } from './ContactsStyle';
import { Button } from './../../components';
import { Colors, Images, Styles } from './../../theme';
import {
  apiCall,
  facebookLogin,
  getFacebookFriends
} from "./../../services/AuthService";
import { getUser, getToken } from './../../services/StorageService';
import { alert } from "./../../services/AlertsService";
import { navigateTo } from '../../services/CommonFunctions';

class Contacts extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			loading: true,
			refreshing: false,
			friends: [],
		};
	}

	componentWillMount() {
		getFacebookFriends()
      .then(response => {
				this.setState({
					socialIdsFromFacebook: response
				}, () => {
					this.findFacebookFriends(response);
				});
      })
      .catch(error => {
        this.setState({ showFacebookConnect: true });
        this.setState({ loading: false });
			});
		this.props.navigation.setParams({
			isConnectedToFacebook: this.props.userData.provider == 'facebook' ? true : false
		});
	}

	findFacebookFriends(friends) {
		let headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + this.props.token,
			'userid': this.props.userData._id
		};
		let params = {
			"userId": this.props.userData._id,
			"socialIds": friends
		};
		apiCall('users/getUsersFromSocialId', params, headers).then((response) => {
			if (response.status) {
				if(response.message == 'No users found') {
					this.setState({ loading: false, refreshing: false });
				} else {
					this.setState({
						loading: false,
						refreshing: false,
						friends: response.result,
					});
				}
			} else {
				this.setState({ loading: false, refreshing: false });
				setTimeout(() => {
					alert("Failed",response.message);
				});
			}
		}).catch(error => {
			this.setState({ loading: false, refreshing: false });
			setTimeout(() => {
				if (error.message) {
					alert("Failed",error.message);
				} else {
					//alert("Failed",'Failed to get buddies!');
				}
			});
		})
	}

	followTop20Friends() {
		this.setState({ loading: true }, () => {
				if ( this.state.friends.length < 20 ) {
				let currentFriends = this.state.friends;
				apiCall('users/followUser', {
					'userId': this.props.userData._id,
					'followers': this.state.friends,
					'followOrNot': true
				}, {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + this.props.token,
					'userid': this.props.userData._id
				}).then(response => {
					for ( let i = 0; i < currentFriends.length; i++ ) {
						currentFriends[i].isFollowed = true;
					}
					this.setState({ friends: currentFriends, loading: false });
				}).catch(error => {
					this.setState({ loading: false });
				})
			} else {
				let currentFriends = this.state.friends.slice( 0, 19 );
				apiCall('users/followUser', {
					'userId': this.props.userData._id,
					'followers': [user],
					'followOrNot': true
				}, {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + this.props.token,
					'userid': this.props.userData._id
				}).then(response => {
					for ( let i = 0; i < 20; i++ ) {
						currentFriends[i].isFollowed = true;
					}
					this.setState({ friends: currentFriends, loading: false });
				}).catch(error => {
					this.setState({ loading: false });
				})
			}
		});
	}

	followUser(user, index) {
		const currentFriends = [... this.state.friends];
		if(currentFriends[index].isFollowed) {
			// unfollow
			currentFriends[index].isFollowed = false;
			this.setState({ friends: currentFriends});
			apiCall('users/followUser', {
				'userId': this.props.userData._id,
				'followers': [user],
				'followOrNot': false
			}, {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.props.token,
				'userid': this.props.userData._id
			}).then(response => {
				this.setState({ friends: currentFriends });
				// this.setState({ loading: false });
			}).catch(error => {
				// this.setState({ loading: false });
			})
		} else {
			// follow
			currentFriends[index].isFollowed = true;
			this.setState({ friends: currentFriends });
			apiCall('users/followUser', {
				'userId': this.props.userData._id,
				'followers': [user],
				'followOrNot': true
			}, {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.props.token,
				'userid': this.props.userData._id
			}).then(response => {
				this.setState({ friends: currentFriends });
				// this.setState({ loading: false });
			}).catch(error => {
				// this.setState({ loading: false });
			})
		}
	}

	_keyExtractor = (item, index) => item._id;

	renderFriends = ({ item, index }) => {
		return (<View key={item._id} style={ContactsStyle.ListRowStyle.container}>
			<View style={ContactsStyle.ListRowStyle.group1}>
				<View style={ContactsStyle.ListRowStyle.photoConatiner}>
					<CachedImage
						style={ContactsStyle.ListRowStyle.photo}
						source={{uri: item.profileImageUrl}}
						defaultSource={Images.defaultUser}
						fallbackSource={Images.defaultUser}
						activityIndicatorProps={{ display: "none", opacity: 0 }}
					/>
				</View>
			</View>
			<View style={ContactsStyle.ListRowStyle.group2}>
				<View style={ContactsStyle.ListRowStyle.usernameConatiner}>
					<Text style={ContactsStyle.ListRowStyle.textUsername}>
						{item.username}
					</Text>
					<Text style={ContactsStyle.ListRowStyle.textFullname}>
						{item.name}
					</Text>
				</View>
				<View style={ContactsStyle.ListRowStyle.buttonConatiner}>
					<Button onPress={( ) => this.followUser(item._id, index)} style={item.isFollowed
						? ContactsStyle.ListRowStyle.followButtonFollowing
						: ContactsStyle.ListRowStyle.followButton}>
						<View>
							<ScalableText style={item.isFollowed	? ContactsStyle.ListRowStyle.followButtonTextFollowing: ContactsStyle.ListRowStyle.followButtonText}>
								{item.isFollowed
									? 'Following'
									: 'Follow'}
							</ScalableText>
						</View>
					</Button>
				</View>
			</View>
		</View>);
	}

	handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.findFacebookFriends(this.state.socialIdsFromFacebook);
      }
  );
  };

	renderPageMessage( ) {
		return (
			<View style={ContactsStyle.group1}>
				<Text style={ContactsStyle.text1}>
					100 of Your Contacts are on Starbuds
				</Text>
				<Text style={ContactsStyle.text2}>
					Follow them to see their photos and videos
				</Text>
			</View>
		);
	}

	renderFollowButton( ) {
		return (
			<View style={ContactsStyle.group2}>
				<Button onPress={( ) => this.followTop20Friends( )} 
					underlayColor={Colors.secondaryDarker}
					style={{
						backgroundColor: Colors.secondary,
						width: 300.7,
						alignSelf: 'center',
					}}>
						<Text style={ContactsStyle.facebookButtonText}>
							FOLLOW TOP 20 ACCOUNTS
						</Text>
				</Button>
			</View>
		);
	}

	render( ) {
		return (
			<View style={ContactsStyle.pageContainer}>
				{( this.state.friends.length > 0 ) && (this.renderPageMessage( ))}
				{( this.state.friends.length > 0 ) && (this.renderFollowButton( ))}
				{(this.state.friends.length > 0) && (
					<View style={ContactsStyle.group3}>
						<FlatList
							data={this.state.friends}
							numColumns={1}
							keyExtractor={this._keyExtractor}
							renderItem={this.renderFriends}
							onRefresh={this.handleRefresh}
							refreshing={this.state.refreshing}
							extraData={this.state}
							removeClippedSubviews={false}
						/>
					</View>
				)}
				{!this.state.loading && !(this.state.friends.length > 0 ) && (
					<View style={ContactsStyle.noData}>
						<Text style={{
							fontFamily: "ProximaNova-Light",
							fontSize: 16,
							letterSpacing: 0.8,
							textAlign: "center",
							color: Colors.white,
						}}>No friends found</Text>
					</View>
				)}
				{this.state.loading && (
          <Spinner
						visible={this.state.loading}
						color={Colors.primary}
            overlayColor='rgba(0, 0, 0, 0.75)'
          />
        )}
			</View>
		);
	}
}

Contacts.navigationOptions = ({ navigation }) => ({
  title: "CONTACTS",
  headerTitleStyle: Styles.headerTitleStyle,
  headerStyle: Styles.headerStyle,
  headerLeft: <Text />,
  headerRight: (
    <TouchableOpacity
			style={Styles.headerRightContainer}
			activeOpacity={0.5}
      onPress={() => {
				navigateTo(navigation, 'DiscoverBuddies', { isConnectedToFacebook: true});
      }}
    >
      <Text
        style={[Styles.headerRightText, {
          color: Colors.primary,
          letterSpacing: 0.8,
					fontFamily: "ProximaNova-Regular",
					textAlign: 'right'
        }]}
      >
        Next
      </Text>
    </TouchableOpacity>
  )
});

const mapStateToProps = ({ authReducer }) => {
	const { userData, token } = authReducer;
	return { userData, token };
}
export default connect(mapStateToProps, {})( Contacts );
