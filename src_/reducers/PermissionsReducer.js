const INIT_STATE = {
  camera: {
    status: ''
  },
  photo: {
    status: ''
  }
}
export default function PermissionsReducer(state = INIT_STATE, action){
  switch (action.type) {
    case 'SET_PERMISSION':
      return {...state,[action.permissionFor]: {status:action.permissionStatus} };

    default:
     return state;
  }
}