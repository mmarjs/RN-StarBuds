
export const INITIAL_STATE = {
  userData:{},
  token:'',
  loading:false,
}

// export default function AuthReducer(state = [INITIAL_STATE], action){
export default function AuthReducer(state = {}, action) {
  switch (action.type) {
    case 'USER_DATA':
      return { ...state, userData: action.payload };
      break;
    case 'TOKEN':
      return { ...state, token: action.payload };
      break;
    case 'UPDATE_LOADING':
      return { ...state, loading:action.payload };
      break;
    default:
     return state;
     break;
  }
}
