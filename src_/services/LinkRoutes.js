import Path from 'path-parser';
import {NavigationActions} from 'react-navigation';
import { apiCall } from "./AuthService";

const paths = [
  {
    routeName: 'PostHome',
    path: new Path('/post/:id'),
  }
];

const findPath = url => paths.find(path => path.path.test(url));

export default (url, store) => {
  const pathObject = findPath(url);
  console.log("pathObject ----- -"+url);
  if (!pathObject) return;
  if(pathObject == 'login') {
    const state = store.getState();
    store.dispatch(NavigationActions.navigate({
      routeName: 'Login',
      params: {},
    }));
  } else {
    const state = store.getState();
    const {token,userData} = state.authReducer;
    if(!token){
      store.dispatch(NavigationActions.navigate({
        routeName: 'Login',
        params: {},
      })
      );
      return;
    }
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      'userid': userData._id
    };
    let params = {
      'id': pathObject.path.test(url).id,
      'userId': userData._id
    };
    apiCall('posts/getSinglePost', params, headers).then((response) => {
      if(response.status){
        const currentPost = response.result[0];
        // const navigateAction = NavigationActions.navigate({
        //   routeName: pathObject.routeName,
        //   type: pathObject.routeName,
        //   params: {
        //     post:currentPost,
        //     user: currentPost.userDetail[0],
        //     isHome: true
        //   },
        // });
        const navigateAction = {
          routeName: pathObject.routeName,
          type: pathObject.routeName,
          params: {
            post:currentPost,
            user: currentPost.userDetail[0],
            isHome: true
          },
        };
        store.dispatch(navigateAction);
      } else {
        const navigateAction = NavigationActions.navigate({
          routeName: 'Tabs',
          params: {}
        });
        store.dispatch(navigateAction);
      }
    });
  }
  


};
