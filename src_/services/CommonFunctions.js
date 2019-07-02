import Moment from "moment";
import { Clipboard, Dimensions, NetInfo, Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';

const X_WIDTH = 375;
const X_HEIGHT = 812;

export function calculateTimeDuration(createdTime) {
  let currentDate = new Date().toISOString();
  const diffDuration = Moment.duration(
    Moment(currentDate).diff(Moment(createdTime))
  );
  let str = '';
  diffDuration.seconds() > 0 && diffDuration.minutes() < 1
    ? str = 'now'
    : null;
  diffDuration.minutes() >= 1
    ? diffDuration.minutes() == 1 ? str = ` ${diffDuration.minutes()} min` : str = ` ${diffDuration.minutes()} mins`
    : null;
  diffDuration.hours() > 0
    ? diffDuration.hours() == 1 ? str = ` ${diffDuration.hours()} hour` : str = ` ${diffDuration.hours()} hours`
    : null;
  diffDuration.days() > 0 
    ? diffDuration.days() == 1 ? str = ` ${diffDuration.days()} day` : str = ` ${diffDuration.days()} days`
    : null;
  diffDuration.months() > 0
    ? diffDuration.months() == 1 ? str = ` ${diffDuration.months()} month` : str = ` ${diffDuration.months()} months`
    : null;
  diffDuration.years() > 0
    ? diffDuration.years() == 1 ? str = `${diffDuration.years()} year` : str = `${diffDuration.years()} years`
    : null;
  return str;
}

export  async function writeToClipboard(value) {
  await Clipboard.setString(value);
  alert('Copied to Clipboard!');
};

export function calculateTimeDurationShort(createdTime) {
  let currentDate = new Date().toISOString();
  const diffDuration = Moment.duration(
    Moment(currentDate).diff(Moment(createdTime))
  );
  let str = '';
  diffDuration.seconds() >= 0 && diffDuration.minutes() < 1
    ? str = 'now'
    : null;
  diffDuration.minutes() >=1
    ? str = (` ${diffDuration.minutes()} min`)
    : null;
  diffDuration.hours() > 0
    ? str = (` ${diffDuration.hours()} h`)
    : null;
  diffDuration.days() > 0 
    ? str = (` ${diffDuration.days()} d`) 
    : null;
  diffDuration.months() > 0
    ? str = (` ${diffDuration.months()} mon`)
    : null;
  diffDuration.years() > 0
    ? str = (`${diffDuration.years()} y`)
    : null;
  return str;
}

export function calculateTimeDurationShortNoSpace(createdTime) {
  let currentDate = new Date().toISOString();
  const diffDuration = Moment.duration(
    Moment(currentDate).diff(Moment(createdTime))
  );
  let str = '';
  diffDuration.seconds() >= 0 && diffDuration.minutes() < 1
    ? str = 'now'
    : null;
  diffDuration.minutes() >=1
    ? str = (` ${diffDuration.minutes()}min`)
    : null;
  diffDuration.hours() > 0
    ? str = (` ${diffDuration.hours()}h`)
    : null;
  diffDuration.days() > 0 
    ? str = (` ${diffDuration.days()}d`) 
    : null;
  diffDuration.months() > 0
    ? str = (` ${diffDuration.months()}m`)
    : null;
  diffDuration.years() > 0
    ? str = (`${diffDuration.years()}y`)
    : null;
  return str;
}
export function generateThumbnailName(url) {
  if (url.includes("post_videos_transcoded")) {
    url = url.replace("post_videos/", "");
    url = url.replace(".mov", ".mov_thumbnail_00001.jpg");
    return url;
  } else {
    return "http://hiapseng-thailand.com/wp-content/themes/skywalker/facilities/video-placeholder.jpg";
  }
}

export function findIndex(arr, object) {
  for(let i=0; i<arr.length; i++) {
    if(arr[i]._id == object._id) {
      return i;
    } else {
      return -1;
    }
  }
}


export function mapFacebookFriends(friends) {
  let ids = [];
  friends.map((item, index) => {
    ids.push({ id: item.id });
  });
  return ids;
}

export function getCurrentRouteName (navigationState) {
  if (!navigationState || !navigationState.routes) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

export function filterArrayByValue(array, valueToBeFiltered) {
  return array.filter(item => {
    return item !== valueToBeFiltered;
  });
}

export function filterArrayBy_id(array, valueToBeFiltered) {
  return array.filter(item => {
    return item._id !== valueToBeFiltered._id;
  });
}

export function checkNetworkConnection() {
  // return NetInfo.isConnected.fetch();
  return NetInfo.isConnected;
};

export function navigateTo(navigation, route, params) {
  // console.log('In navigateTo', navigation, route, params)
  navigation.dispatch(
    NavigationActions.navigate({
      routeName: route,
      params: params ? params : {}
    })
  );
}

export const isIPhoneX = () => {
  const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

  return Platform.OS === 'ios' &&
    ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
      (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT));
}