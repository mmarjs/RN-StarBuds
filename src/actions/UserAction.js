export const setTaggedPeople = ( data ) => {
  return ( dispatch ) => {
    dispatch({
      type:'TAGGED_PEOPLE',
      payload:data
    });
  };
};

export const setTaggedPeopleForCompare = ( data ) => {
  return ( dispatch ) => {
    dispatch({
      type:'TAGGED_PEOPLE_FOR_COMPARE',
      payload:data
    });
  };
};

export const updateCurrentScreen = ( data ) => {
  return ( dispatch ) => {
    dispatch({
      type:'UPDATE_CURRENT_SCREEN',
      payload:data
    });
  };
}

export const setHashTagsPost = ( data ) => {
  return ( dispatch ) => {
    dispatch({
      type: 'SET_HASH_TAGS_POST',
      payload:data 
    });
  };
};
