import React, { Component } from 'react';
import {
	Modal,
	Text,
	TouchableOpacity,
	View,
	Image,
	FlatList,
	TouchableWithoutFeedback,
	DeviceEventEmitter,
	Dimensions
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Card, CardSection, Button, CustomPicker } from '../../components';
import { Images, Colors, Styles } from './../../theme';
import { AddLocationModalStyle } from './AddLocationModalStyle';
import Input from '../../components/Input/Input';

const screenWidth = Dimensions.get( 'window' ).width;

const placeDetails = '';
const placeData = '';

const backAction = NavigationActions.back({
  key: null
})

export default class AddLocationModal extends Component {

	constructor( props ) {
		super( props );
		this.updateSelectedLocationAndGoBack = this.updateSelectedLocationAndGoBack.bind(this);
		this.cancelSelectedLocation = this.cancelSelectedLocation.bind(this);
		this.state = {
			addLocationModalVisible: false,
			data: '',
      details: '',
      searchText: ''
		};
	}

	static navigationOptions = ({ navigation }) => ({
    title: "LOCATIONS",
    headerTitleStyle: Styles.headerTitleStyle,
    headerStyle: Styles.headerStyle,
    tabBarVisible: false,
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params.updateSelectedLocationAndGoBack();
        }}
        style={Styles.headerLeftContainer}
        activeOpacity={0.5}
      >
				<Image source={Images.searchLocationIcon} 
					style={[Styles.headerLeftImage, {
						width: 16.7,
						height: 16.7,
					}]}/>
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params.cancelSelectedLocation();
        }}
        style={Styles.headerRightContainer}
        activeOpacity={0.5}
      >
        <Text style={[Styles.headerRightText, AddLocationModalStyle.cancelButton]}>Cancel</Text>
      </TouchableOpacity>
    )
	});
	
	updateSelectedLocationAndGoBack( ) {
		let fromLocation;
		if (placeData == '') {
			DeviceEventEmitter.emit('locationUpdated', ({ description: '', address: '', latidute: 0, longitude: 0 }));
			this.props.navigation.dispatch( backAction );
		} else if (placeData.address ) {
			DeviceEventEmitter.emit('locationUpdated', ({ description: placeData.description, address: placeData.address, latidute: placeData.latitude, longitude: placeData.longitude }));
			this.props.navigation.dispatch( backAction );
		} else {
			DeviceEventEmitter.emit('locationUpdated', ({ description: placeData.description, address: placeDetails.formatted_address, latidute: placeDetails.geometry.lat, longitude: placeDetails.geometry.lng }));
			this.props.navigation.dispatch( backAction );
		}
	}

	cancelSelectedLocation() {
		DeviceEventEmitter.emit('locationUpdated', ({ description: '', address: '', latidute: 0, longitude: 0 }));
		this.props.navigation.dispatch( backAction );
	}

	componentDidMount() {
    this.props.navigation.setParams({
      updateSelectedLocationAndGoBack: this.updateSelectedLocationAndGoBack,
      cancelSelectedLocation: this.cancelSelectedLocation
    });
  }

  handleClearSearchText = () => {
    this.setState({searchText: ''})
  }

  handleChangeSearchText = (text) => {
    this.setState({searchText: text})
  }

	renderGooglePlacesSearch() {
    let textInputProps = {   
      onChangeText: this.handleChangeSearchText,
      clearButtonMode: 'never'
    }
    return (
      <GooglePlacesAutocomplete
        placeholder='Find a location'
        minLength={2}
        autoFocus={false}
        returnKeyType={'search'}
        fetchDetails={true}
        onPress={(data, details = null) => {
          placeData = data;
          placeDetails = details;
        }}
        text = {this.state.searchText}
        textInputProps={textInputProps}
        query={{
          key: 'AIzaSyCkQ1J7oWibyKiLR2MR01jBwSWA50ts9nA',
        }}
        styles={{
          textInputContainer: {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderTopWidth: 0,
            paddingLeft: 26.7,
            borderBottomWidth: 0.7,
            borderBottomColor: 'rgba(255,255,255,0.17)'
          },
          textInput: {
            color: Colors.white,
            backgroundColor: 'transparent',
            fontSize: 16,
          },
          description: {
            fontFamily: 'ProximaNova-Regular',
            fontSize: 14,
            letterSpacing: 0.7,
            color: '#FFF',
          },
          predefinedPlacesDescription: {
            fontFamily: 'ProximaNova-Regular',
            fontSize: 14,
            letterSpacing: 0.7,
            color: '#FFF',
          },
          separator: {
            width: screenWidth - 26.7,
          }
        }}
        predefinedPlaces={this.props.navigation.state.params.nearByLocations}
        predefinedPlacesAlwaysVisible={false}
        currentLocation={false}
        renderLeftButton={() =>
          <View style={{flex: 0.1, flexDirection: 'row', alignItems: 'center'}}>
            <Image source={Images.searchIcon} style={AddLocationModalStyle.searchIcon} />
          </View>
        }
        renderRightButton={this.renderClearSearchTextButton}
      />
    );
  }

  renderClearSearchTextButton = () => {
    if(this.state.searchText === '') { 
      return null
     } else{
      return (
        <TouchableOpacity 
          style={AddLocationModalStyle.cancelSearchButton}
          onPress={() => {this.handleClearSearchText()}}
         >
         <View>
            <Image source={Images.closeIconWhite} style={AddLocationModalStyle.closeIcon} />
         </View>
        </TouchableOpacity>
        )
     }
  }

	renderListItem = ({ item }) => (
		<TouchableWithoutFeedback onPress={( ) => {
			this.updateSelectedLocationAndGoBack( )
		}}>
			<View style={AddLocationModalStyle.listItemContainer}>
				<Text style={AddLocationModalStyle.locationText}>{item.location}</Text>
				<Text style={AddLocationModalStyle.addressText}>{item.address}</Text>
			</View>
		</TouchableWithoutFeedback>
	);

	renderDefaultList( ) {
		if ( this.props.selectedLocation == '' ) {
			return ( <FlatList data={this.props.nearByLocations} numColumns={1} keyExtractor={( item, index ) => item.id} onEndReachedThreshold={1} renderItem={this.renderListItem}/> );
		}
	}

	render() {
		return (
			<View style={AddLocationModalStyle.container}>
					{this.renderGooglePlacesSearch()}
			</View>
		);
	}
}
