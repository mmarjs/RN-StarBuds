import { Dimensions } from 'react-native';
import { Colors } from '../../theme';
const screenWidth = Dimensions.get( 'window' ).width;
const screenHeight = Dimensions.get( 'window' ).height;

export const SignUpWithFacebookStyle = {
	textContainerStyle: {
		paddingLeft: ( screenWidth >= 414 && screenHeight >= 736 )
			? 70
			: 5,
		paddingRight: ( screenWidth >= 414 && screenHeight >= 736 )
			? 70
			: 5,
		height: ( screenWidth >= 414 && screenHeight >= 736 )
			? 100
			: 70
	},
	datePickerStyle: {
		paddingLeft: 30,
		paddingRight: 30,
		backgroundColor: Colors.inputBackground,
		height: 53,
		width: null
	},
	loingFbText: {
		color: Colors.white,
		fontSize: 16,
		fontWeight: 'bold',
		letterSpacing: 0.8
	},
	btnText: {
		color: Colors.white,
		fontSize: 16,
		fontWeight: 'bold',
		letterSpacing: 0.8
	},
	btnTextDisabled: {
		color: 'rgba(255, 255, 255, 0.5)',
		fontSize: 16,
		fontWeight: 'bold',
		letterSpacing: 0.8
	},
	orText: {
		color: Colors.white,
		fontSize: 12,
		letterSpacing: 0.6,
		textAlign: 'center'
	},
	datePickerCustomStyle: {
		dateIcon: {
			position: 'absolute',
			left: 0,
			top: 4,
			marginLeft: 0,
			width: 12.3,
			height: 13.7,
			marginTop: 16
		},
		placeholderText: {
			color: Colors.placeholderTextColor,
			fontFamily: 'ProximaNova-Light'
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
			alignItems: 'flex-start',
			backgroundColor: Colors.inputBackground
		},
		dateText: {
			color: Colors.white
		},
		disabled: {
			backgroundColor: Colors.inputBackground
		}
	},
	datePickerCustomStyleError: {
		dateIcon: {
			position: 'absolute',
			left: 0,
			top: 4,
			marginLeft: 0,
			width: 12.3,
			height: 13.7,
			marginTop: 16
		},
		placeholderText: {
			color: 'rgba(255,255,255,0.20)',
			fontFamily: 'ProximaNova-Light'
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
			alignItems: 'flex-start',
			backgroundColor: Colors.inputBackground
		},
		dateText: {
			color: Colors.white
		},
		disabled: {
			backgroundColor: Colors.errorBackgroundColor
		}
	},
	genderText: {
		flex: 1,
		marginTop: 15,
		fontSize: 16,
		marginLeft: 15,
		letterSpacing: 0.8,
		borderWidth: 0,
		fontFamily: 'ProximaNova-Light'
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
	errorText: {
		color: Colors.blackTransparent,
		paddingTop: 5,
		paddingLeft: 30,
		paddingRight: 30,
		paddingBottom: 5,
		fontFamily: "ProximaNova-Regular"
	},
	text: {
		color: 'black',
		fontSize: 20.1,
		textAlign: 'center',
		fontFamily: "SourceSansPro-Bold",
		lineHeight: 23.26,
		letterSpacing: 1.0,
		marginLeft: 15,
		marginRight: 15,
	},
	signupBtnContainer: {
		paddingLeft:  ( screenWidth >= 414 && screenHeight >= 736 )
			? 70
			: 60,
		paddingRight: ( screenWidth >= 414 && screenHeight >= 736 )
			? 70
			: 60,
		paddingTop: 15
	}
};
