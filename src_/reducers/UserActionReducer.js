export const INITIAL_STATE = {
  taggedPeople: [],
  taggedPeopleForCompare: [],
  facebookFriends: [],
  currentScreen: 'GetStart',
}
export default function UserActionReducer(state = [INITIAL_STATE], action){
  switch (action.type) {
    case 'TAGGED_PEOPLE':
      return { ...state, taggedPeople: action.payload };
      break;
    case 'TAGGED_PEOPLE_FOR_COMPARE':
      return { ...state, taggedPeopleForCompare: action.payload };
      break;
    case 'UPDATE_CURRENT_SCREEN':
      return { ...state, currentScreen: action.payload };
      break;
    default:
     return state;
  }
}
