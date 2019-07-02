import {
    Colors,
    Images
} from '../../theme';
import {
    Dimensions
} from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
import {
    isIPhoneX
} from '../../services/CommonFunctions';

export const AllChatsStyle = {
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        borderTopWidth: 0.7,
        borderTopColor: 'rgba(255, 255, 255, 0.10)',
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#000',
        justifyContent: 'flex-start',
        // paddingTop: 10.5,
        // paddingBottom: 10.5,
        backgroundColor: 'blue',
    },
    inputStyle: {
        flex: 0.05,
        flexDirection: 'row',
        backgroundColor: '#000',
        justifyContent: 'flex-start',
        // paddingTop: 10.5,
        // paddingBottom: 10.5,
        backgroundColor: 'blue',
        // fontSize: 16,
        // flex: 1,
        // marginLeft: 26.7,
        // letterSpacing: 0.8,
        // borderWidth: 0,
        // color: Colors.white,
        // fontFamily: 'ProximaNova-Light',
        // backgroundColor: 'blue',
    },
    flatListContainer: {
        flex: 1,
        backgroundColor: '#0a0a0a'
    },
    addPhotoContainer: {
        flex: 0.09,
        backgroundColor: Colors.black,
        justifyContent: 'center',
        alignItems: 'center'
    },
    chatUserImageContainer: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    chatUserProfileImage: {
        height: screenHeight / 15,
        width: screenHeight / 15,
        borderRadius: (screenHeight / 15) / 2,
    },
    chatName: {
        color: Colors.white,
        fontSize: 16.5
    },
    chatTimestamp: {
        flex: 0.2,
        alignItems: 'center'
    },
    chatDetail: {
        flex: 0.6
    },
    addPhotoImage: {
        width: 23.7,
        height: 23.7
    },
    flatItemContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center'
    },
    boldFont: {
        fontFamily: 'ProximaNova-Bold'
    },
    noChatsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    noChatsText: {
        fontSize: 18,
        color: Colors.white
    },
    emptyContainer: {
        flex:1,
        marginTop: isIPhoneX() ? -110 : -110,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: '#0a0a0a'
    },
    noChatsText1: {
        alignSelf: 'center',
        fontSize: 20.1,
        fontFamily: 'ProximaNova-Regular',
        color: 'rgba(255, 255, 255, 0.18)',
        letterSpacing: 1,
        marginBottom: 30,
        backgroundColor: 'transparent'
    },
    noChatsImage: {
        height: 87,
        width: 87,
        alignSelf: 'center',
        marginBottom: 37
    },
    noMessagesImage: {
        height: 60,
        width: 63.7
    },
    noMessagesText1: {
        marginTop: 30,
        fontFamily: "ProximaNova-Bold",
        fontSize: 20.1,
        letterSpacing: 1.0,
        color: Colors.white,
        textAlign: 'center'
    },
    noMessagesText2: {
        fontFamily: "ProximaNova-Light",
        fontSize: 12,
        letterSpacing: 0.6,
        color: Colors.warmGrey,
        textAlign: 'center',
        marginTop: 20,
        lineHeight: 20,
        marginHorizontal: 75
    },
    greenDot: {
        height: 10.7,
        width: 10.7,
        borderRadius: 5.35,
        backgroundColor: Colors.primary
    }
}