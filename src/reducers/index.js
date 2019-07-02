import { combineReducers } from 'redux';
// import navReducer from './navigation' ;
import navReducer from './NavigationReducer' ;
import AuthReducer from './AuthReducer';
import UserActionReducer from './UserActionReducer';
import Permissions from './PermissionsReducer';
import GroupReducer from './GroupReducer';

const AppReducer = combineReducers({
  nav: navReducer,
  authReducer: AuthReducer,
  userActionReducer: UserActionReducer,
  permissions: Permissions,
  groupReducer: GroupReducer,
});

export default AppReducer;
