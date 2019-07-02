import { filterArrayBy_id, filterArrayByValue } from "../services/CommonFunctions";

export const INITIAL_STATE = {
  groups: [],
  isGroupsAvailable: 0
};
export default function GroupReducer(state = INITIAL_STATE, action) {
  let updateIsGroupAvailable = 0;
  switch (action.type) {
    case "UPDATE_GROUPS":
      if (action.payload.length > 0) {
        updateIsGroupAvailable = 2;
      } else {
        updateIsGroupAvailable = 1;
      }
      return { ...state, groups: action.payload, isGroupsAvailable: updateIsGroupAvailable };
      break;
    case "ADD_GROUP":
      let updatedGroups = state.groups.concat(action.payload);
      return { ...state, groups: updatedGroups, isGroupsAvailable: 2 }
    case "UPDATE_SINGLE_GROUP":
      const updatedGroups1 = [...state.groups];
      const newGroup = action.payload;
      updatedGroups1 = filterArrayBy_id(updatedGroups1, newGroup);
      updatedGroups1.push(newGroup);
      return { ...state, groups: updatedGroups1, isGroupsAvailable: 2 };
      break;
    case "DELETE_SINGLE_GROUP":
      const tempGroups = [...state.groups];
      const groupToBeDeleted = action.payload;
      tempGroups = filterArrayByValue(tempGroups, groupToBeDeleted);
      if (tempGroups.length > 0) {
        updateIsGroupAvailable = 2;
      } else {
        updateIsGroupAvailable = 1;
      }
      return { ...state, groups: tempGroups, isGroupsAvailable: updateIsGroupAvailable };
      break;
    case "DELETE_GROUPS":
      return { ...state, groups: [], isGroupsAvailable: 1 };
      break;
    default:
      return state;
      break;
  }
}
