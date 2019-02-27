const initialState = {
  clients: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CLIENT':
      return { ...state };
    default:
      return state;
  }
};

export default rootReducer;
