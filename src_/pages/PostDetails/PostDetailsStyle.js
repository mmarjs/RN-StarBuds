import { Dimensions } from 'react-native';
import { Colors } from './../../theme';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const PostDetailsStyle = {
	container: {
		flex: 1,
		backgroundColor: '#0a0a0a',
		borderTopWidth: 0.7,
    borderTopColor: "rgba(255, 255, 255, 0.17)"
	},
};
