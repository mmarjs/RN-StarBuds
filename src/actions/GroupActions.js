export const updateGroups = data => {
  return dispatch => {
    dispatch({
      type: "UPDATE_GROUPS",
      payload: data
    });
  };
};

export const addGroup = data => {
  return dispatch => {
    dispatch({
      type: "ADD_GROUP",
      payload: data
    });
  };
};

export const updateSingleGroup = data => {
  return dispatch => {
    dispatch({
      type: "UPDATE_SINGLE_GROUP",
      payload: data
    });
  };
};

export const deleteSingleGroup = data => {
  return dispatch => {
    dispatch({
      type: "DELETE_SINGLE_GROUP",
      payload: data
    });
  };
};

export const deleteGroups = data => {
  return dispatch => {
    dispatch({
      type: "DELETE_GROUPS",
      payload: data
    });
  };
};
