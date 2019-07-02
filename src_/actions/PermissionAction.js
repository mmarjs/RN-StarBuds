export const setPermissions = ( permissionFor,permissionStatus ) => {
  return ( dispatch ) => {
    dispatch({
      type:'SET_PERMISSION',
      permissionFor,
      permissionStatus
    });
  };
};