export const initialState = {
  newClientVisible: false,
  lockScroll: false,
};

export const viewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_ADD_CLIENT':
      return { ...state, newClientVisible: true, lockScroll: true };
    case 'HIDE_ADD_CLIENT':
      return { ...state, newClientVisible: false, lockScroll: false };
    default:
      return state;
  }
};
