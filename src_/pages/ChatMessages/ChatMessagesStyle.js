import { Colors, Images } from '../../theme';
import { Dimensions } from 'react-native';

const screenHeight = Dimensions.get( 'window' ).height;
const screenWidth = Dimensions.get( 'window' ).width;

export const ChatMessagesStyle = {
    chatMessageContainer: {
        flex: 1,
        backgroundColor: 'rgb(11,11,11)'
    },
    captionContainer: {
        flexDirection:'row',
        // borderBottomWidth: 1,
        // borderBottomColor: 'rgba(255,255,255,0.35)',
        marginTop: 5,
        marginBottom: 5,
        paddingBottom: 10,
        maxWidth: screenWidth * 0.7,
        //width: screenWidth * 0.7
    },
    chatMessage: {
        maxWidth: screenWidth * 0.7 - 10
    },
    caption: {
        color:'#FFF',
        marginLeft: 10,
        marginRight: 10,
        fontSize: 13.6,
    },
    captionName: { 
        //color:'#FFF',
        fontFamily:'ProximaNova-Bold',
        //marginLeft: 10,
        //fontSize: 13.6,
        //flex: 0.2
    },
    captionText: {
        color:'#FFF',
        marginLeft: 10,
        marginRight: 10,
        fontSize: 13.6,
        //flex: 0.8
    },
    universalFont: {
        fontFamily: 'ProximaNova-Regular'
    },
    postContainer: {
        backgroundColor: 'rgb(22,22,22)',
        width: screenWidth * 0.7, 
        flexDirection:'row',
        alignItems:'center',
        marginBottom: 10,
        marginTop:10,
        borderRadius: 15
    },
    bubbleImage: {
        height: screenWidth * 0.7,
        width: screenWidth * 0.7,
        borderRadius: 0
    },
    postProfileImage:{ 
        width: screenWidth/12,
        height: screenWidth/12,
        borderRadius: screenWidth/12/2
    },
    videoIcon: {
        height: 21.7,
        width: 27.7,
        right: 0,
      },
    multipleImagesIcon: {
        height: 26.3,
        width: 28.3,
        right: 0,
    },
    infoIconStyle: {
        height : 17.3,
        width : 17.3,
        borderRadius : 8.65,
        borderColor : '#FFF',
        borderWidth : 2,
        justifyContent : 'center',
        alignItems : 'center'
    }
}
