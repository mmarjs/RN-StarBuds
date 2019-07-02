import { Dimensions } from 'react-native';
import { Colors } from '../../theme';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const SignUpStyle = {
	container: {
		flex:1,
		flexDirection: 'column',
		borderTopWidth: 1,
		backgroundColor: 'black',
		borderColor: 'rgba(255, 255, 255, 0.17)'
	},
	imageContainer: {
    height: screenHeight,
    width: screenWidth,
    backgroundColor: Colors.black,
  },
	messageContainer: {
		flex: 0.2,
	},
	formContainer: {
		flex: 0.6,
	},
	footerContainer: {
		flex: 0.2,
		// flexWrap: 'wrap'
	},
	datePickerStyle: {
		paddingLeft: 2,
		paddingRight: 30,
		backgroundColor: Colors.inputBackground,
		height: 53,
		width: null
	},
	loingFbTextContainer: {
		// paddingLeft: (screenWidth >= 414 && screenHeight >= 736) ? 70 : 60,
		// paddingRight: (screenWidth >= 414 && screenHeight >= 736) ? 70 : 60,
		width: 256.3,
		alignSelf: 'center',
		paddingTop: 50
	},
	btnText: {
		color: Colors.black,
		fontSize: 18,
		fontWeight: 'bold',
		letterSpacing: 0.8,
		fontFamily: 'SourceSansPro-Bold',
		textAlign: 'center'
	},
	signUpButton: {
		alignSelf : 'center',
		backgroundColor: Colors.clearTransparent,
		width: 240,
		height : 30,
		marginTop : 30,
	},
	baseText: {
		width: 240,
		fontSize: 14,
		textAlign: 'left',
		color : 'white',
		letterSpacing: 0.8,
		fontFamily: 'SourceSansPro-Regular',
	  },
	LoginText: {
		marginLeft : 50,
		width : screenWidth,
		color: Colors.white,
		fontSize: 32,
		fontFamily: 'SourceSansPro-Bold',
		backgroundColor : Colors.clearTransparent,
		paddingTop : screenHeight * 0.07,
		textAlign : 'left'
	},
	loingFbText: {
		color: Colors.white,
		fontSize: 16,
		fontWeight: 'bold',
		letterSpacing: 0.8,
		fontFamily: 'ProximaNova-Bold',
    textAlign: 'center'
	},
	btnTextContainer: {
		// paddingLeft: (screenWidth >= 414 && screenHeight >= 736) ? 70 : 60,
		width: 256.3,
		alignSelf: 'center',
		marginTop: 30
	},
	orText: {
		color: 'white',
		fontSize: 10,
		letterSpacing: 0.6,
		textAlign: 'center',
		fontFamily: 'SourceSansPro-Regular',
		backgroundColor : Colors.clearTransparent
	},
	termsText:{
  color: Colors.white,
	fontSize: 12,
	letterSpacing: 0.6,
	textAlign: 'center',
	textDecorationLine: 'underline',
	fontWeight:'600',
	fontFamily: 'ProximaNova-Light',
	},
	datePickerCustomStyle: {
		dateIcon: {
			position: 'absolute',
			left: 0,
			top: 4,
			marginLeft: 0,
			width: 20,
			height: 20,
			marginTop: 16,
			tintColor : 'white'
		},
		placeholderText: {
			color: 'white',
			fontSize: 14,
			fontFamily: 'Helvetica'
		},
		datePickerCon: {
			backgroundColor: Colors.black
		},
		datePicker: {
			backgroundColor: Colors.dark
		},
		btnTextConfirm: {
			color: Colors.white
		},
		dateInput: {
			borderWidth: 0,
			marginTop: 16,
			marginLeft: 28,
			alignItems: 'flex-start'
		},
		dateText: {
			color: Colors.white
		}
	},
	genderText: {
		flex: 1,
		marginTop: 15,
		fontSize: 16,
		marginLeft: -10,
		letterSpacing: 0.8,
		fontFamily: 'ProximaNova-Light',
		borderWidth: 0
	},
	genderContainerStyle: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: Colors.inputBackground,
		height: 53,
		paddingLeft: 30,
		paddingRight: 30
	},
	iconStyle: {
		width: 12.3,
		height: 15.7,
		marginTop: 16
	},
	iconStyle2: {
		width: 12.3,
		height: 15.7,
		marginTop: 16,
		right : 25
	},
	errorText: {
		color: Colors.blackTransparent,
		paddingTop: 5,
		paddingLeft: 30,
		paddingRight: 30,
		paddingBottom: 5,
		fontFamily: 'ProximaNova-Regular'
	}
};
