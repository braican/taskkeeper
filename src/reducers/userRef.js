export const initialState = null;

export const userRefReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_USER_REF':
      return action.ref;
    case 'REMOVE_USER_REF':
      return null;
    default:
      return state;
  }
};
