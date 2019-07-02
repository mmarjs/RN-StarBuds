import React, { Component } from 'react';
import {
	ActivityIndicator,
	FlatList,
	View,
	Text,
	Image,
	TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { CachedImage } from 'react-native-cached-image';
import ScalableText from 'react-native-text';
import { Button } from './../../components';
import { DiscoverBuddiesStyle } from './DiscoverBuddiesStyle';
import { Images, Colors, Styles } from './../../theme';
import {
  apiCall,
  facebookLogin,
  getFacebookFriends
} from "./../../services/AuthService";
import { mapFacebookFriends, navigateTo } from './../../services/CommonFunctions';
import { updateLoading } from '../../actions';
import { alert } from "./../../services/AlertsService";

class DiscoverBuddies extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isConnectedToFacebook: this.props.navigation.state.params.isConnectedToFacebook ? true : false,
			refreshing: false,
			friends: [],
			isLoading: true,
			// pageNo: 0,
		};
	}

	componentDidMount() {
		userData = this.props.userData;//To access in navigation
		if(!this.props.navigation.state.params.connected) {
			this.getFriends(0, false, true);
		} else {
			// user has connected with facebook
			// getFacebookFriends()
			// 	.then(response => {
			// 		this.setState({
			// 			// isConnectedToFacebook: true,
			// 			socialIdsFromFacebook: response
			// 		}, () => {
			// 			this.findFacebookFriends(response);
			// 		});
			// 	})
			// 	.catch(error => {
			// 		this.setState({ isGettingData: 3 });
			// 	});
		}
	}

	getFriends(pageNo, loadingMore, refreshing) {
    let headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.token,
      userid: this.props.userData._id
    };
    let params = {
      noOfRecords: 20,
      pageNo: pageNo,
      userId: this.props.userData._id
    };
    apiCall("users/getListOfUsers", params, headers)
      .then(response => {
        if (response.status) {
          let featured = new Array(), featuredObject;
          for(let i = 0; i < response.result.users.length; i++) {
            featuredObject = response.result.users[i];
            featuredObject.isProcessing = false;
            featured.push(featuredObject);
          }
          if (pageNo == 0) {
            this.setState({ isLoading: false, friends: featured });
          } else {
            tempData = this.state.friends.concat(featured);
            this.setState({ isLoading: false, friends: tempData });
          }
          if (response.result.nextPageAvailable) {
            this.setState({ nextPageAvailable: true });
          } else {
            this.setState({ nextPageAvailable: false });
          }
          if (loadingMore) {
            this.setState({ loadingMore: false });
          }
          if (refreshing) {
            this.setState({ refreshing: false });
          }
        } else {
          this.setState({ isLoading: false });
          if (loadingMore) {
            this.setState({ loadingMore: false });
          }
          if (refreshing) {
            this.setState({ refreshing: false });
          }
          setTimeout(() => {
            alert(response.message);
          });
        }
      })
      .catch(error => {
        this.setState({ isLoading: false });
        if (
          error.message ==
          "You are not authorized. Token required to access the API."
        ) {
          alert("Please login again. Your session has expired.");
          deleteUser("user");
          this.props.setUserData("");
          this.props.setToken("");
          navigateTo(this.props.navigation, 'GetStart')
        }
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
					this.setState({ refreshing: false, loading: false, isGettingData: 2 });
				} else {
					this.setState({
						loading: false,
						refreshing: false, 
					}, () => {
						navigateTo(this.props.navigation, 'Contacts')
					});
				}
			} else {
				this.setState({ loading: false, refreshing: false }, () => {
				});
				setTimeout(() => {
					alert("Failed", response.message);
				});
			}
		}).catch(error => {
			this.setState({ loading: false, refreshing: false }), () => {
					setTimeout(() => {
					alert("Failed", error.message ? error.message : 'Failed to get buddies!');
				});
			};
		})
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
			}).catch(error => {
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
			}).catch(error => {
			})
		}
	}

	hideUser(user, index) {
		// this.setState({ loading: true });
		const currentFriends = [...this.state.friends];
		currentFriends.splice(index, 1);
		this.setState({ friends: currentFriends });
		// this.setState({ loading: false });
	}

	connectToFacebook() {
		// login with facebook and get friends of user
		this.setState({ isLoading: true }, () => {
			facebookLogin()
				.then(facebookResponse => {
					this.setState({
						isLoading: false
					})
					navigateTo(this.props.navigation, 'Contacts')
					
					// this.setState({
					// 	// isConnectedToFacebook: true,
					// 	socialIdsFromFacebook: facebookResponse.friends
					// }, () => {
					// 	this.findFacebookFriends(facebookResponse.friends);
					// });
				})
				.catch(error => {
					this.setState({ loading: false }, () => {
						alert("Failed", error.message ? error.message : "Failed to Connect with Facebook!");
					});
				});
		});
	}

	renderPopularLogo(currentFriend) {
		if (currentFriend.starUser) {
			return (<Image source={Images.smallLogoWithGreenBg} style={DiscoverBuddiesStyle.listRowStyle.imagePopular}/>);
		}
	}

	renderPopular(currentFriend) {
		if (currentFriend.popular) {
			return (
				<Text style={DiscoverBuddiesStyle.listRowStyle.textPopular}>
					Popular
				</Text>
			);
		}
	}

	_keyExtractor = (item, index) => item._id;

	handleLoadMore = () => {
    if (!this.loadingMore) {
      if (this.state.nextPageAvailable) {
        this.setState(
          {
            pageNo: this.state.pageNo + 1,
            loadingMore: true
          },
          () => {
						this.getFriends(this.state.pageNo, true, false);
          }
        );
      }
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        pageNo: 0,
        refreshing: true
      },
      () => {
				this.getFriends(0, false, true);
      }
    );
  };
	
	renderListItem = ({ item, index }) => {
		return (
			<View key={item._id} style={DiscoverBuddiesStyle.listRowStyle.container}>
				<CachedImage
					style={DiscoverBuddiesStyle.listRowStyle.photo}
					source={{uri: item.profileImageUrl}}
					defaultSource={Images.defaultUser}
					fallbackSource={Images.defaultUser}
					activityIndicatorProps={{ display: "none", opacity: 0 }}
				/>
				<View style={DiscoverBuddiesStyle.listRowStyle.detailContainer}>
					<View style={DiscoverBuddiesStyle.listRowStyle.group2}>
						<View style={DiscoverBuddiesStyle.listRowStyle.usernameConatiner}>
							<Text style={DiscoverBuddiesStyle.listRowStyle.textUsername}>
								{item.username}
								{this.renderPopularLogo(item)}
							</Text>
							<Text style={DiscoverBuddiesStyle.listRowStyle.textFullname}>
								{item.name}
							</Text>
						</View>
						<View style={DiscoverBuddiesStyle.listRowStyle.buttonConatiner}>
							<Button onPress={() => this.followUser(item._id, index)} style={item.isFollowed
								? DiscoverBuddiesStyle.listRowStyle.followButtonFollowing
								: DiscoverBuddiesStyle.listRowStyle.followButton}>
								<View>
									<ScalableText style={item.isFollowed ? DiscoverBuddiesStyle.listRowStyle.followingButtonText: DiscoverBuddiesStyle.listRowStyle.followButtonText}>
										{item.isFollowed
											? 'Following'
											: 'Follow'}
									</ScalableText>
								</View>
							</Button>
							<Button onPress={() => this.hideUser(item._id, index)} style={DiscoverBuddiesStyle.listRowStyle.hideButton}>
								<View>
									<ScalableText style={DiscoverBuddiesStyle.listRowStyle.hideButtonText}>
										Hide
									</ScalableText>
								</View>
							</Button>
						</View>
					</View>
					{this.renderPopular(item)}
				</View>
			</View>
		);
	}

	renderPageMessage() {
		if (!this.state.isConnectedToFacebook) {
			return (
				<View style={DiscoverBuddiesStyle.group1}>
					<Image source={Images.facebook} style={DiscoverBuddiesStyle.facebookLogo}/>
					<View style={DiscoverBuddiesStyle.group1TextContainer}>
						<Text style={DiscoverBuddiesStyle.text1}>
							Connect to Facebook
						</Text>
						<Text style={DiscoverBuddiesStyle.text2}>
							Follow your buddies
						</Text>
					</View>
					<Button style={DiscoverBuddiesStyle.connectButton} onPress={this.connectToFacebook.bind(this)} underlayColor={Colors.secondaryDarker}>
						<Text style={DiscoverBuddiesStyle.connectButtonText}>
							Connect
						</Text>
					</Button>
				</View>
			);
		}
	}
	
	renderFooter = () => {
    if (this.state.loadingMore) {
      return (
        <ActivityIndicator
          animating
          size="small"
          style={{ zIndex: 10 }}
          color={Colors.primary}
        />
      );
    } else {
      return null;
    }
  };

	render() {
		return (
			<View style={DiscoverBuddiesStyle.pageContainer}>
				{this.renderPageMessage()}
				{!this.state.isLoading && (
					<FlatList
						data={this.state.friends}
						numColumns={1}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderListItem}
            // ListFooterComponent={this.renderFooter}
            // onEndReachedThreshold={0.01}
            // onEndReached={this.handleLoadMore}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            extraData={this.state}
            removeClippedSubviews={false}
					/>
				)}
				{this.state.isLoading && (
					<ActivityIndicator
						animating
						size="large"
						style={{
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center'
						}}
						color={Colors.primary}
					/>
				)}
			</View>
		);
	}
}

DiscoverBuddies.navigationOptions = ({ navigation }) => ({
  title: "DISCOVER BUDDIES",
  headerTitleStyle: Styles.headerTitleStyle,
  headerStyle: Styles.headerStyle,
  headerLeft: <Text />,
  headerRight: (
    <TouchableOpacity
			style={Styles.headerRightContainer}
			activeOpacity={0.5}
      onPress={() => navigateTo(navigation, 'AddProfilePicture')}
    >
      <Text
        style={[Styles.headerRightText, {
          color: Colors.primary,
          fontSize: 16.5,
					fontFamily: "ProximaNova-Regular",
					textAlign: 'right'
        }]}
      >
        Done
      </Text>
    </TouchableOpacity>
  )
});

const mapStateToProps = ({ authReducer }) => {
	const { loading, userData, token } = authReducer;
	return { loading, userData, token };
}
export default connect(mapStateToProps, { updateLoading })(DiscoverBuddies);
