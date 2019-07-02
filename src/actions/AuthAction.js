export const setUserData = ( userData ) => {
  return ( dispatch ) => {
    dispatch({
      type:'USER_DATA',
      payload:userData
    });
  };
};

export const setToken = ( token ) => {
  return ( dispatch ) => {
    dispatch({
      type:'TOKEN',
      payload:token
    });
  };
};

export const updateLoading = ( loader ) => {
  return ( dispatch ) => {
    dispatch({
      type:'UPDATE_LOADING',
      payload:loader
    });
  };
};
